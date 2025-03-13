import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormikHelpers, useFormik } from "formik";
import * as Yup from "yup";
// import { useToast } from "@/hooks/use-toast";
import "./forms.css";
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
import { ChangeEvent, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import ImgUploader from "./ImgUploader/ImgUploader";
import FormInput from "./FormInput/FormInput";
import { BackendApi } from "@/core/api/api";
import { useQueryClient } from "@tanstack/react-query";

export default function ProductsForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [providers, setProviders] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const clientQuery = useQueryClient();
  const formik = useFormik({
    initialValues: {
      name: "",
      price: 0,
      // basePrice: 0,
      image: null as File | null,
      uncounted: true,
      stock: 0,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("El nombre es requerido"),
      price: Yup.number()
        .required("El Precio es requerido")
        .integer("Ingresa un Entero.")
        .required("El precio es requerido"),
      // basePrice: Yup.number()
      //   .integer("Ingresa un Entero.")
      //   .required("El precio es requerido"),
      image: Yup.mixed().nullable(),
      uncounted: Yup.boolean().required(),
      stock: Yup.number(),
      barCode: Yup.number().optional(),
      basePrice: Yup.number().optional(),
    }),
    onSubmit: async (
      values,
      {
        resetForm,
      }: FormikHelpers<{
        name: string;
        price: number;
        // basePrice: number;
        image: File | null;
        uncounted: boolean;
        stock: number;
        barCode?: number;
        basePrice?: number;
      }>
    ) => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("price", values.price.toString());
        // formData.append("basePrice", values.basePrice.toString());
        formData.append("uncounted", values.uncounted.toString());
        formData.append("stock", values.stock.toString());
        if (formik.values.barCode && values.barCode !== undefined) {
          formData.append("barCode", values.barCode.toString());
        }
        if (formik.values.basePrice && values.basePrice !== undefined) {
          formData.append("basePrice", values.basePrice.toString());
        }
        providers.forEach((element) => {
          formData.append("providers", element);
        });
        if (values.image) {
          formData.append("img", values.image); // Agrega la imagen al FormData
        }

        await BackendApi.post("/products", formData);
        clientQuery.invalidateQueries({ queryKey: ["products"] });

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
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => {}}>
              Seleccionar
            </AlertDialogAction>
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
                  <FormInput
                    label="Nombre del Producto"
                    alt="name"
                    type="text"
                    placeholder="Galletitas"
                    required
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    validationComponent={
                      <p className="text-xs text-red-600">
                        {formik.errors.name}
                      </p>
                    }
                  />
                  {/* Price */}
                  <FormInput
                    alt="price"
                    label="Precio en Gs"
                    type="number"
                    placeholder="10000"
                    required
                    step={1000}
                    value={formik.values.price}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      let value = e.target.value;
                      const numberValue = Number(e.target.value);
                      if (value[0] == "0")
                        value = value.substring(1, value.length);
                      if (isNaN(numberValue) || numberValue < 0) return;
                      formik.setFieldValue("price", value);
                    }}
                    validationComponent={
                      <p className="text-xs text-red-600">
                        {formik.errors.price}
                      </p>
                    }
                  />
                  {/* BasePrice */}
                  <FormInput
                    alt="basePrice"
                    label="Precio en Gs"
                    type="number"
                    placeholder="10000"
                    required
                    step={1000}
                    value={formik.values.basePrice}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      let value = e.target.value;
                      const numberValue = Number(e.target.value);
                      if (value[0] == "0")
                        value = value.substring(1, value.length);
                      if (isNaN(numberValue) || numberValue < 0) return;
                      formik.setFieldValue("price", value);
                    }}
                    validationComponent={
                      <p className="text-xs text-red-600">
                        {formik.errors.price}
                      </p>
                    }
                  />

                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        type="button"
                        checked={formik.values.uncounted}
                        onClick={(e) => {
                          e.preventDefault();
                          formik.setFieldValue(
                            "uncounted",
                            !formik.values.uncounted
                          );
                        }}
                      />
                      <p>No Contar Cantidad en el inventario</p>
                    </div>
                    {!formik.values.uncounted && (
                      <>
                        <Label htmlFor="stock">Cantidad</Label>
                        <div>
                          <Input
                            id="stock"
                            type="number"
                            placeholder="Numero de unidades"
                            required
                            step={1}
                            min={1}
                            value={formik.values.stock}
                            onChange={formik.handleChange}
                          />
                        </div>
                        <p className="text-xs text-red-600">
                          {formik.errors.stock}
                        </p>
                      </>
                    )}
                  </div>
                  {/* Input de la imagen */}
                  <ImgUploader
                    validation={formik.errors.image ? true : false}
                    setFieldValue={(key, file) =>
                      formik.setFieldValue("image", file)
                    }
                    fileInputRef={fileInputRef}
                    alt={formik.values.name}
                    validationMessage={formik.errors.image || ""}
                  />
                  {/* Name */}
                  <div className="grid gap-2">
                    <Label htmlFor="providers"> Proveedores</Label>
                    <AlertDialogTrigger className="rounded-full border-primary border-2 p-2">
                      <div className="w-full flex items-center justify-center gap-2">
                        <Search size={24} />
                        Buscar Proveedores
                      </div>
                    </AlertDialogTrigger>
                  </div>
                  <FormInput
                    label="Codigo de Barras"
                    alt="barCode"
                    type="number"
                    placeholder="1000000"
                    required
                    value={formik.values.barCode}
                    onChange={formik.handleChange}
                  />
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
