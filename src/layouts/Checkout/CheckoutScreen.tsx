import "./css/checkout.css";
import { useSidebar } from "@/components/ui/sidebar";
import useProducts from "@/hooks/products/useProducts";
import { CartInterface } from "@/infrastructure/interfaces/cart/cart.interface";
import { Product } from "@/infrastructure/interfaces/products.interface";
import { useEffect, useState, useCallback, useRef } from "react";
import Cart from "./Cart/Cart";
import { useMediaQuery } from "usehooks-ts";
import PaymentMethod from "./Screens/PaymentMethod";
import Bills from "@/components/Bills/Bills";
import { Button } from "@/components/ui/button";
import { ArrowLeftCircleIcon, ScanIcon, Loader2Icon } from "lucide-react";
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
import DataTableViewClient from "@/components/DataTable/clients/DataTableClient";
import { Client } from "@/infrastructure/interfaces/clients/clients.response";
import CashBackBills from "./CashBackBills/CashBackBills";
import { useToast } from "@/hooks/use-toast";
import { Sale } from "@/infrastructure/interfaces/sale/sale.interface";
import PaginatedProductGrid from "@/components/PaginatedProducts/PaginatedProducts";
import useBarcodeScan from "@/hooks/barCode/useBarCodeScan";
import { searchProductsAction } from "@/core/actions/products/searchProducts.action";
const modes: CheckoutModes[] = [
  "products",
  "paymentMethod",
  "bills",
  "cashBack",
  "confirm",
];

export default function CheckoutScreen() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [preventConfirm, setPreventConfirm] = useState(false);
  const { id } = useParams();
  const [customer, setCustomer] = useState<Client | null>(null);
  const { tillsByIdQuery } = useTillById(id!);
  const [clientMoney, setClientMoney] = useState<number>(0);
  const userId = useAppSelector((state) => state.auth.userInfo?.id);
  const [tillStorage, setTillStorage] = useLocalStorage<string | null>(
    "till",
    null
  );
  const closeTillMutate = useMutation({
    mutationFn: async () => {
      try {
        await BackendApi.patch<Till>(`/till/open/${id}`).then(async () => {
          setTillStorage(null);
          navigate("/inventory/checkout");
          window.location.reload();
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
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);

  const [lastSale, setLastSale] = useState<Sale | null>(null);
  const [disabledScan, setDisabledScan] = useState<boolean>(false);

  // Referencia para almacenar los productos encontrados por código de barras
  const barcodeCache = useRef<{ [key: string]: Product[] }>({});

  // Función para buscar productos por código de barras
  const searchProductsByBarcode = useCallback(async (scannedCode: string) => {
    console.log("Buscando productos por código de barras:", scannedCode);

    // Verificar si el código está en la caché
    if (barcodeCache.current[scannedCode]) {
      console.log(
        "Productos encontrados en caché:",
        barcodeCache.current[scannedCode].length
      );
      return barcodeCache.current[scannedCode];
    }

    try {
      // Buscar el producto por código de barras
      const searchResults = await searchProductsAction(scannedCode);

      // Guardar en caché
      if (searchResults && searchResults.length > 0) {
        barcodeCache.current[scannedCode] = searchResults;
      }

      return searchResults;
    } catch (error) {
      console.error("Error al buscar productos por código de barras:", error);
      throw error;
    }
  }, []);

  // Hook para detectar escaneos de códigos de barras
  const { barcode, isScanning, forceFinalize } = useBarcodeScan({
    onScan: async (scannedCode) => {
      console.log("Código de barras escaneado:", scannedCode);

      // Verificar que el código no esté vacío
      if (!scannedCode || scannedCode.trim() === "") {
        console.log("Código de barras vacío, ignorando");
        return;
      }

      try {
        console.log("Iniciando búsqueda de productos con código:", scannedCode);

        // Buscar el producto por código de barras
        const searchResults = await searchProductsByBarcode(scannedCode);
        console.log("Resultados de búsqueda:", searchResults);

        if (searchResults && searchResults.length > 0) {
          console.log("Productos encontrados:", searchResults.length);

          // Si hay un único resultado, añadirlo al carrito automáticamente
          if (searchResults.length === 1) {
            console.log(
              "Añadiendo producto al carrito:",
              searchResults[0].name
            );
            pushCart(searchResults[0], 1);

            // Mostrar notificación de éxito
            toast({
              title: "Producto añadido",
              description: `${searchResults[0].name} ha sido añadido al carrito`,
              variant: "default",
            });
          } else {
            // Si hay múltiples resultados, mostrar en la lista de productos
            console.log("Múltiples productos encontrados, mostrando lista");
            setProducts(searchResults);

            toast({
              title: "Múltiples productos encontrados",
              description: `Se encontraron ${searchResults.length} productos con el código ${scannedCode}`,
              variant: "default",
            });
          }
        } else {
          console.log(
            "No se encontraron productos con el código:",
            scannedCode
          );

          toast({
            title: "Producto no encontrado",
            description: `No se encontró ningún producto con el código ${scannedCode}`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error al buscar producto por código de barras:", error);

        toast({
          title: "Error de búsqueda",
          description: "No se pudo buscar el producto escaneado",
          variant: "destructive",
        });
      }
    },
    enabled: mode === "products" && !disabledScan, // Solo activar en modo productos
    minBarcodeLength: 3, // Reducir la longitud mínima para permitir códigos más cortos
    maxBarcodeLength: 30, // Aumentar la longitud máxima para permitir códigos más largos
    duplicateScanDelay: 1500, // Evitar escaneos duplicados en 1.5 segundos
    // Patrón para validar códigos de barras (ajustar según tus necesidades)
    barcodePattern: /^[A-Za-z0-9\-_]+$/,
    // Permitir entrada manual del teclado como códigos de barras
    processManualInput: true,
  });

  // Efecto para mostrar el estado de escaneo
  useEffect(() => {
    if (isScanning) {
      console.log("Escaneando...");
    } else if (barcode) {
      console.log("Código escaneado:", barcode);
    }
  }, [isScanning, barcode]);

  // Función para forzar la finalización del escaneo (útil para botones o atajos)
  const handleForceScan = useCallback(() => {
    console.log("Forzando finalización de escaneo");
    forceFinalize();
  }, [forceFinalize]);

  const changeMode = (back?: "back") => {
    const index = modes.indexOf(mode);
    if (index == modes.length - 1 && preventConfirm) {
      setMode("products");
      setLastSale(null);
      return;
    }
    if (mode == "bills" && back) {
      setBillsPay({});
      setClientMoney(0);
      setMode("paymentMethod");
    }
    if ((mode === "cashBack" || mode === "confirm") && back) {
      setBillsCashBack({});
      setClientMoney(0);
      setMode("paymentMethod");
      return;
    }

    if (mode === "bills" && !back) {
      if (method === "cash") {
        // Solo permitir cashback si es efectivo
        if (clientMoney - total > 0) {
          setMode("cashBack");
        } else {
          setMode("confirm");
        }
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
    if (product.stock < quantity && !product.uncounted) {
      return;
    }
    if (cart.length == 0) {
      setCart([
        {
          product,
          quantity,
          id: product.id,
          uncounted: product.uncounted,
          stock: product.stock,
        },
      ]);
    } else {
      const existsIndex = cart.findIndex((current) => current.id == product.id);
      if (
        product.stock < cart[existsIndex]?.quantity + 1 &&
        !product.uncounted
      ) {
        return;
      }
      if (existsIndex != -1) {
        const newQuantity = cart[existsIndex].quantity + 1;
        setCart((cart) => {
          cart[existsIndex].quantity = newQuantity;
          return [...cart];
        });
      } else {
        setCart((c) => [
          ...c,
          {
            product,
            quantity,
            id: product.id,
            uncounted: product.uncounted,
            stock: product.stock,
          },
        ]);
      }
    }
  };
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (item.id === productId) {
            // If setting quantity to 0 (removing item), don't check stock
            if (newQuantity === 0) {
              return { ...item, quantity: 0 };
            }
            // Otherwise, check stock constraints
            if (item.uncounted || item.stock >= newQuantity) {
              return { ...item, quantity: newQuantity };
            }
          }
          return item;
        })
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
          client: customer?.id,
          paymentMethod: method,
        };

        const data = await BackendApi.post<Sale>("/sale/create", saleData);
        //! RESET

        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: (data) => {
      if (!data) return;
      setLastSale(data?.data);
      setPreventConfirm(true);
      //RESET ALL
      setCustomer(null);
      setCart([]);
      setBillsPay({});
      setClientMoney(0);
      setTotal(0);
      setCart([]);
      setBillsCashBack({});
      setBillsPay({});
    },
    onError: (error) => {
      console.error("Error creating sale:", error);
      toast({
        title: "Error al crear la venta",
        description: "Revisa los datos ingresados",
        variant: "destructive",
      });
      // Manejar error
    },
  });
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
            <DataTableViewClient
              notifyProvidersSelected={(client: Client) => {
                setCustomer(client);
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
          message="Regresarás al modo de selección de Tiendas.y la caja se cerrara ¿Deseas continuar?"
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
          } w-full mt-14 md:mt-4`}
        >
          <div
            className={`w-full px-4 mb-2 flex md:min-h-[60px] ${
              mode == "products" &&
              "justify-center items-center overflow-x-auto "
            }`}
          >
            <Button
              variant="ghost"
              onClick={() => {
                changeMode("back");
              }}
              className={`gap-2 text-lg border-2 border-white border-solid flex items-center ${
                mode == "products" && "text-red-500 ml-14 md:ml-0"
              }`}
            >
              <ArrowLeftCircleIcon size={48} />
              {mode == "products" ? "Cerrar Caja" : "Volver"}
            </Button>
            {/* {mode == "products" && (
              <Button
                variant="ghost"
                onClick={() => {
                  changeMode("back");
                }}
                className={`gap-2 text-lg border-2 border-white border-solid flex items-center text-green-600`}
              >
                <ArrowUpSquareIcon size={48} />
                Recuperar Venta
              </Button>
            )} */}
            {mode == "products" && (
              <SearchBar<Product | undefined>
                onFocus={() => {
                  setDisabledScan(true);
                }}
                onBlur={() => {
                  setDisabledScan(false);
                }}
                automate={true}
                mutateFunction={searchProductsAction}
                onGetData={(data) => {
                  if (data && data?.length > 0) {
                    setProducts(data as Product[]);
                  } else if (products.length > 0 && data?.length == 0) {
                    console.log("");
                  }
                }}
                onNotify={(query: string) => {
                  if (query.length == 0 && products.length != 0) {
                    setProducts([]);
                  }
                }}
                mode="min"
                placeholder="Buscar Productos por nombre o codigo o REF"
              />
            )}
            {mode == "products" && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleForceScan}
                className="ml-2"
                title="Forzar finalización de escaneo"
              >
                {isScanning ? (
                  <Loader2Icon className="h-5 w-5 animate-spin" />
                ) : (
                  <ScanIcon className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
          {mode == "products" && (
            <div className="flex-grow overflow-hidden">
              <PaginatedProductGrid
                products={
                  products.length > 0 ? products : productsQuery.data || []
                }
                pushCart={pushCart}
              />
            </div>
          )}
          {mode == "paymentMethod" && (
            <PaymentMethod
              onSelectMethod={(method) => {
                console.log("Method:", method);
                setMethod(method);
                setMode(method === "cash" ? "bills" : "confirm");
              }}
            />
          )}
          {mode == "bills" && (
            <Bills
              counted={true}
              onValueChange={(v, bills) => {
                setClientMoney(v);
                setBillsPay(bills);
              }}
            />
          )}
          {mode == "cashBack" && (
            <CashBackBills
              till={tillsByIdQuery.data!}
              objectiveValue={clientMoney - total}
              onValueChange={(amount, bills) => {
                setBillsCashBack(bills);
              }}
            />
          )}
          {mode == "confirm" && (
            <ConfirmScreen
              confirmFn={async () => {
                mutateAddSale.mutate();
              }}
              lastSale={lastSale}
            />
          )}
        </section>
        {!isMobile && mode != "paymentMethod" && (
          <section className="lg:w-1/4 w-full">
            <Cart
              client={customer}
              changeMode={() => changeMode()}
              cart={cart}
              mode={mode}
              onQuantityChange={handleQuantityChange}
              isMobile={false}
              clientMoney={clientMoney}
              notifyTotal={(value: number) => {
                setTotal(value);
              }}
            />
          </section>
        )}

        {isMobile && mode != "paymentMethod" && (
          <Cart
            client={customer}
            changeMode={() => changeMode()}
            cart={cart}
            mode={mode}
            onQuantityChange={handleQuantityChange}
            isMobile={true}
            clientMoney={clientMoney}
            notifyTotal={(value: number) => {
              setTotal(value);
            }}
          />
        )}
      </AlertDialog>
    </div>
  );
}
