import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BackendApi } from "@/core/api/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

interface ClientFormValues {
  id?: string;
  name: string;
  lastName: string;
  ruc: string;
  address?: string;
  phoneNumber?: string
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
      address: valuesEdited?.address ||"",
      phoneNumber: valuesEdited?.phoneNumber ||"",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("El nombre es requerido"),
      lastName: Yup.string().required("El apellido es requerido"),
      ruc: Yup.string().required("El RUC es requerido"),
      address: Yup.string().optional().nullable(),
      phoneNumber: Yup.string().optional().nullable(),
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
          toast.success("Cliente creado exitosamente", {
            className: "w-full h-32 p-4",
          });
        }else {
          await BackendApi.patch(`/client/update/${valuesEdited?.id}`,values);
          queryClient.invalidateQueries({ queryKey: ["clients"] });
          if(onEdit) onEdit();
          toast.success("Cliente Editado correctamente",{
            className: "w-full h-32 p-4",
          });
        }
      } catch (error) {
        toast.error(`Error al crear cliente ${error}`, {
          className: "w-full h-32 p-4",
        } )
        console.error("Error al crear el cliente:", error);
      }
    },
  });

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>{!edit ? "Crear Cliente" : "Editar Cliente"}</CardTitle>
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
             {/* Direccion */}
             <div className="grid gap-2">
              <Label htmlFor="ruc">Direccion</Label>
              <Input
                id="address"
                name="address"
                type="text"
                placeholder="Casa"
                value={formik.values.address}
                onChange={formik.handleChange}
              />
              {formik.errors.address && formik.touched.address && (
                <p className="text-xs text-red-600">{formik.errors.address}</p>
              )}
            </div>
            {/* Telefono */}
            <div className="grid gap-2">
              <Label htmlFor="phoneNumber">Telefono</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                placeholder="0919919"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
              />
              {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                <p className="text-xs text-red-600">{formik.errors.phoneNumber}</p>
              )}
            </div>
            <Button type="submit">
              {!edit ? "Crear Cliente" : "Editar Cliente"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
