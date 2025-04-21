import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
import { ProductExtended } from "@/infrastructure/interfaces/sale/sale.interface";
// import { Edit, Trash2 } from "lucide-react";

interface BadgeListProps {
  products: ProductExtended[];
  onRemoveProduct?: (productId: string) => void;
  onEditProduct?: (productId: string) => void;
  disabled?: boolean;
}

export default function BadgeList({
  products,
}: // onRemoveProduct,
// onEditProduct,
// disabled = false,
BadgeListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {products.map((product) => (
        <Badge
          key={product._id}
          variant={product.cancelled ? "destructive" : "outline"}
          className="flex items-center gap-2 p-2"
        >
          <span>
            {product.name || product.product} x {product.quantity}
          </span>
          {/* {!disabled && !product.cancelled && (
            <div className="flex gap-1">
              {onEditProduct && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 p-0 hover:text-blue-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditProduct(product.product);
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
              )}
              {onRemoveProduct && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 p-0 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveProduct(product.product);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )} */}
          {/* </div> */}
          {/* )} */}
        </Badge>
      ))}
    </div>
  );
}
