import { InputHTMLAttributes, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type?: string;
  inputPlaceholder?: string;
  notify?: (val: string | number | undefined) => void;
  uncheck?: (key: string) => void;
  inputProps?: React.ComponentProps<"input">;
}

export default function CheckboxInput({
  label,
  type = "number",
  inputPlaceholder,
  notify,
  uncheck,
  inputProps,
}: Props) {
  const [check, setCheck] = useState(false);
  return (
    <div className="flex flex-col space-y-2 w-full">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={check}
          onCheckedChange={() => {
            if (!check) {
              uncheck?.(label);
            }
            setCheck(!check);
          }}
        />
        <p className="text-sm font-medium">{label}</p>
      </div>
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
