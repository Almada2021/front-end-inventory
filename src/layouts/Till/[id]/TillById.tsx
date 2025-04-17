import Money from "@/components/Bills/Money/Money";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import useTillById from "@/hooks/till/useTillById";
import LoadingScreen from "@/layouts/Loading/LoadingScreen";
import { DEFAULT_DENOMINATIONS } from "@/lib/database.types";
import {
  ArrowRightLeft,
  Banknote,
  CoinsIcon,
  CreditCard,
  History,
  LogOut,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import TillSelector from "./TillSelector/TillSelector";
import TillInfo from "./TillInfo/TillInfo";
import { useMutation } from "@tanstack/react-query";
import { BackendApi } from "@/core/api/api";
import { useAppSelector } from "@/config/react-redux.adapter";
import toast from "react-hot-toast";
import { useAdmin } from "@/hooks/browser/useAdmin";
import MoneyInput from "@/components/MoneyInput/MoneyInput";
type PageModes = "retire" | "tranfert" | "active";
export default function TillById() {
  const { id } = useParams();
  const isAdmin = useAdmin();
  const navigate = useNavigate();
  const [pageMode, setPageMode] = useState<PageModes>("active");
  const { tillsByIdQuery } = useTillById(id!);
  const [tills, setTills] = useState<[string?, string?]>([]);
  const [bills, setBills] = useState<Record<string, number>>({});
  const [transfertMode, setTranfertMode] = useState<
    "cash" | "card" | "transfer" | undefined
  >(undefined);
  const userId = useAppSelector((state) => state.auth.userInfo?.id);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const amount = Object.entries(bills).reduce(
    (acc, [denomination, quantity]) => {
      return acc + Number(denomination) * quantity;
    },
    0
  );

  const [moneyCard, setMoneyCard] = useState(1000);
  const [moneyTransfer, setMoneyTransfer] = useState(0);
  // Mutate Transfert
  const mutateTransfert = useMutation({
    mutationFn: async () => {
      try {
        let data: { [key: string]: unknown } = {};
        if (transfertMode == "cash") {
          if (!bills) {
            throw new Error("Necesitas billetes");
          }

          data = {
            billsToTransfert: bills,
            amount,
            tillToTransfert: id,
            tillToReceived: tills[1],
            method: transfertMode,
            user: userId,
          };
        }
        if (transfertMode == "card") {
          data = {
            billsToTransfert: {},
            amount: moneyCard,
            tillToTransfert: id,
            tillToReceived: tills[1],
            method: transfertMode,
            user: userId,
          };
        }
        if (transfertMode == "transfer") {
          data = {
            billsToTransfert: {},
            amount: moneyTransfer,
            tillToTransfert: id,
            tillToReceived: tills[1],
            method: transfertMode,
          };
        }
        const response = await BackendApi.post("/till/transfert-money", data);
        console.log(response);
        setBills({});
        setPageMode("active");
        tillsByIdQuery.refetch();
        toast.success("Se Transfirio correctamente", {
          className: "text-xl ",
        });
      } catch (error) {
        console.log(error);
      }
    },
    mutationKey: ["transfert", "till", `${id}`],
  });
  // const [amount, setAmount] = useState<number>(0);
  if (tillsByIdQuery.isFetching) return <LoadingScreen />;

  const till = tillsByIdQuery.data;
  const type = till?.type;
  if (!isAdmin) {
    navigate("/inventory");
    return null;
  }
  if (!id || !till) return <div>404 No Encontrado</div>;
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PY").format(amount) + " Gs.";
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-6 max-w-6xl mx-auto">
      {/* Transfert Dialog */}
      <AlertDialog open={pageMode == "tranfert"}>
        <AlertDialogContent className="w-full min-w-[80svw] ">
          <AlertDialogTitle>
            Transferir Desde {tillsByIdQuery.data.name} tienes{" "}
            {transfertMode == "cash" &&
              formatCurrency(tillsByIdQuery.data.totalCash)}
            {transfertMode == "card" &&
              formatCurrency(tillsByIdQuery.data.cardPayments)}
            {transfertMode == "transfer" &&
              formatCurrency(tillsByIdQuery.data.transferPayments)}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Transferir dinero de una caja a otra
          </AlertDialogDescription>
          {!transfertMode && (
            <div className="flex flex-col">
              <h3 className="text-3xl font-bold">
                Seleccionar Medio de Transferencia
              </h3>
              <div className="flex flex-row justify-evenly">
                <Button
                  onClick={() => setTranfertMode("cash")}
                  className="text-2xl"
                >
                  <CoinsIcon size={24} />
                  Efectivo
                </Button>
                <Button
                  onClick={() => setTranfertMode("card")}
                  className="text-2xl"
                >
                  <CreditCard size={24} />
                  Tarjetas
                </Button>
                <Button
                  className="text-2xl"
                  onClick={() => setTranfertMode("transfer")}
                >
                  <Banknote size={24} />
                  Transferencias
                </Button>
              </div>
            </div>
          )}
          {transfertMode == "cash" && (
            <div className="flex flex-col md:flex-row gap-4">
              <div>
                {!tills[0] && (
                  <TillSelector
                    currentTill={tillsByIdQuery.data.id}
                    storeId={tillsByIdQuery.data.storeId}
                    selectTill={(value: string) => {
                      setTills((val) => [val[0], value]);
                    }}
                  />
                )}
                <TillInfo id={tills[1]} />
                <div className="mt-4 p-4 bg-green-50 rounded-lg shadow-sm flex items-center justify-between">
                  <span className="text-gray-800 font-medium">
                    Vas a transferir
                  </span>
                  <span className="text-green-600 font-bold text-xl">
                    {transfertMode === "cash" &&
                      formatCurrency(
                        Object.entries(bills).reduce(
                          (acc, [denomination, quantity]) =>
                            acc + Number(denomination) * quantity,
                          0
                        )
                      )}
                  </span>
                </div>
              </div>
              {tills[1] && (
                <div className="grid grid-cols-3 gap-2 max-h-[200px] md:max-h-full overflow-y-auto overflow-x-hidden ">
                  {DEFAULT_DENOMINATIONS.map((amount: string) => {
                    return (
                      <div
                        className="relative"
                        key={amount + "alertdialogtransfert"}
                      >
                        <Money
                          onClick={() => {
                            setBills((b) => {
                              if (
                                b[amount] + 1 >
                                  tillsByIdQuery.data.bills[amount] ||
                                tillsByIdQuery.data.bills[amount] == 0
                              ) {
                                return b;
                              }
                              return {
                                ...b,
                                [amount]: (b[amount] || 0) + 1,
                              };
                            });
                          }}
                          type={Number(amount) > 1000 ? "bill" : "coin"}
                          alt={`${amount}Gs`}
                          src={`/money/${amount}.${
                            Number(amount) > 1000 ? "jpg" : "png"
                          }`}
                          className={`${
                            Number(amount) > 1000 ? "p-4" : ""
                          } bg-muted rounded-xl hover:scale-105 transition-transform`}
                        />
                        <span className="absolute top-2 right-8 bg-white font-bold text-black px-2 py-1 rounded text-sm md:text-xl">
                          Disp:{tillsByIdQuery.data.bills[amount]}
                        </span>
                        {bills[amount] > 0 && (
                          <span className="absolute bottom-2 right-8 bg-primary font-bold text-white text-sm md:text-xl px-2 py-1 rounded">
                            Sel: {bills[amount]}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {transfertMode == "card" && (
            <div className="flex flex-col md:flex-row gap-4">
              <div>
                {!tills[0] && (
                  <TillSelector
                    currentTill={tillsByIdQuery.data.id}
                    storeId={tillsByIdQuery.data.storeId}
                    selectTill={(value: string) => {
                      setTills((val) => [val[0], value]);
                    }}
                  />
                )}
                <TillInfo id={tills[1]} />
                <div className="text-green-300 font-bold text-xl mt-2">
                  <div className="text-black inline-block">
                    Vas a transferir <p></p> {formatCurrency(moneyCard)}
                  </div>
                </div>
              </div>
              <div className=" w-full flex justify-center items-center">
                <MoneyInput
                  maxAmount={tillsByIdQuery.data.cardPayments}
                  moneyCard={moneyCard}
                  setMoneyCard={setMoneyCard}
                />
              </div>
            </div>
          )}

          {transfertMode == "transfer" && (
            <div className="flex flex-col md:flex-row gap-4">
              <div>
                {!tills[0] && (
                  <TillSelector
                    currentTill={tillsByIdQuery.data.id}
                    storeId={tillsByIdQuery.data.storeId}
                    selectTill={(value: string) => {
                      setTills((val) => [val[0], value]);
                    }}
                  />
                )}
                <TillInfo id={tills[1]} />
                <div className="text-green-300 font-bold text-xl mt-2">
                  <div className="text-black inline-block">
                    Vas a transferir <p></p> {formatCurrency(moneyTransfer)}
                  </div>
                </div>
              </div>
              <div className=" w-full flex justify-center items-center">
                <MoneyInput
                  maxAmount={tillsByIdQuery.data.transferPayments}
                  moneyCard={moneyTransfer}
                  setMoneyCard={setMoneyTransfer}
                />
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setTranfertMode(undefined);
                setPageMode("active");
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                mutateTransfert.mutate();
              }}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteMode}>
        <AlertDialogContent>
          <AlertDialogTitle>
            ¿Estas seguro que deseas eliminar la caja?
          </AlertDialogTitle>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteMode(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await BackendApi.delete(`/till/${tillsByIdQuery.data.id}`);
                navigate(-1);
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sección principal */}
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-2">
            {till.name}
            <Badge variant="outline" className="text-sm">
              ID: {till.id}
            </Badge>
          </h1>

          <ScrollArea className="h-[calc(100vh-180px)] pr-4">
            {/* Resumen General */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Resumen General</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    {type == "till" ? "Efectivo Total" : "Saldo Total"}
                  </p>
                  <p className="text-2xl font-semibold text-green-600">
                    {formatCurrency(till.totalCash)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground">Tarjetas</p>
                  <p className="text-2xl font-semibold text-blue-600">
                    {formatCurrency(till.cardPayments)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground">Transferencias</p>
                  <p className="text-2xl font-semibold text-purple-600">
                    {formatCurrency(till.transferPayments)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Detalle de Billetes */}
            {type == "till" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Desglose de Efectivo
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Object.entries(till.bills).map(
                      ([denomination, quantity]) =>
                        quantity > 0 && (
                          <div
                            key={denomination}
                            className="flex flex-col items-center p-4 border rounded-lg"
                          >
                            <Money
                              src={`/money/${denomination}.${
                                Number(denomination) > 1000 ? "jpg" : "png"
                              }`}
                              alt={`Billete de ${denomination} Gs.`}
                              className="w-24 h-auto mb-2"
                            />
                            <div className="text-center">
                              <p className="font-medium">{denomination} Gs.</p>
                              <p className="text-muted-foreground">
                                Cantidad: {quantity}
                              </p>
                              <p className="text-green-600 font-semibold">
                                {formatCurrency(
                                  parseInt(denomination) * quantity
                                )}
                              </p>
                            </div>
                          </div>
                        )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </ScrollArea>
        </div>

        {/* Sidebar con totales */}
        <div className="md:w-80 space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Totales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>{type == "till" ? "Efectivo:" : "saldo"}</span>
                <span className="font-semibold">
                  {formatCurrency(till.totalCash)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Tarjetas:</span>
                <span className="font-semibold">
                  {formatCurrency(till.cardPayments)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Transferencias:</span>
                <span className="font-semibold">
                  {formatCurrency(till.transferPayments)}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-primary font-bold">
                <span>Total General:</span>
                <span>
                  {formatCurrency(
                    till.totalCash + till.cardPayments + till.transferPayments
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Operaciones</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button
                onClick={() => {
                  setPageMode("tranfert");
                }}
                className="flex justify-start"
              >
                <ArrowRightLeft size={24} />
                {type == "till"
                  ? "Transferir Dinero a otra Caja"
                  : "Transferir Dinero a otra cuenta"}
              </Button>
              <Button className="flex justify-start">
                <LogOut size={24} />
                Retirar del Sistema
              </Button>
              <Button className="flex justify-start">
                <History size={24} />
                Historial de Movimientos
              </Button>
              <Button
                onClick={() => {
                  setDeleteMode(true);
                }}
                variant="destructive"
                className="flex justify-start"
              >
                <Trash size={24} />
                Eliminar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
