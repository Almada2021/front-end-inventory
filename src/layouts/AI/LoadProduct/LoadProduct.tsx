import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Receipt,
  ScanBarcode,
  ArrowLeft,
  AlertCircle,
  Search,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { BackendApi } from "@/core/api/api";
import LoadingScreen from "@/layouts/Loading/LoadingScreen";
import toast from "react-hot-toast";
import CheckboxInput from "@/components/CheckboxInput/CheckboxInput";
import { useNavigate } from "react-router";
import FileUploader from "@/components/FileUploader/FileUploader";
import ProvidersTableForm from "@/components/ProvidersTableForm/ProvidersTableForm";
import { Badge } from "@/components/ui/badge";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";

type Mode = "new" | "receipt" | "count" | null;

interface ProcessedProduct {
  name: string;
  basePrice: number;
  price?: number;
  barCode?: string;
  stock?: number;
  photoUrl?: string;
  id: string;
}

interface ProcessReceiptResponse {
  products: ProcessedProduct[];
}

const CountComponent = () => {
  const navigate = useNavigate();
  return (
    <div
      className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => {
        navigate("/inventory/ai/count");
      }}
    >
      <ScanBarcode className="w-12 h-12 mx-auto mb-4 text-primary" />
      <h3 className="text-lg font-semibold">Contar e Identificar</h3>
      <p className="text-muted-foreground text-sm mt-2">
        Escanea múltiples productos
      </p>
    </div>
  );
};
const ModeSelector = ({ onSelect }: { onSelect: (mode: Mode) => void }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div
      className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => onSelect("new")}
    >
      <PlusCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
      <h3 className="text-lg font-semibold">Nuevo Producto</h3>
      <p className="text-muted-foreground text-sm mt-2">
        Carga individual de productos
      </p>
    </div>

    <div
      className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => onSelect("receipt")}
    >
      <Receipt className="w-12 h-12 mx-auto mb-4 text-primary" />
      <h3 className="text-lg font-semibold">Carga por Boleta</h3>
      <p className="text-muted-foreground text-sm mt-2">
        Importa productos desde una factura
      </p>
    </div>

    <CountComponent />
  </div>
);

const EnhancedUploader = ({
  title,
  description,
  onBack,
  onConfirm,
  selectedMode,
}: {
  title: string;
  description: string;
  onBack: () => void;
  onConfirm: (
    file: React.RefObject<HTMLInputElement>,
    custom: { [key: string]: string | number | undefined }
  ) => void;
  selectedMode: Mode;
}) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialCustom: { [key: string]: string | number | undefined } = {
    price: undefined,
    basePrice: undefined,
    name: undefined,
    stock: undefined,
  };
  const [custom, setCustom] = useState<{
    [key: string]: string | number | undefined;
  }>(initialCustom);

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      // Revoke all object URLs to prevent memory leaks
      previews.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (!newFiles || newFiles.length === 0) return;

    // Convert FileList to Array
    const newFilesArray = Array.from(newFiles);

    // Check if adding new files would exceed the 10 file limit
    if (files.length + newFilesArray.length > 10) {
      toast.error("No se pueden agregar más de 10 imágenes");
      return;
    }

    // Check if any file is larger than 20MB
    const oversizedFiles = newFilesArray.filter((file) => file.size > 18000000);
    if (oversizedFiles.length > 0) {
      toast.error("No se permiten ficheros de más de 20 MB");
      return;
    }

    // Create preview URLs for new files
    const newPreviews = newFilesArray.map((file) => URL.createObjectURL(file));

    // Update files and previews arrays
    setFiles((prevFiles) => [...prevFiles, ...newFilesArray]);
    setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);

    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    // Remove file and preview at the specified index
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setPreviews((prevPreviews) => {
      // Revoke the URL of the removed preview
      URL.revokeObjectURL(prevPreviews[index]);
      return prevPreviews.filter((_, i) => i !== index);
    });
  };

  const confirmFn = async () => {
    try {
      // Create a new input element with the current files
      const customFileList = new DataTransfer();
      files.forEach((file) => {
        customFileList.items.add(file);
      });
      if (fileInputRef.current) {
        fileInputRef.current.files = customFileList.files;
      }
      await onConfirm(fileInputRef, custom);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
      {selectedMode === "new" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 md:px-0">
          <CheckboxInput
            label="Precio"
            inputPlaceholder="Precio"
            inputProps={{ step: 1000 }}
            uncheck={() => setCustom({ ...custom, price: undefined })}
            notify={(val) => setCustom({ ...custom, price: val })}
          />
          <CheckboxInput
            label="Stock"
            inputPlaceholder="Stock"
            inputProps={{ step: 1 }}
            uncheck={() => setCustom({ ...custom, stock: undefined })}
            notify={(val) => setCustom({ ...custom, stock: val })}
          />
          <CheckboxInput
            label="Precio de Costo"
            inputPlaceholder="Precio de Costo"
            inputProps={{ step: 1000 }}
            uncheck={() => setCustom({ ...custom, basePrice: undefined })}
            notify={(val) => setCustom({ ...custom, basePrice: val })}
          />
          <CheckboxInput
            label="Nombre del Producto"
            inputPlaceholder="Nombre del Producto"
            inputProps={{ step: 1000 }}
            type="text"
            uncheck={() => setCustom({ ...custom, name: undefined })}
            notify={(val) => setCustom({ ...custom, name: val })}
          />
        </div>
      )}
      <div className="space-y-4 px-4 md:px-0">
        <div
          className="border-2 border-dashed rounded-xl min-h-[400px] w-full flex flex-col items-center justify-center gap-4 p-6 text-center hover:bg-accent/30 transition-colors cursor-pointer relative"
          onClick={() => fileInputRef.current?.click()}
        >
          {previews.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
              {previews.map((preview, index) => (
                <div key={index} className="relative aspect-square group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center">
                    {index + 1}
                  </div>
                  <button
                    className="absolute top-2 left-2 bg-red-500/80 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              {previews.length < 10 && (
                <div className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
                  <PlusCircle className="w-8 h-8 text-primary" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Agregar más
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              <PlusCircle className="w-12 h-12 text-primary" />
              <div>
                <p className="font-medium">Haz clic para subir</p>
                <p className="text-sm text-muted-foreground">
                  PNG, JPG (máx. 20MB)
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Puedes seleccionar hasta 10 imágenes
                </p>
              </div>
            </>
          )}
        </div>

        <Input
          ref={fileInputRef}
          type="file"
          max={20000}
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        <Button
          className="w-full"
          size="lg"
          onClick={confirmFn}
          disabled={files.length === 0}
        >
          Confirmar {files.length > 0 ? `(${files.length} imágenes)` : ""}
        </Button>
      </div>
    </div>
  );
};

const ReceiptComponent = ({ onBack }: { onBack: () => void }) => {
  const [profitPercentage, setProfitPercentage] = useState<
    number | undefined
  >();
  const [products, setProducts] = useState<ProcessedProduct[]>([]);
  const [editingPrices, setEditingPrices] = useState<{ [key: string]: number }>(
    {}
  );
  const [suggestedPhotos, setSuggestedPhotos] = useState<{
    [key: string]: string;
  }>({});
  const spreadProviders: string[] = [];
  const [providers, setProviders] = useState<string[]>([...spreadProviders]);
  const [providerNames, setProviderNames] = useState<Record<string, string>>(
    {}
  );
  const [isProviderDialogOpen, setIsProviderDialogOpen] = useState(false);
  const createProductsMutation = useMutation({
    mutationFn: async (products: ProcessedProduct[]) => {
      const createdProducts = await Promise.all(
        products.map(async (product) => {
          const formData = new FormData();
          formData.append("name", product.name);
          formData.append("price", String(product.price || 0));
          formData.append("basePrice", String(product.basePrice));
          formData.append("stock", String(product?.stock) || "0");
          formData.append("uncounted", "false");

          if (product.barCode) {
            formData.append("barCode", product.barCode);
          }

          // Asegurarnos de que la photoUrl se envíe si existe
          if (product.photoUrl) {
            formData.append("photoUrl", product.photoUrl);
          } else if (suggestedPhotos[product.name]) {
            formData.append("photoUrl", suggestedPhotos[product.name]);
          }
          if (
            !product.id ||
            product.id.length <= 0 ||
            product.id == undefined
          ) {
            providers.forEach((element) => {
              formData.append("providers", element);
            });
            const response = await BackendApi.post("/products", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            toast.success("Producto actualizado correctamente");
            return response.data;
          } else {
            const response = await BackendApi.patch(
              `/products/increment-stock/${product.id}`,
              {
                amount: product.stock,
              }
            );
            if (response.data) {
              toast.success("El stock se actualizó correctamente");
            } else {
              toast.error("Error al actualizar el stock");
            }
          }
        })
      );
      return createdProducts;
    },
    onSuccess: () => {
      toast.success("Productos creados exitosamente");
      setProducts([]);
      setSuggestedPhotos({});
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const createProductsOnlyOneMutation = useMutation({
    mutationFn: async (product: ProcessedProduct) => {
      try {
        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("price", String(product.price || 0));
        formData.append("basePrice", String(product.basePrice));
        formData.append("stock", String(product?.stock) || "0");
        formData.append("uncounted", "false");

        if (product.barCode) {
          formData.append("barCode", product.barCode);
        }

        // Asegurarnos de que la photoUrl se envíe si existe
        if (product.photoUrl) {
          formData.append("photoUrl", product.photoUrl);
        } else if (suggestedPhotos[product.name]) {
          formData.append("photoUrl", suggestedPhotos[product.name]);
        }
        if (!product.id || product.id.length <= 0 || product.id == undefined) {
          providers.forEach((element) => {
            formData.append("providers", element);
          });
          const response = await BackendApi.post("/products", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          toast.success("Producto actualizado correctamente");
          return response.data;
        } else {
          const response = await BackendApi.patch(
            `/products/increment-stock/${product.id}`,
            {
              amount: product.stock,
            }
          );
          if (response.data) {
            toast.success("El stock se actualizó correctamente");
          } else {
            toast.error("Error al actualizar el stock");
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      toast.success("El Producto fue creado con éxito");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const suggestPhotoUrl = async (productName: string) => {
    try {
      const response = await BackendApi.post("/ai/suggest-photo", {
        productName,
      });

      const photoUrl = response.data.photoUrl.startsWith("http")
        ? response.data.photoUrl
        : `${import.meta.env.VITE_BACKEND_URL}${response.data.photoUrl}`;

      setSuggestedPhotos((prev) => ({
        ...prev,
        [productName]: photoUrl,
      }));

      // Actualizar también el producto con la URL sugerida
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.name === productName
            ? { ...product, photoUrl: photoUrl }
            : product
        )
      );
    } catch {
      toast.error("Error al sugerir foto");
    }
  };

  const handleUsePhoto = (productId: string, photoUrl: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, photoUrl: photoUrl } : product
      )
    );
  };

  const handleImageError = () =>
    // event: React.SyntheticEvent<HTMLImageElement, Event>
    {
      console.log("Error"); // Usar una imagen de placeholder por defecto
    };

  return (
    <div className="space-y-6">
      <ProvidersTableForm
        providers={providers}
        setProviders={setProviders}
        setProviderNames={setProviderNames}
        isProviderDialogOpen={isProviderDialogOpen}
        setIsProviderDialogOpen={setIsProviderDialogOpen}
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Carga por Boleta</h2>
            <p className="text-muted-foreground">
              Importa productos desde una factura
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 px-4 md:px-0">
          <CheckboxInput
            label="Porcentaje de Ganancia"
            inputPlaceholder="Porcentaje"
            inputProps={{ step: 1 }}
            uncheck={() => setProfitPercentage(undefined)}
            notify={(val) =>
              setProfitPercentage(
                typeof val === "string" ? parseFloat(val) : val
              )
            }
          />
        </div>

        <FileUploader
          title="Subir Boleta"
          description="Sube una imagen de la boleta para procesar"
          endpoint="/ai/process-receipt"
          maxFiles={1}
          additionalFormData={{
            profitPercentage: profitPercentage || 0,
          }}
          onSuccess={(data) => {
            const response = data as ProcessReceiptResponse;
            setProducts(response.products || []);
            toast.success("Boleta procesada con éxito");
          }}
          onError={(error) => {
            toast.error(error.message);
          }}
        />
        <AlertDialogTrigger
          className="rounded-md border border-primary p-2 hover:bg-primary/10 transition-colors"
          onClick={() => setIsProviderDialogOpen(true)}
        >
          <div className="w-full flex items-center justify-center gap-2">
            <Search size={20} />
            Buscar Proveedores
          </div>
        </AlertDialogTrigger>
        <div>
          <h2 className="text-2xl font-bold">Proveedores seleccionados</h2>
          {providers.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {providers.map((id) => (
                <Badge key={id} variant="secondary">
                  {providerNames[id] || `Proveedor ${id}`}
                </Badge>
              ))}
              {providers.length == 0 && (
                <div className="text-center">
                  <p>No hay proveedores seleccionados</p>
                </div>
              )}
            </div>
          )}
        </div>
        {products.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Productos Detectados</h3>
              <Button
                size={"lg"}
                variant={"outline"}
                onClick={() => createProductsMutation.mutate(products)}
                disabled={
                  createProductsMutation.isPending ||
                  // verify if all products have a price
                  products.some(
                    (product) => !product.price || product.price <= 0
                  )
                }
              >
                {createProductsMutation.isPending
                  ? "Creando..."
                  : "Crear Productos"}
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {products.map((product, index) => {
                if (product.id) {
                  return (
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <h4 className="font-medium">{product.name}</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Precio Base:{" "}
                          </span>
                          <span>₲{product.basePrice}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            Precio Venta:
                          </span>
                          <Input
                            type="number"
                            value={
                              editingPrices[product.name] || product.price || ""
                            }
                            onChange={(e) => {
                              setEditingPrices((prev) => ({
                                ...prev,
                                [product.name]: Number(e.target.value),
                              }));
                              setProducts((prev) =>
                                prev.map((p) =>
                                  p.name === product.name
                                    ? { ...p, price: Number(e.target.value) }
                                    : p
                                )
                              );
                            }}
                            className="w-32"
                          />
                        </div>
                        {product.barCode && (
                          <div className="col-span-2">
                            <span className="text-muted-foreground">
                              Código:{" "}
                            </span>
                            <span>{product.barCode}</span>
                          </div>
                        )}
                        {product.stock && (
                          <div className="col-span-2">
                            <label htmlFor="stock">
                              Stock (click abajo para editar)
                            </label>
                            <br />
                            <input
                              id="stock"
                              type="number"
                              value={product.stock}
                              onChange={(e) =>
                                setProducts((prev) =>
                                  prev.map((p) =>
                                    p.name === product.name
                                      ? { ...p, stock: Number(e.target.value) }
                                      : p
                                  )
                                )
                              }
                              className="w-32 border-1 border-black"
                            ></input>
                          </div>
                        )}
                        <div className="col-span-2 flex items-center gap-2">
                          <span className="text-muted-foreground">Foto: </span>
                        </div>
                        {product.id && (
                          <div className="flex items-center ">
                            <AlertCircle size={24} className="text-red-500 " />
                            <span className="text-red-500 ml-2 mr-10">
                              Este producto ya existe, solo se sumara al stock
                            </span>
                            <Button
                              type="button"
                              onClick={async () => {
                                createProductsOnlyOneMutation.mutate(product);
                                // remove from products
                                setProducts((prev) =>
                                  prev.filter((p) => p.id !== product.id)
                                );
                              }}
                              disabled={Boolean(
                                !(product.price && product.price > 0)
                              )}
                            >
                              Actualizar Stock
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <h4 className="font-medium">{product.name}</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Precio Base:{" "}
                        </span>
                        <span>₲{product.basePrice}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          Precio Venta:{" "}
                        </span>
                        <Input
                          type="number"
                          value={
                            editingPrices[product.name] || product.price || ""
                          }
                          onChange={(e) => {
                            setEditingPrices((prev) => ({
                              ...prev,
                              [product.name]: Number(e.target.value),
                            }));
                            setProducts((prev) =>
                              prev.map((p) =>
                                p.name === product.name
                                  ? { ...p, price: Number(e.target.value) }
                                  : p
                              )
                            );
                          }}
                          className="w-32"
                        />
                      </div>
                      {product.barCode && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">
                            Código:{" "}
                          </span>
                          <span>{product.barCode}</span>
                        </div>
                      )}
                      <div className="col-span-2 flex items-center gap-2">
                        <span className="text-muted-foreground">Foto: </span>
                        {suggestedPhotos[product.name] ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={`${
                                suggestedPhotos[product.name]
                              }?t=${Date.now()}`}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded"
                              onError={handleImageError}
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleUsePhoto(
                                  product.id,
                                  product.photoUrl || ""
                                )
                              }
                            >
                              Usar esta foto
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => suggestPhotoUrl(product.name)}
                          >
                            Sugerir Foto
                          </Button>
                        )}
                        <Button
                          onClick={async () => {
                            createProductsOnlyOneMutation.mutate(product);
                            // remove from products using name
                            setProducts((prev) =>
                              prev.filter((p) => p.name !== product.name)
                            );
                          }}
                          disabled={Boolean(
                            !(product.price && product.price > 0)
                          )}
                        >
                          Crear Producto
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </ProvidersTableForm>
    </div>
  );
};

export default function LoadProductScreen() {
  const [selectedMode, setSelectedMode] = useState<Mode>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const newProductLoad = useMutation({
    mutationFn: async (ref: React.RefObject<HTMLInputElement>) => {
      if (!ref.current?.files || ref.current.files.length === 0) {
        throw new Error("No se ha seleccionado ningún archivo.");
      }

      const formData = new FormData();
      const files = Array.from(ref.current.files);

      // Validar tamaño de archivos
      const oversizedFiles = files.filter((file) => file.size > 18000000);
      if (oversizedFiles.length > 0) {
        throw new Error("Algunos archivos exceden el límite de 20MB.");
      }

      // Limitar a 10 archivos
      const selectedFiles = files.slice(0, 10);

      // Agregar cada archivo al FormData
      selectedFiles.forEach((file) => {
        formData.append("img", file);
      });

      if (prompt) {
        formData.append("custom", prompt);
      }

      setLoading(true);
      try {
        const response = await BackendApi.post("/ai/from-file", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setLoading(false);
        return response.data;
      } catch (error) {
        setLoading(false);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("El Producto fue creado con éxito");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
  if (loading) {
    return (
      <div className="w-full px-4">
        <LoadingScreen />
      </div>
    );
  }
  return (
    <div className="flex justify-center w-full h-full mt-8 md:mt-0 md:py-2 px-4 md:px-0">
      <div className="container max-w-4xl py-8">
        {!selectedMode ? (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold">Cargar Productos</h1>
            <ModeSelector onSelect={setSelectedMode} />
          </div>
        ) : selectedMode === "receipt" ? (
          <ReceiptComponent onBack={() => setSelectedMode(null)} />
        ) : (
          <EnhancedUploader
            selectedMode={selectedMode}
            title={
              selectedMode === "new" ? "Nuevo Producto" : "Contar Productos"
            }
            description={
              selectedMode === "new"
                ? "Carga individual de productos"
                : "Escanea múltiples productos para inventario"
            }
            onBack={() => setSelectedMode(null)}
            onConfirm={(
              file: React.RefObject<HTMLInputElement>,
              custom: { [key: string]: string | number | undefined }
            ) => {
              switch (selectedMode) {
                case "new": {
                  const promptFromCustom: string = `
                    ${custom?.name ? `Nombre: ${custom.name}` : ""}
                    ${custom?.price ? `Precio: ${custom.price}` : ""}
                    ${custom?.stock ? `Stock: ${custom.stock}` : ""}
                    ${
                      custom?.basePrice
                        ? `Precio de Costo: ${custom.basePrice}`
                        : ""
                    }
                  `;
                  setPrompt(promptFromCustom);
                  newProductLoad.mutate(file);
                  break;
                }
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
