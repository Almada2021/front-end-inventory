import { InputHTMLAttributes, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type?: string;
  inputPlaceholder?: string;
  notify?: (val: string | number | undefined) => void;
  inputProps?: React.ComponentProps<"input">;
}

export default function CheckboxInput({
  label,
  type = "number",
  inputPlaceholder,
  notify,
  inputProps,
}: Props) {
  const [check, setCheck] = useState(false);
  return (
    <div className="flex gap-2 items-center min-h-[60px] w-full md:w-1/2">
      <Checkbox checked={check} onCheckedChange={() => setCheck(!check)} />
      <p>{label}</p>
      {check && (
        <Input
          type={type}
          placeholder={inputPlaceholder}
          className="w-full"
          onChange={(e) => notify?.(e.target.value)}
          {...inputProps}
        />
      )}
    </div>
  );
}
