import { Input } from "@/components/ui/input";
import Money from "./Money/Money";
import { ChangeEvent, useEffect, useState } from "react";

interface Props {
  title?: string;
  onValueChange: (amount: number) => void;
}

const defaultProps = {
  title: "Ingresar Cantidad de dinero",
  onValueChange: () => {},
};
export default function Bills({
  title = defaultProps.title,
  onValueChange = defaultProps.onValueChange,
}: Props) {
  const [value, setValue] = useState<number>(0);
  const [text, setText] = useState<string | undefined>(undefined);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const reg = /^[0-9]+$/;
    const value = e.target.value.split(" ")[0];
    if (reg.test(value)) {
      setValue(Number(value));
    }
  };
  const clickBill = (amount: number) => {
    const newValue = value + amount;
    setValue(newValue);
    setText(`${newValue} Gs`);
  };
  useEffect(() => {
    onValueChange(value);
  }, [text]);
  return (
    <div className=" min-h-[100svh] w-full  flex px-10 md:px-40 py-10  gap-10 flex-wrap ">
      <div className="flex flex-col justify-center items-center w-full">
        <h2 className="font-bold text-center sm:text-xl md:text-3xl ">
          {title}
        </h2>
        <Input
          onFocus={() => {
            setText(undefined);
          }}
          onBlur={() => setText(`${value} Gs`)}
          value={text || `${value}`}
          onChange={onChange}
          style={{
            fontSize: "2rem",
          }}
          className="min-h-[40px] md:min-h-[60px] text-center"
        ></Input>
      </div>
      <section
        style={{ margin: "0 !important" }}
        className=" w-full  min-h-[80svh] flex flex-col md:flex-row justify-center items-center gap-0"
      >
        {/* Amount */}
        {/* coins */}
        <div className="flex flex-wrap md:flex-row w-full lg:w-5/12 items-center justify-center">
          <Money
            onClick={() => {
              clickBill(100);
            }}
            alt="100 Gs."
            src="/money/100.png"
          />
          <Money
            onClick={() => {
              clickBill(500);
            }}
            alt="500 Gs."
            src="/money/500.png"
          />
          <Money
            onClick={() => {
              clickBill(1000);
            }}
            alt="1000 Gs."
            src="/money/1000.png"
          />
        </div>
        {/* bills */}
        <div className="flex flex-col md:flex-row w-full flex-wrap items-center justify-center">
          <Money
            onClick={() => {
              clickBill(2000);
            }}
            type="bill"
            alt="2000 Gs."
            src="/money/2000.jpg"
          />
          <Money
            onClick={() => {
              clickBill(5000);
            }}
            type="bill"
            alt="5000 Gs."
            src="/money/5000.jpg"
          />
          <Money
            onClick={() => {
              clickBill(10000);
            }}
            type="bill"
            alt="10000 Gs."
            src="/money/10000.jpg"
          />
          <Money
            onClick={() => {
              clickBill(20000);
            }}
            type="bill"
            alt="20000 Gs."
            src="/money/20000.jpg"
          />
          <Money
            onClick={() => {
              clickBill(50000);
            }}
            type="bill"
            alt="50000 Gs."
            src="/money/50000.jpg"
          />
          <Money
            onClick={() => {
              clickBill(100000);
            }}
            type="bill"
            alt="100000 Gs."
            src="/money/100000.jpg"
          />
        </div>
      </section>
    </div>
  );
}
