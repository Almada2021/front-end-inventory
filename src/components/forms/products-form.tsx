import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormikHelpers, useFormik } from "formik";
import * as Yup from "yup";
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
import { Search, Tag } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import ImgUploader from "./ImgUploader/ImgUploader";
import FormInput from "./FormInput/FormInput";
import { BackendApi } from "@/core/api/api";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

export default function ProductsForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [providers, setProviders] = useState<string[]>([]);
  const [isProviderDialogOpen, setIsProviderDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const clientQuery = useQueryClient();
  
  const formik = useFormik({
    initialValues: {
      name: "",
      price: 0,
      basePrice: 0,
      image: null as File | null,
      uncounted: true,
      stock: 0,
      barCode: undefined as number | undefined,
      rfef: "" // New optional RFEF field
    },
    validationSchema: Yup.object({
      name: Yup.string().required("El nombre es requerido"),
      price: Yup.number()
        .required("El Precio es requerido")
        .integer("Ingresa un Entero.")
        .required("El precio es requerido"),
      basePrice: Yup.number()
        .integer("Ingresa un Entero.")
        .required("El precio base es requerido"),
      image: Yup.mixed().nullable(),
      uncounted: Yup.boolean().required(),
      stock: Yup.number(),
      barCode: Yup.number().optional(),
      rfef: Yup.string().optional(), // Validation for new field
    }),
    onSubmit: async (
      values,
      {
        resetForm,
      }: FormikHelpers<{
        name: string;
        price: number;
        basePrice: number;
        image: File | null;
        uncounted: boolean;
        stock: number;
        barCode?: number;
        rfef?: string;
      }>
    ) => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("price", values.price.toString());
        formData.append("basePrice", values.basePrice.toString());
        formData.append("uncounted", values.uncounted.toString());
        formData.append("stock", values.stock.toString());
        
        if (values.barCode !== undefined) {
          formData.append("barCode", values.barCode.toString());
        }
        
        if (values.rfef) {
          formData.append("rfef", values.rfef);
        }
        
        providers.forEach((element) => {
          formData.append("providers", element);
        });
        
        if (values.image) {
          formData.append("img", values.image);
        }

        await BackendApi.post("/products", formData);
        clientQuery.invalidateQueries({ queryKey: ["products"] });

        resetForm();
        setProviders([]);
      } catch (err) {
        console.log(err);
      }
    },
  });
  
  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <AlertDialog open={isProviderDialogOpen} onOpenChange={setIsProviderDialogOpen}>
        <AlertDialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
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
            <AlertDialogAction>
              Seleccionar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader className="bg-primary/10 text-center">
            <CardTitle className="text-xl">Crear Producto</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Left Column */}
                <div className="grid gap-4">
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
                    label="Precio de Venta (Gs)"
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
                  
                  {/* Base Price */}
                  <FormInput
                    alt="basePrice"
                    label="Precio de Costo (Gs)"
                    type="number"
                    placeholder="8000"
                    required
                    step={1000}
                    value={formik.values.basePrice}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      let value = e.target.value;
                      const numberValue = Number(e.target.value);
                      if (value[0] == "0")
                        value = value.substring(1, value.length);
                      if (isNaN(numberValue) || numberValue < 0) return;
                      formik.setFieldValue("basePrice", value);
                    }}
                    validationComponent={
                      <p className="text-xs text-red-600">
                        {formik.errors.basePrice}
                      </p>
                    }
                  />

                  {/* Stock section */}
                  <div className="grid gap-2 mt-2">
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
                        id="uncounted"
                      />
                      <Label htmlFor="uncounted">No contar en inventario</Label>
                    </div>
                    {!formik.values.uncounted && (
                      <>
                        <Label htmlFor="stock">Cantidad Inicial</Label>
                        <div>
                          <Input
                            id="stock"
                            type="number"
                            placeholder="Número de unidades"
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
                </div>
                
                {/* Right Column */}
                <div className="grid gap-4">
                  {/* New RFEF Field */}
                  <FormInput
                    label="RFEF (Opcional)"
                    alt="rfef"
                    type="text"
                    placeholder="Referencia externa"
                    value={formik.values.rfef}
                    onChange={formik.handleChange}
                  />
                  
                  {/* Barcode */}
                  <FormInput
                    label="Código de Barras (Opcional)"
                    alt="barCode"
                    type="number"
                    placeholder="Código numérico"
                    value={formik.values.barCode}
                    onChange={formik.handleChange}
                  />
                  
                  {/* Providers */}
                  <div className="grid gap-2">
                    <Label htmlFor="providers">Proveedores</Label>
                    <AlertDialogTrigger 
                      className="rounded-md border border-primary p-2 hover:bg-primary/10 transition-colors"
                      onClick={() => setIsProviderDialogOpen(true)}
                    >
                      <div className="w-full flex items-center justify-center gap-2">
                        <Search size={20} />
                        Buscar Proveedores
                      </div>
                    </AlertDialogTrigger>
                    
                    {/* Show selected providers */}
                    {providers.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {providers.map(id => (
                          <Badge key={id} variant="secondary">
                            Proveedor {id}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Image uploader */}
                  <ImgUploader
                    validation={formik.errors.image ? true : false}
                    setFieldValue={(key, file) =>
                      formik.setFieldValue("image", file)
                    }
                    fileInputRef={fileInputRef}
                    alt={formik.values.name}
                    validationMessage={formik.errors.image || ""}
                  />
                </div>
              </div>
              
              {/* Submit button - full width */}
              <Button type="submit" className="w-full mt-6">
                Crear Producto
              </Button>
            </form>
          </CardContent>
        </Card>
      </AlertDialog>
    </div>
  );
}