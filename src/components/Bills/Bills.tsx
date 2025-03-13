import { Input } from "@/components/ui/input";
import Money from "./Money/Money";
import { ChangeEvent, useCallback, useEffect, useState } from "react";

interface Props {
  title?: string;
  onValueChange: (amount: number, bills: { [key: string]: number }) => void;
}

const defaultProps = {
  title: "Ingresar cantidad de dinero",
  onValueChange: () => {},
};

export default function Bills({
  title = defaultProps.title,
  onValueChange = defaultProps.onValueChange,
}: Props) {
  const [value, setValue] = useState<number>(0);
  const [text, setText] = useState<string>("0Gs");
  const [bills, setBills] = useState<{ [key: string]: number }>({});
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const reg = /^[0-9]+$/;
    const inputValue = e.target.value.replace(/\D/g, "");

    if (reg.test(inputValue)) {
      const numericValue = parseInt(inputValue) || 0;
      setValue(numericValue);
      setText(`${numericValue}Gs`);
    }
  };

  const clickBill = (amount: number) => {
    const newValue = value + amount;
    setValue(newValue);
    setText(`${newValue}Gs`);
    setBills((v: { [key: string]: number }) => {
      const val = { ...v };
      if (val[`${amount}`]) {
        val[`${amount}`] += 1;
        return val;
      }
      val[`${amount}`] = 1;
      return val;
    });
  };

  const memoizedOnValueChange = useCallback(
    (value: number) => {
      onValueChange(value, bills);
    },
    [onValueChange, bills]
  );

  useEffect(() => {
    memoizedOnValueChange(value);
  }, [memoizedOnValueChange, value]);
  return (
    <div className="min-h-screen w-full p-4 md:p-10 flex flex-col gap-6">
      <div className="flex flex-col items-center w-full">
        <h2 className="font-bold text-2xl md:text-3xl mb-4 text-center">
          {title}
        </h2>
        <div className="relative w-full max-w-[400px]">
          <Input
            onFocus={() => setText(value.toString())}
            onBlur={() => setText(`${value}Gs`)}
            value={text}
            onChange={onChange}
            className="h-16 text-2xl md:text-3xl text-center font-bold border-2 border-primary rounded-xl"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
            Gs
          </span>
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
