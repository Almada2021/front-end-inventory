// components/Cart/Cart.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronUp, Minus, Plus, User2Icon, X } from "lucide-react";
import { CartInterface } from "@/infrastructure/interfaces/cart/cart.interface";
import { CheckoutModes } from "@/types/ui.modes-checkout";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Client } from "@/infrastructure/interfaces/clients/clients.response";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/formatCurrency.utils";
const MobileCart = ({
  cart,
  total,
  mode,
  clientMoney = 0,
  onQuantityChange,
  changeMode,
}: {
  cart: CartInterface[];
  total: number;
  mode: CheckoutModes;
  clientMoney?: number;
  onQuantityChange: (productId: string, newQuantity: number) => void;
  changeMode: () => void;
}) => {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button 
          className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground p-4 flex justify-center items-center gap-2 z-50 rounded-none"
          onClick={() => setSheetOpen(true)}
        >
          <ChevronUp className="h-5 w-5" />
          <span>Ver Carrito ({cart.length})</span>
          <span>{formatCurrency(total)}</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="bottom" className="h-[90vh]">
        <SheetHeader className="text-left pb-4 border-b">
          <SheetTitle className="text-lg font-semibold">Carrito</SheetTitle>
          <SheetDescription>
            Carrito de compras con {cart.length} productos
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100%-180px)] pr-4">
          {cart.map((item) => (
            <div key={item.id} className="py-3 border-b">
              <div className="flex justify-between items-center gap-2">
                <div className="flex-1">
                  <p className="font-medium truncate">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.product.price.toLocaleString()} Gs.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const rawValue = e.target.value;
                      const numericValue = parseInt(rawValue);

                      if (rawValue === "" || isNaN(numericValue)) {
                        onQuantityChange(item.id, 1);
                        return;
                      }

                      const clampedValue = Math.max(1, numericValue);
                      onQuantityChange(item.id, clampedValue);
                    }}
                    className="w-12 text-center hide-spinners"
                  />

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      onQuantityChange(item.id, item.quantity + 1);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 bg-background p-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Total:</span>
            <span className="font-bold">{formatCurrency(total)} Gs</span>
          </div>
          <Button
            disabled={clientMoney < total && mode === "bills"}
            onClick={() => {
              changeMode();
              setSheetOpen(false); // Cerrar sheet al continuar
            }}
            className="w-full"
          >
            Continuar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface Props {
  cart: CartInterface[];
  mode: CheckoutModes;
  onQuantityChange: (productId: string, newQuantity: number) => void;
  changeMode: () => void;
  isMobile?: boolean;
  clientMoney?: number;
  client?: Client | null;
  notifyTotal: (value: number) => void;
}

export default function Cart({
  cart,
  changeMode,
  onQuantityChange,
  isMobile,
  mode,
  clientMoney = 0,
  client,
  notifyTotal,
}: Props) {
  const total = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  useEffect(() => {
    notifyTotal(total);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  // const MobileCart = () => (
  //   <Sheet>
  //     <SheetTrigger className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground p-4 flex justify-center items-center gap-2 z-50">
  //       <ChevronUp className="h-5 w-5" />
  //       <span>Ver Carrito ({cart.length})</span>
  //       <span>{formatCurrency(total)}</span>
  //     </SheetTrigger>

  //     <SheetContent className="h-[90vh]">
  //       <SheetHeader className="text-left pb-4 border-b">
  //         <SheetTitle className="text-lg font-semibold">Carrito</SheetTitle>
  //         {/* Add a SheetDescription component here */}
  //         <SheetDescription>
  //           Carrito de compras con {cart.length} productos
  //         </SheetDescription>
  //       </SheetHeader>

  //       <ScrollArea className="h-[calc(100%-180px)] pr-4">
  //         {cart.map((item) => (
  //           <div key={item.id} className="py-3 border-b">
  //             <div className="flex justify-between items-center gap-2">
  //               <div className="flex-1">
  //                 <p className="font-medium truncate">{item.product.name}</p>
  //                 <p className="text-sm text-muted-foreground">
  //                   {item.product.price.toLocaleString()} Gs.
  //                 </p>
  //               </div>

  //               <div className="flex items-center gap-2">
  //                 <Button
  //                   variant="outline"
  //                   size="sm"
  //                   onClick={() => onQuantityChange(item.id, item.quantity - 1)}
  //                   disabled={item.quantity <= 1}
  //                 >
  //                   <Minus className="h-4 w-4" />
  //                 </Button>

  //                 <Input
  //                   type="number"
  //                   min="1"
  //                   value={item.quantity}
  //                   onChange={(e) => {
  //                     // Improved input handling:
  //                     const rawValue = e.target.value;
  //                     const numericValue = parseInt(rawValue);

  //                     // Handle empty/NaN case first
  //                     if (rawValue === "" || isNaN(numericValue)) {
  //                       onQuantityChange(item.id, 1); // Reset to minimum valid value
  //                       return;
  //                     }

  //                     // Handle valid numbers with bounds checking
  //                     const clampedValue = Math.max(1, numericValue);
  //                     onQuantityChange(item.id, clampedValue);
  //                   }}
  //                   className="w-12 text-center hide-spinners"
  //                 />

  //                 <Button
  //                   variant="outline"
  //                   size="sm"
  //                   onClick={(e) => {
  //                     e.preventDefault();
  //                     onQuantityChange(item.id, item.quantity + 1);
  //                   }}
  //                 >
  //                   <Plus className="h-4 w-4" />
  //                 </Button>
  //               </div>
  //             </div>
  //           </div>
  //         ))}
  //       </ScrollArea>

  //       <div className="absolute bottom-0 left-0 right-0 bg-background p-4 border-t">
  //         <div className="flex justify-between items-center mb-4">
  //           <span className="font-semibold">Total:</span>
  //           <span className="font-bold">{formatCurrency(total)} Gs</span>
  //         </div>
  //         <Button
  //           disabled={clientMoney < total && mode === "bills"}
  //           onClick={() => {
  //             changeMode();
  //           }}
  //           className="w-full"
  //         >
  //           Continuar
  //         </Button>
  //       </div>
  //     </SheetContent>
  //   </Sheet>
  // );

  if (isMobile) {
    return (
      <MobileCart
        cart={cart}
        total={total}
        mode={mode}
        clientMoney={clientMoney}
        onQuantityChange={onQuantityChange}
        changeMode={changeMode}
      />
    );
  }
  return (
    <div className="flex flex-col h-full border-l">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold">Carrito ({cart.length})</h3>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            className={`gap-2 ${
              !client && "text-lg"
            } border-2 border-white border-solid`}
          >
            <User2Icon size={48} />
            {client?.name.concat(client?.lastName) || "cliente"}
          </Button>
        </AlertDialogTrigger>
      </div>

      <ScrollArea className="h-[calc(100vh-220px)] pr-4">
        <div className="space-y-4 p-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center gap-4"
            >
              <div className="flex-1 w-full">
                <p className="font-medium truncate w-full">
                  {item.product.name.substring(0, 9)}
                </p>
                <p className="text-sm text-muted-foreground ">
                  {item.product.price.toLocaleString()} Gs.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  className="w-16 text-center hide-spinners"
                  onChange={(e) => {
                    const value = Math.max(1, parseInt(e.target.value) || 1);
                    onQuantityChange(item.id, value);
                  }}
                />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onQuantityChange(item.id, 0)}
                  className="text-destructive hover:text-destructive/80"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-auto p-4 border-t">
        <div className="flex flex-wrap justify-between items-center mb-4">
          {clientMoney != 0 && (
            <div className="w-full flex flex-wrap justify-between items-center">
              <span className="font-semibold text-green-500">Dinero:</span>
              <span className="font-bold ">
                {clientMoney.toLocaleString()} Gs.
              </span>
            </div>
          )}
          <div className="w-full flex flex-wrap justify-between items-center">
            <span className="font-semibold text-blue-500">Total:</span>
            <span className="font-bold ">{total.toLocaleString()} Gs.</span>
          </div>

          {clientMoney != 0 && (
            <div className="w-full flex flex-wrap justify-between items-center">
              <span className="font-semibold  text-red-600">Vuelto:</span>
              <span className="font-bold">
                {(clientMoney - total).toLocaleString()} Gs.
              </span>
            </div>
          )}
        </div>
        <Button
          disabled={clientMoney < total && mode == "bills"}
          onClick={() => {
            changeMode();
          }}
          className="w-full"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
