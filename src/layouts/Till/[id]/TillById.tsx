import Money from "@/components/Bills/Money/Money";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import useTillById from "@/hooks/till/useTillById";
import LoadingScreen from "@/layouts/Loading/LoadingScreen";
import { ArrowRightLeft, History, LogOut } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";

type PageModes = "retire" | "tranfert" | "active";
export default function TillById() {
  const { id } = useParams();

  const [pageMode, setPageMode] = useState<PageModes>("active");
  const { tillsByIdQuery } = useTillById(id!);
  if (tillsByIdQuery.isFetching) return <LoadingScreen />;

  const till = tillsByIdQuery.data;
  if (!id || !till) return <div>404 No Encontrado</div>;
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PY").format(amount) + " Gs.";
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-6 max-w-6xl mx-auto">
      {pageMode == "tranfert" && <div>Transfert</div>}
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
                  <p className="text-muted-foreground">Efectivo Total</p>
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Desglose de Efectivo</CardTitle>
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
                <span>Efectivo:</span>
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
                Transferir Dinero a otra Caja
              </Button>
              <Button className="flex justify-start">
                <LogOut size={24} />
                Retirar del Sistema
              </Button>
              <Button className="flex justify-start">
                <History size={24} />
                Historial de Movimientos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
