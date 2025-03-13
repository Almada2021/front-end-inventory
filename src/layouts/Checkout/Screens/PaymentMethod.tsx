import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useMediaQuery } from "usehooks-ts";
import { useState } from "react";
import { PaymentMethod as TPaymentMethod } from "@/lib/database.types";

interface Props {
  onSelectMethod: (method: TPaymentMethod) => void;
}

export default function PaymentMethod({ onSelectMethod }: Props) {
  const [selectedMethod, setSelectedMethod] = useState<TPaymentMethod>("cash");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleSubmit = () => {
    onSelectMethod(selectedMethod);
  };

  return (
    <div className="w-full h-full flex items-center justify-center  ">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Seleccione método de pago
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <RadioGroup
            defaultValue="cash"
            value={selectedMethod}
            onValueChange={(value) =>
              setSelectedMethod(value as TPaymentMethod)
            }
            className="space-y-3"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash" className="flex-1">
                <div className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <h3 className="font-semibold">Efectivo</h3>
                  <p className="text-sm text-muted-foreground">
                    Pago en moneda local
                  </p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex-1">
                <div className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <h3 className="font-semibold">Tarjeta</h3>
                  <p className="text-sm text-muted-foreground">
                    Débito o crédito
                  </p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <RadioGroupItem value="transfer" id="transfer" />
              <Label htmlFor="transfer" className="flex-1">
                <div className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <h3 className="font-semibold">Transferencia</h3>
                  <p className="text-sm text-muted-foreground">
                    Bancaria o móvil
                  </p>
                </div>
              </Label>
            </div>
          </RadioGroup>

          <Button
            onClick={handleSubmit}
            size={isMobile ? "lg" : "default"}
            className="w-full"
          >
            Confirmar método de pago
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
