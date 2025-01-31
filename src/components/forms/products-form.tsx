import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormikHelpers, useFormik } from "formik";
import * as Yup from "yup";
// import { useToast } from "@/hooks/use-toast";
import "./forms.css";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import DataTableView from "../DataTable/DataTable";
import { useState } from "react";

export default function ProductsForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [providers, setProviders] = useState<string[]>([]);
  const formik = useFormik({
    initialValues: {
      name: "",
      price: 0,
      image: null as File | null, // Nuevo campo para la imagen
    },
    validationSchema: Yup.object({
      name: Yup.string(),
      price: Yup.number()
        .integer("Ingresa un Entero.")
        .required("El precio es requerido"),
      image: Yup.mixed().nullable(),
    }),
    onSubmit: async (
      values,
      {
        resetForm,
      }: FormikHelpers<{
        name: string;
        price: number;
        image: File | null;
      }>
    ) => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("price", values.price.toString());
        providers.forEach((element) => {
          formData.append("providers", element);
        });
        if (values.image) {
          formData.append("img", values.image); // Agrega la imagen al FormData
        }

        await axios.post("http://localhost:8000/products", formData);

        resetForm();
      } catch (err) {
        console.log(err);
      }
    },
  });
  return (
    <div className={cn("flex flex-col gap-64", className)} {...props}>
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Busca los Proveedores</AlertDialogTitle>
            <AlertDialogDescription>
              Marcalos y confirma para agregar
            </AlertDialogDescription>
            <DataTableView
              initial={providers}
              notifyProvidersSelected={(value: string[]) => {
                setProviders(value);
              }}
            />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {}}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Crear Producto</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
              <div className="grid gap-6">
                <div className="grid gap-6">
                  {/* Name */}
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nombre del Producto</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Galletitas"
                      required
                      value={formik.values.name}
                      onChange={formik.handleChange}
                    />
                  </div>
                  {/* Name */}
                  <div className="grid gap-2">
                    <Label htmlFor="price">Precio</Label>
                    <div className="with-suffix suffix-gs">
                      <Input
                        id="price"
                        type="number"
                        placeholder="10000"
                        required
                        step={1000}
                        value={formik.values.price}
                        onChange={formik.handleChange}
                      />
                    </div>
                    <p className="text-xs text-red-600">
                      {formik.errors.price}
                    </p>
                  </div>
                  {/* Input de la imagen */}
                  <div className="grid gap-2">
                    <Label htmlFor="image">Imagen del Producto </Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/png, image/gif, image/jpeg"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        formik.setFieldValue("image", file || null);
                      }}
                    />
                    {formik.errors.image && (
                      <p className="text-xs text-red-600">
                        {formik.errors.image}
                      </p>
                    )}
                  </div>
                  {/* Name */}
                  <div className="grid gap-2">
                    <Label htmlFor="providers"> Proveedores</Label>
                    <AlertDialogTrigger className="rounded-full border-primary border-2">
                      Buscar Proveedores
                    </AlertDialogTrigger>
                  </div>
                  <Button type="submit" className="w-full">
                    Crear Producto
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </AlertDialog>
    </div>
  );
}
