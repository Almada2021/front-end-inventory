import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Receipt, ScanBarcode, ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { BackendApi } from "@/core/api/api";
import LoadingScreen from "@/layouts/Loading/LoadingScreen";
import toast from "react-hot-toast";

type Mode = "new" | "receipt" | "count" | null;

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

    <div
      className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => onSelect("count")}
    >
      <ScanBarcode className="w-12 h-12 mx-auto mb-4 text-primary" />
      <h3 className="text-lg font-semibold">Contar e Identificar</h3>
      <p className="text-muted-foreground text-sm mt-2">
        Escanea múltiples productos
      </p>
    </div>
  </div>
);

const EnhancedUploader = ({
  title,
  description,
  onBack,
  onConfirm,
}: {
  title: string;
  description: string;
  onBack: () => void;
  onConfirm: (file: React.RefObject<HTMLInputElement>) => void;
}) => {
  const [preview, setPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const confirmFn = async () => {
    try {
      await onConfirm(fileInputRef);
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
      <div>
      <input 
        type="number"
        alt="Precio"
        className="border-b-2 w-full"
        min={50}
        
      />
      </div>
      <div className="space-y-4">
        <div
          className="border-2 border-dashed rounded-xl aspect-square flex flex-col items-center justify-center gap-4 p-6 text-center hover:bg-accent/30 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <>
              <PlusCircle className="w-12 h-12 text-primary" />
              <div>
                <p className="font-medium">Haz clic para subir</p>
                <p className="text-sm text-muted-foreground">
                  PNG, JPG (máx. 20MB)
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
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if(file?.size && file?.size <= 18000000){
              if (file) setPreview(URL.createObjectURL(file));
            }else{
              toast.error("No se permite ficheros de mas de 20 MB")
            }
          }}
        />

        <Button
          className="w-full"
          size="lg"
          onClick={confirmFn}
          disabled={!preview}
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
};

export default function LoadProductScreen() {
  const [selectedMode, setSelectedMode] = useState<Mode>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const newProductLoad = useMutation({
    mutationFn: async (ref: React.RefObject<HTMLInputElement>) => {
      // Your mutation logic here
      if (!ref.current?.files || ref.current.files.length === 0) {
        throw new Error("No file selected. Please choose a file to proceed.");
      }
      const formData = new FormData();

      // Create and send FormData
      formData.append("img", ref.current.files[0]);
      setLoading(true);
      const response = await BackendApi.post("/ai/from-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false)
      return response.data;
      // const data = await BackendApi.post("/ai/from-file",)
    },
    onSuccess: () => {
      // Handle success
      toast.success("El Producto fue creado con exito");
    },
    onError: (error) => {
      toast.error(error.message);
      // Handle error
    },
  });
  if(loading){
    return <LoadingScreen/>
  }
  return (
    <div className="flex justify-center w-full h-full mt-10 md:mt-0 md:py-2">
      <div className="container max-w-4xl py-8">
        {!selectedMode ? (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold">Cargar Productos</h1>
            <ModeSelector onSelect={setSelectedMode} />
          </div>
        ) : (
          <EnhancedUploader
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
            onConfirm={(file: React.RefObject<HTMLInputElement>) => {
              // Lógica de confirmación
              switch (selectedMode) {
                case "new": {
                  newProductLoad.mutate(file);
                }
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
