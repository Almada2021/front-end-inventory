// import Bills from "@/components/Bills/Bills";
import ProductCard from "@/components/Cards/Product/ProductCard";
// import SearchBar from "@/components/SearchBar/SearchBar";
import { useSidebar } from "@/components/ui/sidebar";
import useProducts from "@/hooks/products/useProducts";
import { CartInterface } from "@/infrastructure/interfaces/cart/cart.interface";
import { Product } from "@/infrastructure/interfaces/products.interface";
import { useEffect, useState } from "react";
import Cart from "./Cart/Cart";
import { useMediaQuery } from "usehooks-ts";
import PaymentMethod from "./Screens/PaymentMethod";
import Bills from "@/components/Bills/Bills";
import { Button } from "@/components/ui/button";
import { ArrowLeftCircleIcon } from "lucide-react";
type CheckoutModes = "products" | "paymentMethod" | "bills" | "confirm";
const modes: CheckoutModes[] = [
  "products",
  "paymentMethod",
  "bills",
  "confirm",
];
export default function CheckoutScreen() {
  const { open, setOpen } = useSidebar();
  const { productsQuery } = useProducts({ page: 1, limit: 40 });
  const [mode, setMode] = useState<CheckoutModes>("products");
  const [cart, setCart] = useState<CartInterface[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const changeMode = (back?: "back") => {
    const index = modes.indexOf(mode);
    if (index <= 0 && back) return;
    if (back && index - 1 >= 0) {
      setMode(modes[index - 1]);
      return;
    } else {
      if (index + 1 == modes.length) return;
      setMode(modes[index + 1]);
      return;
    }
  };

  const pushCart = (product: Product, quantity: number) => {
    if (cart.length == 0) {
      setCart([{ product, quantity, id: product.id }]);
    } else {
      const existsIndex = cart.findIndex((current) => current.id == product.id);
      if (existsIndex != -1) {
        const newQuantity = cart[existsIndex].quantity + 1;
        setCart((cart) => {
          cart[existsIndex].quantity = newQuantity;
          return [...cart];
        });
      } else {
        setCart((c) => [...c, { product, quantity, id: product.id }]);
      }
    }
  };
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };
  useEffect(() => {
    if (open) {
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (productsQuery.isFetching) return null;

  // * Payment Method Screen

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row">
      <section className="lg:w-3/4 w-full mt-20 md:mt-4">
        <div className="w-full">
          <Button
            variant="ghost"
            onClick={() => {
              changeMode("back");
            }}
            className="gap-2"
          >
            <ArrowLeftCircleIcon size={48} />
            Volver
          </Button>
        </div>
        {mode == "products" && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 
      gap-4 w-full flex-1 auto-rows-fr px-4"
          >
            {productsQuery.data?.map((product: Product) => (
              <ProductCard
                onClick={() => {
                  pushCart(product, 1);
                }}
                variant="checkout"
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
        {mode == "paymentMethod" && (
          <PaymentMethod
            onSelectMethod={(method) => {
              console.log(method);
            }}
          />
        )}
        {mode == "bills" && (
          <Bills
            onValueChange={(v) => {
              console.log(v);
            }}
          />
        )}
        {mode == "confirm" && <div> Confirm Screen</div>}
      </section>
      {!isMobile && (
        <section className="lg:w-1/4 w-full">
          <Cart
            changeMode={() => changeMode()}
            cart={cart}
            onQuantityChange={handleQuantityChange}
            isMobile={false}
          />
        </section>
      )}

      {isMobile && (
        <Cart
          changeMode={() => changeMode()}
          cart={cart}
          onQuantityChange={handleQuantityChange}
          isMobile={true}
        />
      )}

      {/* <Bills
        onValueChange={(v) => {
          console.log(v);
        }}
      /> */}
    </div>
  );
}
