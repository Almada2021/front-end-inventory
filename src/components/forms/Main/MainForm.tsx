import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormikHelpers, FormikValues, useFormik } from "formik";
import * as Yup from "yup";

interface Field extends React.ComponentProps<"input"> {
  name: string;
  label?: string;
  component?: React.ReactNode;
  type: "text" | "number" | "phone" | "email" | "special";
}
interface Props<T extends Yup.Maybe<Yup.AnyObject>> {
  className?: string;
  fields: Field[];
  title: string;
  sentText: string;
  initialValues: T;
  onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void;
  debug?: boolean;
  children?: React.ReactNode;
  validationSchema?: Yup.ObjectSchema<T>; // Update this line
}
/**
 * MainForm is the basic way to build the form
 * @param {Props} Props - Properties of the component {@link Props}
 * @returns {JSX.Element} Form Render
 */
export default function MainForm<
  T extends Yup.Maybe<Yup.AnyObject> & FormikValues
>({
  className,
  title,
  sentText,
  fields,
  initialValues,
  onSubmit,
  debug = false,
  validationSchema,
  ...props
}: Props<T>) {
  console.log(initialValues, fields);
  const formik = useFormik({
    initialValues: { ...initialValues },
    onSubmit: async (values: T, formikHelpers: FormikHelpers<T>) => {
      await onSubmit(values, formikHelpers);
    },
    validationSchema,
  });
  return (
    <div className={cn("flex flex-col gap-64", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{title} </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                {fields.map(
                  (
                    { name, label, placeholder, required, ...props }: Field,
                    index: number
                  ) => (
                    <div
                      className="grid gap-2"
                      key={`${name}-${label}-${placeholder}-${index}`}
                    >
                      <Label htmlFor={name}>{label}</Label>
                      <Input
                        id={name}
                        placeholder={placeholder}
                        required={required}
                        value={formik.values[name]}
                        onChange={formik.handleChange}
                        {...props}
                      />
                      <p className="text-xs text-red-600">
                        {typeof formik.errors[name] === "string" &&
                          formik.errors[name]}
                      </p>
                    </div>
                  )
                )}
                {debug && JSON.stringify(formik.values, null, 2)}

                <Button type="submit" className="w-full">
                  {sentText}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
