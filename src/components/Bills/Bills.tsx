import { Input } from "@/components/ui/input";
import Money from "./Money/Money";
import { ChangeEvent, useEffect, useState } from "react";

interface Props {
  title?: string;
  onValueChange: (amount: number, bills: { [key: string]: number }) => void;
  counted?: boolean;
}

const defaultProps = {
  title: "Ingresar cantidad de dinero",
  onValueChange: () => {},
  counted: true,
};

export default function Bills({
  title = defaultProps.title,
  onValueChange = defaultProps.onValueChange,
  counted = defaultProps.counted,
}: Props) {
  const [value, setValue] = useState<number>(0);
  const [text, setText] = useState<string>("0Gs");
  const [bills, setBills] = useState<{ [key: string]: number }>({});
  const [mode, setMode] = useState<"add" | "subtract">("add");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (counted) return;
    const reg = /^[0-9]+$/;
    const inputValue = e.target.value.replace(/\D/g, "");

    if (reg.test(inputValue)) {
      const numericValue = parseInt(inputValue) || 0;
      setValue(numericValue);
      setText(`${numericValue}Gs`);
    }
  };

  const clickBill = (amount: number) => {
    const newValue = mode === "add" ? value + amount : value - amount;
    const updatedValue = Math.max(0, newValue);
    setValue(updatedValue);
    setBills((v) => {
      const val = { ...v };
      const amountStr = `${amount}`;
      if (mode === "add") {
        if (val[amountStr]) {
          val[amountStr] += 1;
        } else {
          val[amountStr] = 1;
        }
      } else {
        if (val[amountStr]) {
          val[amountStr] -= 1;
          if (val[amountStr] <= 0) {
            delete val[amountStr];
          }
        }
      }
      return val;
    });
  };

  useEffect(() => {
    onValueChange(value, bills);
    if (counted) {
      setText(`${value}Gs`);
    }
  }, [value, bills, onValueChange, counted]);

  return (
    <div className="min-h-screen w-full p-4 md:p-10 flex flex-col gap-6">
      <div className="flex flex-col items-center w-full">
        <h2 className="font-bold text-2xl md:text-3xl mb-4 text-center">
          {title}
        </h2>
        <div className="relative w-full max-w-[400px]">
          <Input
            onFocus={() => {
              if (!counted) setText(value.toString());
            }}
            onBlur={() => {
              if (!counted) setText(`${value}Gs`);
            }}
            value={text}
            onChange={onChange}
            readOnly={counted}
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

      <section className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Monedas */}
        <div className="col-span-full grid grid-cols-3 gap-4">
          {[100, 500, 1000].map((amount) => (
            <Money
              key={amount}
              onClick={() => clickBill(amount)}
              alt={`${amount}Gs`}
              src={`/money/${amount}.png`}
              className="p-2 bg-muted rounded-lg"
            />
          ))}
        </div>

        {/* Billetes */}
        <div className="col-span-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[2000, 5000, 10000, 20000, 50000, 100000].map((amount) => (
            <Money
              key={amount}
              onClick={() => clickBill(amount)}
              type="bill"
              alt={`${amount}Gs`}
              src={`/money/${amount}.jpg`}
              className="p-4 bg-muted rounded-xl hover:scale-105 transition-transform"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
