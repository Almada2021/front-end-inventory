import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Withdraw() {
  const navigate = useNavigate();

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

          <div className="border-2 border-dashed rounded-xl min-h-[400px] w-full flex flex-col items-center justify-center gap-4 p-6 text-center">
            <p className="text-muted-foreground">
              Funcionalidad de retiro en desarrollo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
