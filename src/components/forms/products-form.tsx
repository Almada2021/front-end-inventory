import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormikHelpers, useFormik } from "formik";
import * as Yup from "yup";
import "./forms.css";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ChangeEvent, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import ImgUploader from "./ImgUploader/ImgUploader";
import FormInput from "./FormInput/FormInput";
import { BackendApi } from "@/core/api/api";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { useAppSelector } from "@/config/react-redux.adapter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProvidersTableForm from "../ProvidersTableForm/ProvidersTableForm";
import { useNavigate } from "react-router";
import { Product } from "@/infrastructure/interfaces/products.interface";

interface IValues {
  id: string;
  name: string;
  price: number;
  basePrice: number;
  image: string;
  uncounted: boolean;
  stock: number;
  providers: string[];
  barCode?: number | undefined;
  rfef?: string;
  sellByWeight: boolean;
  weightUnit: string;
}
interface IProductsForm extends React.ComponentPropsWithoutRef<"div"> {
  values?: IValues;
  editMode?: boolean;
  resolveEditFn?: () => void;
}

export default function ProductsForm({
  editMode = false,
  resolveEditFn = () => {
    console.log("edit mode active");
  },
  className,
  values,
  ...props
}: IProductsForm) {
  const spreadProviders = values?.providers || [];
  const [providers, setProviders] = useState<string[]>([...spreadProviders]);
  const [isProviderDialogOpen, setIsProviderDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const clientQuery = useQueryClient();
  const [providerNames, setProviderNames] = useState<Record<string, string>>(
    {}
  );
  const navigate = useNavigate();
  const userId = useAppSelector((state) => state.auth.userInfo?.id);

  const id = values?.id || "";

  // Store initial values for comparison
  const initialValues = {
    name: values?.name || "",
    price: values?.price || 0,
    basePrice: values?.basePrice || 0,
    image: null as File | null,
    uncounted: values?.uncounted || false,
    stock: values?.stock || 0,
    barCode: values?.barCode || (undefined as number | undefined),
    rfef: values?.rfef || "", // New optional RFEF field
    sellByWeight: values?.sellByWeight || false,
    weightUnit: values?.weightUnit || "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      name: Yup.string().required("El nombre es requerido"),
      price: Yup.number()
        .required("El Precio es requerido")
        .required("El precio es requerido"),
      basePrice: Yup.number().required("El precio base es requerido"),
      image: Yup.mixed().nullable(),
      uncounted: Yup.boolean().required(),
      stock: Yup.number(),
      barCode: Yup.number().optional(),
      rfef: Yup.string().optional().nullable(), // Validation for new field
      sellByWeight: Yup.boolean(),
      weightUnit: Yup.string().test(
        "weightUnitRequired",
        "La unidad de peso es requerida cuando se vende por peso",
        function (value) {
          return (
            !this.parent.sellByWeight || (this.parent.sellByWeight && !!value)
          );
        }
      ),
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
        sellByWeight: boolean;
        weightUnit: string;
      }>
    ) => {
      try {
        const formData = new FormData();

        // For edit mode, only include fields that have changed
        if (editMode) {
          // Compare with initial values to determine what changed
          if (values.name !== initialValues.name) {
            formData.append("name", values.name);
          }

          if (values.price !== initialValues.price) {
            formData.append("price", values.price.toString());
          }

          if (values.basePrice !== initialValues.basePrice) {
            formData.append("basePrice", values.basePrice.toString());
          }

          if (values.uncounted !== initialValues.uncounted) {
            formData.append("uncounted", values.uncounted.toString());
          }

          if (values.stock !== initialValues.stock) {
            formData.append("stock", values.stock.toString());
          }

          if (values.barCode !== initialValues.barCode) {
            if (values.barCode !== undefined) {
              formData.append("barCode", values.barCode.toString());
            }
          }

          if (values.rfef !== initialValues.rfef) {
            if (values.rfef) {
              formData.append("rfef", values.rfef);
            }
          }

          if (values.sellByWeight !== initialValues.sellByWeight) {
            formData.append("sellByWeight", values.sellByWeight.toString());
          }

          if (values.weightUnit !== initialValues.weightUnit) {
            formData.append("weightUnit", values.weightUnit);
          }

          // Handle providers - only include if they've changed
          const initialProvidersStr = JSON.stringify(
            [...spreadProviders].sort()
          );
          const currentProvidersStr = JSON.stringify([...providers].sort());

          if (initialProvidersStr !== currentProvidersStr) {
            providers.forEach((element) => {
              formData.append("providers", element);
            });
          }

          // Handle image - only include if a new one was uploaded
          if (values.image) {
            formData.append("img", values.image);
          } else if (values?.image) {
            // If in edit mode and no new image was selected, keep the original image
            formData.append("keepOriginalImage", "true");
            formData.append("photoUrl", values.image);
          }
        } else {
          // For create mode, include all fields
          formData.append("name", values.name);
          formData.append("price", values.price.toString());
          formData.append("basePrice", values.basePrice.toString());
          formData.append("uncounted", values.uncounted.toString());
          formData.append("stock", values.stock.toString());
          formData.append("sellByWeight", values.sellByWeight.toString());
          formData.append("weightUnit", values.weightUnit);

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
        }

        // Always include userId
        if (!userId) {
          throw new Error("User ID is required");
        }
        formData.append("userId", userId);

        if (!editMode) {
          // Create new product
          await BackendApi.post<Product>("/products", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
            .then((response) => response.data)
            .then((product: Product) => {
              navigate(`/inventory/products/${product.id}`);
              toast.success("Producto Agregado correctamente", {
                className: "w-full h-32 p-4",
              });
            })
            .catch((error) => {
              toast.error("Error al agregar el producto", {
                className: "w-full h-32 p-4",
              });
              console.error(error);
            });
        } else {
          // Update existing product - use PATCH for partial update
          await BackendApi.patch(`/products/${id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
            .then(() => {
              toast.success("Producto actualizado correctamente", {
                className: "w-full h-32 p-4",
              });
              resolveEditFn();
            })
            .catch(() => {
              toast.error("Error al actualizar el producto", {
                className: "w-full h-32 p-4",
              });
            });
        }
        clientQuery.invalidateQueries({ queryKey: ["products"] });
        resetForm();
        setProviders([]);
      } catch (err) {
        console.log(err);
      }
    },
  });

  // Predefined weight unit options
  const weightUnitOptions = [
    { value: "kg", label: "Kilogramo (kg)" },
    { value: "g", label: "Gramo (g)" },
    { value: "lb", label: "Libra (lb)" },
    { value: "oz", label: "Onza (oz)" },
    { value: "l", label: "Litro (l)" },
    { value: "ml", label: "Mililitro (ml)" },
  ];

  return (
    <div className={cn("flex flex-col ", className)} {...props}>
      <ProvidersTableForm
        providers={providers}
        setProviders={setProviders}
        setProviderNames={setProviderNames}
        isProviderDialogOpen={isProviderDialogOpen}
        setIsProviderDialogOpen={setIsProviderDialogOpen}
      >
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader className="bg-primary/10 text-center">
            <CardTitle className="text-xl">
              {editMode ? "Editar Producto" : "Crear Producto"}
            </CardTitle>
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
                      <div>
                        <Label htmlFor="stock">Stock (Cantidad Inicial)</Label>
                        <div>
                          <Input
                            id="stock"
                            type="number"
                            placeholder="Número de unidades"
                            required
                            step={1}
                            min={0}
                            value={formik.values.stock}
                            onChange={formik.handleChange}
                          />
                        </div>
                        <p className="text-xs text-red-600">
                          {formik.errors.stock}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Sell by Weight section */}
                  <div className="grid gap-2 mt-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        type="button"
                        checked={formik.values.sellByWeight}
                        onClick={(e) => {
                          e.preventDefault();
                          formik.setFieldValue(
                            "sellByWeight",
                            !formik.values.sellByWeight
                          );
                        }}
                        id="sellByWeight"
                      />
                      <Label htmlFor="sellByWeight">
                        Vender por unidad de peso
                      </Label>
                    </div>
                    {formik.values.sellByWeight && (
                      <div>
                        <Label htmlFor="weightUnit">Unidad de Peso</Label>
                        <Select
                          value={formik.values.weightUnit}
                          onValueChange={(value) =>
                            formik.setFieldValue("weightUnit", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una unidad" />
                          </SelectTrigger>
                          <SelectContent>
                            {weightUnitOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-red-600">
                          {formik.errors.weightUnit}
                        </p>
                      </div>
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
                    required={false}
                    placeholder="Referencia externa"
                    value={formik.values.rfef || ""}
                    onChange={formik.handleChange}
                  />

                  {/* Barcode */}
                  <FormInput
                    label="Código de Barras (Opcional)"
                    alt="barCode"
                    type="number"
                    required={false}
                    placeholder="Código numérico"
                    value={formik.values.barCode || undefined}
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

                    {providers.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {providers.map((id) => (
                          <Badge key={id} variant="secondary">
                            {providerNames[id] || `Proveedor ${id}`}
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
                    imgUrl={values?.image}
                    fileInputRef={fileInputRef}
                    alt={formik.values.name}
                    validationMessage={formik.errors.image || ""}
                  />
                </div>
              </div>

              {/* Submit button - full width */}
              <Button type="submit" className="w-full mt-6">
                {editMode ? "Editar Producto" : "Crear Producto"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </ProvidersTableForm>
    </div>
  );
}
