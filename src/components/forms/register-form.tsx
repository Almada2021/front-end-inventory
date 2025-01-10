import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";

interface FormValues {
  name: string;
  email: string;
  password: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

const validate = (values: FormValues): FormErrors => {
  const errors: FormErrors = {};
  if (!values.name) {
    errors.name = "Nombre Requerido";
  }
  if (values.password.length < 8) {
    errors.password = "longitud minima 8 letras";
  }
  return errors;
};

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validate,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Datos Personales</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                {/* Name */}
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ingresar Nombre Completo"
                    required
                    value={formik.values.name}
                    onChange={formik.handleChange}
                  />
                </div>
                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Correo Electronico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="micorreo@gmail.com"
                    required
                    onChange={formik.handleChange}
                    value={formik.values.email}
                  />
                </div>
                {/* password */}
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Contraseña</Label>
                  </div>
                  <Input
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    id="password"
                    type="password"
                    required
                  />
                  <p className="w-full text-xs text-red-600">
                    {formik.errors.password}
                  </p>
                </div>
                <Button type="submit" className="w-full">
                  Ingresar
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
