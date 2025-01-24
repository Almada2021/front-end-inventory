import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormikHelpers, useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { createProviders } from "@/app/features/supplier/supplierActions";
import { AppDispatch } from "@/app/store";
import { useToast } from "@/hooks/use-toast";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export default function SuppliersForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const formik = useFormik({
    initialValues: {
      name: "",
      sellerName: "",
      phoneNumber: "",
    },
    validationSchema: Yup.object({
      name: Yup.string(),
      sellerName: Yup.string(),
      phoneNumber: Yup.string().matches(
        phoneRegExp,
        "Numero de telefono no es Valido"
      ),
    }),
    onSubmit: async (
      values,
      formikHelpers: FormikHelpers<{
        name: string;
        sellerName: string;
        phoneNumber: string;
      }>
    ) => {
      try {
        const providerCreated = await dispatch(
          createProviders({
            name: values.name,
            sellerName: values.sellerName,
            phoneNumber: values.phoneNumber,
          })
        );
        if (!providerCreated.payload) throw new Error("Creation Failed");
        toast({
          title: "El proveedor se creo correctamente",
          description: values.name,
        });
        formikHelpers.resetForm();
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error.message);
          toast({
            title: "El proveedor NO se creo correctamente",
            description: `${values.name} Cambia el nombre o prueba el internet`,
            variant: "destructive",
          });
        }
      }
    },
  });
  return (
    <div className={cn("flex flex-col gap-64", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Agregar Proveedores</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                {/* Name */}
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre de la Empresa</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Proveedor Del Norte S.A"
                    required
                    value={formik.values.name}
                    onChange={formik.handleChange}
                  />
                </div>
                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="sellerName">Nombre del Vendedor</Label>
                  <Input
                    id="sellerName"
                    type="text"
                    placeholder="Juan Perez"
                    required
                    onChange={formik.handleChange}
                    value={formik.values.sellerName}
                  />
                </div>
                {/* Phone Number*/}
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="phoneNumber">Numero de telefono</Label>
                  </div>
                  <Input
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    id="phoneNumber"
                    placeholder="0975669884"
                    type="tel"
                    required
                  />
                  <p className="text-xs text-red-600">
                    {formik.errors.phoneNumber}
                  </p>
                </div>
                <Button type="submit" className="w-full">
                  Crear Proveedor
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
