// import Bills from "@/components/Bills/Bills";
import ProductCard from "@/components/Cards/Product/ProductCard";
// import SearchBar from "@/components/SearchBar/SearchBar";
import { useSidebar } from "@/components/ui/sidebar";
import useProducts from "@/hooks/products/useProducts";
import { CartInterface } from "@/infrastructure/interfaces/cart/cart.interface";
import { Product } from "@/infrastructure/interfaces/products.interface";
import { useEffect, useState } from "react";
import Cart from "./Cart/Cart";

type CheckoutModes = "products" | "paymentMethod" | "bills" | "confirm";

export default function CheckoutScreen() {
  const { open, setOpen } = useSidebar();
  const { productsQuery } = useProducts({ page: 1, limit: 40 });
  const [mode, setMode] = useState<CheckoutModes>("products");
  const [cart, setCart] = useState<CartInterface[]>([]);
  const changeMode = (newMode: CheckoutModes) => {
    setMode(newMode);
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

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row">
      <section className="lg:w-3/4 w-full mt-4">
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
        {mode == "bills" && <div>bills</div>}
      </section>
      <section className="lg:w-1/4 w-full  lg:border-l">
        <section
          className="h-[calc(100vh-100px)] lg:h-5/6"
          aria-label="products carts"
          title="Carrito de Productos"
        >
          <Cart onQuantityChange={handleQuantityChange} cart={cart} />
        </section>
        <button onClick={() => changeMode("bills")}>Confirmar</button>
      </section>
      {/* <Bills
        onValueChange={(v) => {
          console.log(v);
        }}
      /> */}
    </div>
  );
}
