import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Receipt, ScanBarcode, ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { BackendApi } from "@/core/api/api";
import LoadingScreen from "@/layouts/Loading/LoadingScreen";
import toast from "react-hot-toast";
import CheckboxInput from "@/components/CheckboxInput/CheckboxInput";
import { useNavigate } from "react-router";

type Mode = "new" | "receipt" | "count" | null;
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
        ) : (
          <EnhancedUploader
            selectedMode={selectedMode}
            title={
              selectedMode === "new"
                ? "Nuevo Producto"
                : selectedMode === "receipt"
                ? "Carga por Boleta"
                : "Contar Productos"
            }
            description={
              selectedMode === "new"
                ? "Carga individual de productos"
                : selectedMode === "receipt"
                ? "Sube una factura para importar múltiples productos"
                : "Escanea múltiples productos para inventario"
            }
            onBack={() => setSelectedMode(null)}
            onConfirm={(
              file: React.RefObject<HTMLInputElement>,
              custom: { [key: string]: string | number | undefined }
            ) => {
              // Lógica de confirmación
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
