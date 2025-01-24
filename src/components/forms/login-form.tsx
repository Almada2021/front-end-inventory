import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { userLogin } from "@/app/features/user/authActions";
import { AppDispatch } from "@/app/store";
interface FormValues {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const validate = (values: FormValues): FormErrors => {
  const errors: FormErrors = {};
  if (values.password.length < 8) {
    errors.password = "longitud minima 8 letras";
  }
  return errors;
};

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const dispatch = useDispatch<AppDispatch>();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: async (
      values: FormValues
      // formikHelpers: FormikHelpers<{ email: string; password: string }>
    ) => {
      try {
        const provider: unknown = await dispatch(
          userLogin({ email: values.email, password: values.password })
        );
        console.log(provider);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    },
  });
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Iniciar Session</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Correo Electronico</Label>
                  <Input
                    id="email"
                    type="email"
                    onChange={formik.handleChange}
                    placeholder="micorreo@gmail.com"
                    required
                    value={formik.values.email}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Contraseña</Label>
                  </div>
                  <Input
                    onChange={formik.handleChange}
                    id="password"
                    value={formik.values.password}
                    type="password"
                    required
                  />
                </div>
                <Button
                  disabled={formik.isSubmitting}
                  type="submit"
                  className="w-full"
                >
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
