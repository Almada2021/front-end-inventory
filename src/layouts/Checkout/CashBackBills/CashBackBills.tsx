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
    if (value === objectiveValue) {
      console.log("¡Se alcanzó el valor objetivo!");
    }
  }, [value, bills, onValueChange, objectiveValue]);

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
    const denominations = Object.keys(billsAvailable)
      .map(Number)
      .sort((a, b) => b - a);

    const results: { [key: string]: number }[] = [];

    const helper = (
      index: number,
      currentTarget: number,
      currentCombo: { [key: string]: number }
    ) => {
      if (currentTarget === 0) {
        results.push({ ...currentCombo });
        return;
      }
      if (index === denominations.length) {
        return;
      }
      const denom = denominations[index];
      const availableCount = billsAvailable[`${denom}`] || 0;
      const maxCount = Math.min(
        Math.floor(currentTarget / denom),
        availableCount
      );

      for (let count = maxCount; count >= 0; count--) {
        if (count > 0) {
          currentCombo[denom] = count;
        } else {
          delete currentCombo[denom];
        }
        helper(index + 1, currentTarget - denom * count, currentCombo);
      }
    };

    helper(0, target, {});
    return results;
  };

  return (
    // Se reduce el padding en mobile para mejorar el diseño
    <div className="w-full p-2 md:p-10 flex flex-col gap-6">
      <div className="flex flex-col items-center w-full">
        <h2 className="font-bold text-2xl md:text-3xl mb-4 text-center">
          Entregar Vuelto: {objectiveValue}Gs
        </h2>
        <div className="relative w-full max-w-[400px]">
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
              <span className="absolute top-2 right-2 bg-white text-black px-2 py-1 rounded">
                Disp: {countAvailable}
              </span>
              {countSelected > 0 && (
                <span className="absolute bottom-2 right-2 bg-primary text-white px-2 py-1 rounded">
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
