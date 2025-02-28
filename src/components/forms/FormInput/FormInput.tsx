import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
interface Props extends React.ComponentProps<"input"> {
  label: string;
  containerClassName?: string;
  validationComponent?: React.ReactNode;
}
const FormInput = React.forwardRef<HTMLInputElement, Props>(
  ({ label, alt, validationComponent, containerClassName = "", ...props }) => {
    return (
      <div className={`grid gap-2 ${containerClassName}`}>
        <Label htmlFor={alt}>{label}</Label>
        <Input id={alt} placeholder="Galletitas" required {...props} />
        {validationComponent}
      </div>
    );
  }
);
export default FormInput;
