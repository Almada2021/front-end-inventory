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
import { useRef, useState } from "react";
import { Search } from "lucide-react";
import { Checkbox } from "../ui/checkbox";

export default function ProductsForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [providers, setProviders] = useState<string[]>([]);
  const [previewImg, setPreviewImg] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formik = useFormik({
    initialValues: {
      name: "",
      price: 0,
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
      image: Yup.mixed().nullable(),
      uncounted: Yup.boolean().required(),
      stock: Yup.number(),
    }),
    onSubmit: async (
      values,
      {
        resetForm,
      }: FormikHelpers<{
        name: string;
        price: number;
        image: File | null;
        uncounted: boolean;
        stock: number;
      }>
    ) => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("price", values.price.toString());
        formData.append("uncounted", values.uncounted.toString());
        formData.append("stock", values.stock.toString());
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
                    <Label htmlFor="price">Precio en Gs</Label>
                    <div>
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
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={formik.values.uncounted}
                        onClick={() => {
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
                        <Label htmlFor="price">Cantidad</Label>
                        <div>
                          <Input
                            id="price"
                            type="number"
                            placeholder="10000"
                            required
                            step={1000}
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
                  <div className="grid ">
                    <Label htmlFor="image" className="invisible h-[0.1px]">
                      Imagen del Producto
                    </Label>
                    <Input
                      className="invisible h-[0.1px]"
                      id="image"
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/gif, image/jpeg"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        setPreviewImg(URL.createObjectURL(file!));
                        formik.setFieldValue("image", file || null);
                      }}
                    />
                    {formik.errors.image && (
                      <p className="text-xs text-red-600">
                        {formik.errors.image}
                      </p>
                    )}
                    {previewImg != "" && (
                      <div
                        onClick={() => {
                          if (fileInputRef.current) {
                            fileInputRef.current.click();
                          }
                        }}
                        className="border-dotted border-primary border-2 min-h-[150px] flex justify-center items-center"
                      >
                        <img
                          className="w-full max-h-[150px] object-contain"
                          src={previewImg}
                          alt={`Producto: ${formik.values.name}`}
                          title={`Producto: ${formik.values.name}`}
                        ></img>
                      </div>
                    )}
                    {previewImg == "" && (
                      <div
                        onClick={() => {
                          if (fileInputRef.current) {
                            fileInputRef.current.click();
                          }
                        }}
                        className="border-dotted border-primary border-2 min-h-[150px] flex justify-center items-center"
                      >
                        <h3 className="text-primary font-bold">
                          Click Para Elegir la foto del producto
                        </h3>
                      </div>
                    )}
                  </div>
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
