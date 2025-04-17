import { useState } from "react";
import { formatCurrency } from "@/lib/formatCurrency.utils";

interface Props {
  maxAmount: number;
  moneyCard: number;
  setMoneyCard: (value: number) => void;
}

export default function MoneyInput({
  maxAmount,
  moneyCard,
  setMoneyCard,
}: Props) {
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Quitamos ceros iniciales
    if (Number(e.target.value) > maxAmount) {
      setError(`Saldo insuficiente. Máximo: ${formatCurrency(maxAmount)}`);
      return;
    }
    const value = e.target.value.replace(/^0+/, "");
    if (!value) {
      setMoneyCard(1);
      setError("");
      return;
    }
    const num = Number(value);

    if (num > maxAmount) {
      // Mostramos error pero actualizamos el valor
      setError(`Saldo insuficiente. Máximo: ${formatCurrency(maxAmount)}`);
    } else {
      setError("");
    }
    setMoneyCard(num);
  };

  return (
    <div className="mt-4">
      <label
        htmlFor="money-input"
        className="block text-gray-700 font-medium mb-2"
      >
        Ingresa el monto
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
          💵
        </span>
        <input
          id="money-input"
          type="number"
          step={1000}
          value={moneyCard}
          onChange={handleChange}
          placeholder="Ej. 10 000"
          className="
            w-full
            pl-10 pr-4 py-3
            text-xl
            border border-gray-300
            rounded-lg
            shadow-sm
            placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-green-400
            transition
          "
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}
