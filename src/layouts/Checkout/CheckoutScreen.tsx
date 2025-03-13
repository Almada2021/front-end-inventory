import "./css/checkout.css";
import ProductCard from "@/components/Cards/Product/ProductCard";
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
import { PaymentMethod as TPaymentMethod } from "@/lib/database.types";
import AlertMessage from "../Alert/AlertMessage";
import useLocalStorage from "@/hooks/browser/useLocalStorage";
import { useNavigate, useParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { BackendApi } from "@/core/api/api";
import { Till } from "@/infrastructure/interfaces/till.interface";
import SearchBar from "@/components/SearchBar/SearchBar";
import { useAppSelector } from "@/config/react-redux.adapter";
import ConfirmScreen from "./Screens/ConfirmScreen";
import { CheckoutModes } from "@/types/ui.modes-checkout";
import useTillById from "@/hooks/till/useTillById";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useClients from "@/hooks/clients/useClients";
import DataTableView from "@/components/DataTable/DataTable";
const modes: CheckoutModes[] = [
  "products",
  "paymentMethod",
  "bills",
  "cashBack",
  "confirm",
];

export default function CheckoutScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { tillsByIdQuery } = useTillById(id!);
  const { queryAllClients } = useClients({ page: 1, limit: 1000 });
  const [clientMoney, setClientMoney] = useState<number>(0);
  const userId = useAppSelector((state) => state.auth.userInfo?.id);
  const [tillStorage, setTillStorage] = useLocalStorage<string | null>(
    "till",
    null
  );
  const closeTillMutate = useMutation({
    mutationFn: async () => {
      try {
        await BackendApi.patch<Till>(`/till/open/${id}`).then(async (till) => {
          const data = await till.data;
          if (typeof data.id == "string") {
            setTillStorage(null);
          }
        });
      } catch (error) {
        console.log(error);
      }
    },
    mutationKey: ["till", "store", id],
  });
  const { open, setOpen } = useSidebar();
  const { productsQuery } = useProducts({ page: 1, limit: 1000 });
  const [mode, setMode] = useState<CheckoutModes>("products");
  const [cart, setCart] = useState<CartInterface[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [method, setMethod] = useState<TPaymentMethod>("cash");
  const [backToSelection, setBackToSelection] = useState<boolean>(false);
  const [billsPay, setBillsPay] = useState<{ [key: string]: number }>({});
  const [billsCashBack, setBillsCashBack] = useState<{ [key: string]: number }>(
    {}
  );
  const changeMode = (back?: "back") => {
    const index = modes.indexOf(mode);

    if (mode === "cashBack") {
      setMode("paymentMethod");
      return;
    }

    if (mode === "bills" && !back) {
      if (method === "cash") {
        // Solo permitir cashback si es efectivo
        setMode("cashBack");
        return;
      } else {
        setMode("confirm"); // Saltar cashback si el método no es efectivo
        return;
      }
    }

    if (mode === "confirm" && back) {
      setMode(method === "cash" ? "cashBack" : "paymentMethod");
      setClientMoney(0);
      return;
    }

    if (index <= 0 && back) {
      setBackToSelection(true);
      return;
    }

    if (back && index - 1 >= 0) {
      setMode(modes[index - 1]);
      return;
    } else {
      if (index + 1 === modes.length) return;
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
  const mutateAddSale = useMutation({
    mutationFn: async () => {
      try {
        let profits = 0;
        let amount = 0;
        const products = cart.map((product: CartInterface) => {
          amount += product.quantity * product.product.price;
          profits += product.product.price - product.product.basePrice;
          return { product: product.id, quantity: product.quantity };
        });

        const saleData = {
          amount,
          products,
          bills: billsPay,
          billsCashBack: method === "cash" ? billsCashBack : {}, // Solo incluir cashback si es efectivo
          till: id,
          sellerId: userId,
          profits,
        };

        const data = await BackendApi.post("/sale/create", saleData);

        //! RESET
        setCart([]);
        setBillsPay({});
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
    mutationKey: ["sale"],
  });

  console.log(mutateAddSale);
  useEffect(() => {
    if (open) {
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (tillStorage == null) {
      navigate("./../");
    }
  }, [tillStorage, navigate]);

  if (productsQuery.isFetching || tillsByIdQuery.isFetching) return null;
  console.log(method);
  // * Payment Method Screen

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row">
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Busca los Proveedores</AlertDialogTitle>
            <AlertDialogDescription>
              Marcalos y confirma para agregar
            </AlertDialogDescription>
            <DataTableView
              initial={
                queryAllClients.data?.map(
                  (client) => client.name + client.lastName
                ) || []
              }
              notifyProvidersSelected={(value: string[]) => {
                // setProviders(value);
                console.log(value);
              }}
            />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {}}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        <AlertMessage
          open={backToSelection}
          title="¿Estás seguro de que deseas volver?"
          message="Regresarás al modo de selección de Tiendas. ¿Deseas continuar?"
          onConfirm={async () => {
            closeTillMutate.mutate();
          }}
          onCancel={() => {
            setBackToSelection(false);
          }}
        />
        <section
          className={`${
            mode !== "paymentMethod" && "lg:w-3/4"
          } w-full mt-20 md:mt-4`}
        >
          <div
            className={`w-full px-4 mb-2 flex min-h-[60px] ${
              mode == "products" && "justify-center items-center"
            }`}
          >
            <Button
              variant="ghost"
              onClick={() => {
                changeMode("back");
              }}
              className="gap-2 text-lg border-2 border-white border-solid"
            >
              <ArrowLeftCircleIcon size={48} />
              Volver
            </Button>
            {mode == "products" && (
              <SearchBar
                placeholder="Busca tu producto por codigo o nombre"
                mode="min"
                mutateFunction={async (
                  query: string
                ): Promise<unknown[] | undefined> => {
                  console.log(query);
                  return;
                }}
              />
            )}
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
                setMethod(method);
                setMode(method === "cash" ? "bills" : "confirm");
              }}
            />
          )}
          {mode == "bills" && (
            <Bills
              onValueChange={(v, bills) => {
                setClientMoney(v);
                console.log(clientMoney, "cm");
                setBillsPay(bills);
              }}
            />
          )}
          {mode == "cashBack" && (
            <Bills
              onValueChange={(v, bills) => {
                setBillsCashBack(bills);
              }}
            />
          )}
          {mode == "confirm" && (
            <ConfirmScreen
              confirmFn={async () => {
                mutateAddSale.mutate();
              }}
            />
          )}
        </section>
        {!isMobile && mode != "paymentMethod" && (
          <section className="lg:w-1/4 w-full">
            <Cart
              changeMode={() => changeMode()}
              cart={cart}
              mode={mode}
              onQuantityChange={handleQuantityChange}
              isMobile={false}
              clientMoney={clientMoney}
            />
          </section>
        )}

        {isMobile && mode != "paymentMethod" && (
          <Cart
            changeMode={() => changeMode()}
            cart={cart}
            mode={mode}
            onQuantityChange={handleQuantityChange}
            isMobile={true}
            clientMoney={clientMoney}
          />
        )}
      </AlertDialog>
    </div>
  );
}
