import { useNavigate } from "react-router";
import { Coins, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

export default function Operations() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center w-full h-full mt-8 md:mt-0 md:py-2 px-4 md:px-0">
      <div className="container max-w-4xl py-8">
        <div className="space-y-8">
          <h1 className="text-3xl font-bold">Operaciones</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => navigate("/inventory/ai/count-bills")}
            >
              <Coins className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold">Contar Billetes</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Verificar coincidencia de billetes
              </p>
            </div>

            <div
              className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => navigate("/inventory/ai/withdraw")}
            >
              <ArrowDownToLine className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold">Retirar</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Retirar dinero
              </p>
            </div>

            <div
              className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => navigate("/inventory/ai/add")}
            >
              <ArrowUpFromLine className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold">Agregar</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Agregar dinero
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
