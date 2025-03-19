import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BackendApi } from "@/core/api/api";
import { useQueryClient } from "@tanstack/react-query";

interface ClientFormValues {
  id?: string;
  name: string;
  lastName: string;
  ruc: string;
}
interface Props {
  edit?: boolean;
  valuesEdited?: ClientFormValues;
  onEdit?: () => void;
}
export default function ClientsForm({ edit = false, valuesEdited, onEdit }: Props) {
  const queryClient = useQueryClient();

  const formik = useFormik<ClientFormValues>({
    initialValues: {
      name: valuesEdited?.name || "",
      lastName: valuesEdited?.lastName || "",
      ruc: valuesEdited?.ruc || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("El nombre es requerido"),
      lastName: Yup.string().required("El apellido es requerido"),
      ruc: Yup.string().required("El RUC es requerido"),
    }),
    onSubmit: async (
      values,
      { resetForm }: FormikHelpers<ClientFormValues>
    ) => {
      try {
        // Enviamos los datos en formato JSON
        if(!edit){

          await BackendApi.post("/client/create", values);
          // Actualizamos la caché de clientes (si es necesario)
          queryClient.invalidateQueries({ queryKey: ["clients"] });
          resetForm();
        }else {
          await BackendApi.patch(`/client/update/${valuesEdited?.id}`,values);
          queryClient.invalidateQueries({ queryKey: ["clients"] });
          if(onEdit) onEdit();
        }
      } catch (error) {
        console.error("Error al crear el cliente:", error);
      }
    },
  });

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>{edit ? "Crear Cliente" : "Editar Cliente"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-4">
            {/* Nombre */}
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Ramon"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
              {formik.errors.name && formik.touched.name && (
                <p className="text-xs text-red-600">{formik.errors.name}</p>
              )}
            </div>
            {/* Apellido */}
            <div className="grid gap-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Mendoza"
                value={formik.values.lastName}
                onChange={formik.handleChange}
              />
              {formik.errors.lastName && formik.touched.lastName && (
                <p className="text-xs text-red-600">{formik.errors.lastName}</p>
              )}
            </div>
            {/* RUC */}
            <div className="grid gap-2">
              <Label htmlFor="ruc">RUC</Label>
              <Input
                id="ruc"
                name="ruc"
                type="text"
                placeholder="101011-6"
                value={formik.values.ruc}
                onChange={formik.handleChange}
              />
              {formik.errors.ruc && formik.touched.ruc && (
                <p className="text-xs text-red-600">{formik.errors.ruc}</p>
              )}
            </div>
            <Button type="submit">
              {edit ? "Crear Cliente" : "Editar Cliente"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
