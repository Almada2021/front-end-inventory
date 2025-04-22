import FileUploader from "@/components/FileUploader/FileUploader";
import StoreSelector from "@/components/StoreSelector";
import { Button } from "@/components/ui/button";
import TillSelector from "@/layouts/Till/[id]/TillSelector/TillSelector";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CountBills() {
  const [storeId, setStoreId] = useState<string>("");
  const [till, setTill] = useState<string>("");
  const [tillBills, setTillBills] = useState<Record<string, number>>({});
  const [response, setResponse] = useState<
    { response: string; verified: boolean } | undefined
  >(undefined);
  const handleSuccess = (data: unknown) => {
    setResponse((data as { response: string; verified: boolean }) || undefined);
    toast.success("Billetes contados con éxito");
    // You can add additional logic here, like navigating to a results page
    // navigate("/inventory/ai/count-results", { state: { data } });
  };

  const handleError = (error: Error) => {
    toast.error(`Error al contar billetes: ${error.message}`);
  };
  if (response) {
    return (
      <div className="flex justify-center w-full h-full mt-8 md:mt-0 md:py-2 px-4 md:px-0">
        <div className="container max-w-4xl py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Resultado del Conteo
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
                  {response.verified
                    ? "Verificación exitosa"
                    : "Verificación fallida"}
                </span>
              </div>
              <div className="text-gray-700 whitespace-pre-line">
                {response.response}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Billetes en Caja Supuestos
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(tillBills).map(([denomination, count]) => (
                  <div
                    key={denomination}
                    className="bg-gray-50 rounded-lg p-4 border"
                  >
                    <div className="text-sm text-gray-500">Denominación</div>
                    <div className="text-xl font-bold text-gray-800">
                      {denomination}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Cantidad</div>
                    <div className="text-lg font-semibold text-blue-600">
                      {count}
                    </div>
                  </div>
                ))}
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
          title="Contar Billetes"
          description="Sube imágenes de billetes para contar y verificar"
          maxFiles={100}
          maxFileSizeMB={20}
          endpoint="/ai/count-bills"
          method="post"
          additionalFormData={{
            bills: JSON.stringify(tillBills),
          }}
          onSuccess={handleSuccess}
          onError={handleError}
          showBackButton={true}
          backPath="/inventory/ai/operations"
          buttonText="Contar Billetes"
          accept="image/*"
        />
      </div>
    </div>
  );
}
