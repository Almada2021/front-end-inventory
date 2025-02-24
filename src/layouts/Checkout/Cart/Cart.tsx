// components/Cart/Cart.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartInterface } from "@/infrastructure/interfaces/cart/cart.interface";
interface Props {
  cart: CartInterface[];
  onQuantityChange: (productId: string, newQuantity: number) => void;
}

export default function Cart({ cart, onQuantityChange }: Props) {
  if (cart.length == 0) return null;
  const handleQuantityChange = (productId: string, value: string) => {
    const numericValue = parseInt(value);
    if (!isNaN(numericValue)) {
      onQuantityChange(productId, numericValue);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="h-[calc(100vh-180px)] pr-4">
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex-1">
                <p className="text-sm font-medium truncate">
                  {item.product.name.substring(0, 20)}
                  {item.product.name.length > 20 && "..."}
                </p>
                <p className="text-xs text-muted-foreground">
                  ${item.product.price}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.id, e.target.value)
                  }
                  className="w-20 text-center hide-spinners"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onQuantityChange(item.id, 0)}
                  className="lg:hidden"
                >
                  ×
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
