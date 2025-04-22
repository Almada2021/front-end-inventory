import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import FileUploader from "@/components/FileUploader/FileUploader";
import StoreSelector from "@/components/StoreSelector";
import TillSelector from "@/layouts/Till/[id]/TillSelector/TillSelector";
import toast from "react-hot-toast";

export default function Withdraw() {
  const navigate = useNavigate();
  const [storeId, setStoreId] = useState<string>("");
  const [till, setTill] = useState<string>("");
  const [tillBills, setTillBills] = useState<Record<string, number>>({});
  const [response, setResponse] = useState<
    { response: string; verified: boolean } | undefined
  >(undefined);

  const handleSuccess = (data: unknown) => {
    setResponse((data as { response: string; verified: boolean }) || undefined);
    toast.success("Retiro procesado con éxito");
  };

  const handleError = (error: Error) => {
    toast.error(`Error al procesar el retiro: ${error.message}`);
  };

  if (response) {
    return (
      <div className="flex justify-center w-full h-full mt-8 md:mt-0 md:py-2 px-4 md:px-0">
        <div className="container max-w-4xl py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Resultado del Retiro
              </h2>
              <Button
                onClick={() => {
                  setResponse(undefined);
                  setTill("");
                  setStoreId("");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Volver
              </Button>
            </div>

            <div className="border rounded-lg p-4 mb-4">
              <div className="flex items-center mb-2">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    response.verified ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span className="font-medium">
                  {response.verified ? "Retiro exitoso" : "Retiro fallido"}
                </span>
              </div>
              <div className="text-gray-700 whitespace-pre-line">
                {response.response}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full h-full mt-8 md:mt-0 md:py-2 px-4 md:px-0">
      <div className="container max-w-4xl py-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/inventory/ai/operations")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold">Retirar</h2>
              <p className="text-muted-foreground">
                Retirar dinero o productos
              </p>
            </div>
          </div>

          <StoreSelector
            selectStore={(id) => {
              setStoreId(id);
            }}
            currentStore={storeId}
          />

          {storeId && (
            <TillSelector
              storeId={storeId}
              selectTill={(id, till) => {
                setTill(id);
                setTillBills(till?.bills || {});
              }}
              currentTill={till}
            />
          )}

          <FileUploader
            title="Retirar Billetes"
            description="Sube imágenes de billetes para retirar"
            maxFiles={100}
            maxFileSizeMB={20}
            endpoint="/ai/withdraw-bills"
            method="post"
            additionalFormData={{
              bills: JSON.stringify(tillBills),
              tillId: till,
              storeId: storeId,
            }}
            onSuccess={handleSuccess}
            onError={handleError}
            showBackButton={true}
            backPath="/inventory/ai/operations"
            buttonText="Retirar Billetes"
            accept="image/*"
          />
        </div>
      </div>
    </div>
  );
}
