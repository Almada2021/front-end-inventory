import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

export default function SaleProductBadge(
    {
        product,
        name
    }: {
        product: {
            product: string,
            quantity: number,
            cancelled: boolean,
        }
        name: string
    }
) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-bold text-lg text-gray-800">
          {name}
          {product.cancelled && (
            <span className="text-red-600 ml-2">(Anulado)</span>
          )}
        </h3>
        <p className="text-gray-600">Cantidad: {product.quantity}</p>
      </div>
      <Badge
        variant={product.cancelled ? "destructive" : "default"}
        className="flex items-center gap-1"
      >
        {product.cancelled ? (
          <XCircle className="h-4 w-4" />
        ) : (
          <CheckCircle className="h-4 w-4" />
        )}
        {product.cancelled ? "Anulado" : "Completado"}
      </Badge>
    </div>
  );
}
