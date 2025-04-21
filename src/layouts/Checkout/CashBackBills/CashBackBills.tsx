import { useEffect, useState } from "react";
import { Till } from "@/infrastructure/interfaces/till.interface";
import { Button } from "@/components/ui/button";
// Importa el Dialog y sus subcomponentes de shadcn
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import Money from "@/components/Bills/Money/Money";
import { DEFAULT_DENOMINATIONS } from "@/lib/database.types";

interface Props {
  till: Till;
  objectiveValue: number;
  counted?: boolean;
  onValueChange: (amount: number, bills: { [key: string]: number }) => void;
}

const defaultProps = {
  counted: true,
};

const CashBackBills = ({
  till,
  objectiveValue,
  counted = defaultProps.counted,
  onValueChange,
}: Props) => {
  const [value, setValue] = useState<number>(0);
  const [bills, setBills] = useState<{ [key: string]: number }>({});
  const [mode, setMode] = useState<"add" | "subtract">("add");
  const [availableBills, setAvailableBills] = useState<{
    [key: string]: number;
  }>({});
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<{ [key: string]: number }[]>(
    []
  );
  const [canReachObjective, setCanReachObjective] = useState<boolean>(true);

  // Inicializa los billetes disponibles desde el objeto till
  useEffect(() => {
    if (till && till.bills) {
      setAvailableBills(till.bills);
    }
  }, [till]);

  // Maneja el clic en un billete (agregar o quitar)
  const clickBill = (amount: number) => {
    const amountStr = `${amount}`;
    const maxAvailable = availableBills[amountStr] || 0;

    if (mode === "add") {
      // Evita que el valor supere el objetivo
      if (value + amount > objectiveValue) return;

      setBills((prevBills) => {
        const currentCount = prevBills[amountStr] || 0;
        if (currentCount < maxAvailable) {
          const newBills = { ...prevBills, [amountStr]: currentCount + 1 };
          setValue((prevValue) => prevValue + amount);
          return newBills;
        }
        return prevBills;
      });
    } else {
      setBills((prevBills) => {
        const currentCount = prevBills[amountStr] || 0;
        if (currentCount > 0) {
          const newBills = { ...prevBills, [amountStr]: currentCount - 1 };
          if (newBills[amountStr] === 0) {
            delete newBills[amountStr];
          }
          setValue((prevValue) => Math.max(0, prevValue - amount));
          return newBills;
        }
        return prevBills;
      });
    }
  };

  // Notifica cambios en el valor y en los billetes seleccionados
  useEffect(() => {
    onValueChange(value, bills);
  }, [value, bills, onValueChange]);

  // Calcula las posibles combinaciones para llegar al objetivo
  useEffect(() => {
    const possibleCombinations = getPossibleCombinations(
      availableBills,
      objectiveValue
    );
    if (possibleCombinations.length > 0) {
      setSuggestions(possibleCombinations);
      setCanReachObjective(true);
    } else {
      setSuggestions([]);
      setCanReachObjective(false);
    }
  }, [availableBills, objectiveValue]);

  // Algoritmo básico para obtener combinaciones posibles (problema de la combinación de monedas)
  const getPossibleCombinations = (
    billsAvailable: { [key: string]: number },
    target: number
  ): { [key: string]: number }[] => {
    // Filter and sort denominations
    const denominations = Object.keys(billsAvailable)
      .map(Number)
      .filter((denom) => (billsAvailable[`${denom}`] || 0) > 0)
      .sort((a, b) => b - a);

    // Early termination check - can we reach the target at all?
    const totalAvailable = denominations.reduce(
      (sum, denom) => sum + denom * (billsAvailable[`${denom}`] || 0),
      0
    );
    if (totalAvailable < target) return [];

    // Limit results to avoid performance issues
    const maxResults = 5;
    const results: { [key: string]: number }[] = [];
    const seenSolutions = new Set<string>();

    // Try greedy approach first (usually gives a good solution)
    const greedySolution: { [key: string]: number } = {};
    let remainingTarget = target;

    for (const denom of denominations) {
      const available = billsAvailable[`${denom}`] || 0;
      const count = Math.min(Math.floor(remainingTarget / denom), available);

      if (count > 0) {
        greedySolution[denom] = count;
        remainingTarget -= count * denom;
      }
    }

    // If greedy approach worked, add it first
    if (remainingTarget === 0) {
      results.push(greedySolution);
      seenSolutions.add(JSON.stringify(greedySolution));
      if (maxResults <= 1) return results;
    }

    // Use memoization for additional combinations
    const memo = new Map<string, boolean>();

    const findCombinations = (
      index: number,
      remaining: number,
      current: { [key: string]: number }
    ): void => {
      // Exit if we have enough results
      if (results.length >= maxResults) return;

      // Success case
      if (remaining === 0) {
        const solutionKey = JSON.stringify(current);
        if (!seenSolutions.has(solutionKey)) {
          results.push({ ...current });
          seenSolutions.add(solutionKey);
        }
        return;
      }

      // Can't go further
      if (index >= denominations.length) return;

      // Check if this subproblem was already explored
      const memoKey = `${index}-${remaining}`;
      if (memo.has(memoKey)) return;
      memo.set(memoKey, true);

      // Check if we can reach target with remaining denominations
      let sumRemaining = 0;
      for (let i = index; i < denominations.length; i++) {
        sumRemaining +=
          denominations[i] * (billsAvailable[`${denominations[i]}`] || 0);
      }
      if (sumRemaining < remaining) return; // Early termination

      const denom = denominations[index];
      const available = billsAvailable[`${denom}`] || 0;
      const maxToUse = Math.min(Math.floor(remaining / denom), available);

      // Try different counts (prioritize using more bills first)
      for (
        let count = maxToUse;
        count >= 0 && results.length < maxResults;
        count--
      ) {
        const nextCombination = { ...current };
        if (count > 0) {
          nextCombination[denom] = count;
        }

        findCombinations(index + 1, remaining - count * denom, nextCombination);
      }
    };

    // Only run full search if we need more solutions
    if (results.length < maxResults) {
      findCombinations(0, target, {});
    }

    return results;
  };
  return (
    // Se reduce el padding en mobile para mejorar el diseño
    <div className="w-full p-2 md:p-10 flex flex-col justify-center gap-6">
      <div className="flex flex-col items-center w-full">
        <h2 className="font-bold text-2xl md:text-3xl mb-4 text-center">
          Entregar Vuelto: {objectiveValue}Gs
        </h2>
        <div className="relative w-full flex flex-col justify-center max-w-[400px]">
          <input
            aria-label="Entregar Vuelto"
            value={`${value}Gs`}
            readOnly
            className="h-16 text-2xl md:text-3xl text-center font-bold border-2 border-primary rounded-xl"
          />

          {counted && (
            <div className="flex items-center justify-center mt-4 space-x-4">
              <button
                onClick={() => setMode("add")}
                className={`px-4 py-2 rounded-md ${
                  mode === "add"
                    ? "bg-primary text-white"
                    : "bg-muted text-gray-800"
                }`}
              >
                +
              </button>
              <button
                onClick={() => setMode("subtract")}
                className={`px-4 py-2 rounded-md ${
                  mode === "subtract"
                    ? "bg-primary text-white"
                    : "bg-muted text-gray-800"
                }`}
              >
                -
              </button>
            </div>
          )}
        </div>
      </div>

      {!canReachObjective && (
        <p className="text-red-500 text-center">
          No es posible entregar el vuelto exacto con los billetes disponibles.
        </p>
      )}

      <section className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
        {DEFAULT_DENOMINATIONS.map((amountStr) => {
          const amount = Number(amountStr);
          const countAvailable = availableBills[amountStr] || 0;
          const countSelected = bills[amountStr] || 0;
          return (
            <div key={amount} className="relative">
              <Money
                onClick={() => clickBill(amount)}
                alt={`${amount}Gs`}
                src={`/money/${amount}${amount <= 1000 ? ".png" : ".jpg"}`}
                className={`p-4 bg-muted rounded-xl hover:scale-105 transition-transform ${
                  countAvailable === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              />
              <span className="absolute top-2 right-8 bg-white font-bold text-black px-2 py-1 rounded text-xl">
                Disp: {countAvailable}
              </span>
              {countSelected > 0 && (
                <span className="absolute bottom-2 right-8 bg-primary font-bold text-white text-xl px-2 py-1 rounded">
                  Sel: {countSelected}
                </span>
              )}
            </div>
          );
        })}
      </section>

      {/* Botón para abrir las sugerencias (solo si es posible alcanzar el objetivo) */}
      {canReachObjective && suggestions.length > 0 && (
        <Button onClick={() => setShowSuggestions(true)}>Sugerencias</Button>
      )}

      {/* Modal de sugerencias usando el componente Dialog */}
      {showSuggestions && (
        <Dialog open={showSuggestions} onOpenChange={setShowSuggestions}>
          <DialogContent className="p-4">
            <DialogHeader>
              <DialogTitle>
                Sugerencias para entregar {objectiveValue}Gs
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2 mt-4">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="border p-2 rounded hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setBills(suggestion);
                    const total = Object.entries(suggestion).reduce(
                      (sum, [denom, count]) => sum + Number(denom) * count,
                      0
                    );
                    setValue(total);
                    setShowSuggestions(false);
                  }}
                >
                  {Object.entries(suggestion)
                    .map(([denom, count]) => `${count} x ${denom}Gs`)
                    .join(", ")}
                </div>
              ))}
            </div>
            <DialogClose asChild>
              <Button onClick={() => setShowSuggestions(false)}>Cerrar</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CashBackBills;
