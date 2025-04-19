import useSalesByProductId from "@/hooks/sales/useSalesByProductId";
import LoadingScreen from "@/layouts/Loading/LoadingScreen";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatCurrency } from "@/lib/formatCurrency.utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, TrendingUp, Users } from "lucide-react";
import ClientInfo from "@/components/Infos/ClientInfo";
import { TRANSLATE_PAYMENT_METHODS } from "@/constants/translations/payments.methods";
import { useNavigate } from "react-router";

interface Props {
  id: string;
}

export default function ProductSales({ id }: Props) {
  const { salesByProductQuery } = useSalesByProductId(id!);
  const navigate = useNavigate();
  if (salesByProductQuery.isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[200px] ">
        <LoadingScreen />
      </div>
    );
  }

  const sales = salesByProductQuery.data?.sales || [];

  // Calculate summary statistics
  const totalSales = sales.length;
  const totalAmount = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalProfits = sales.reduce((sum, sale) => sum + sale.profits, 0);
  const uniqueClients = new Set(sales.map((sale) => sale.client)).size;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
            <p className="text-xs text-muted-foreground">
              Número total de ventas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Totales
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              Monto total de ventas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ganancias Totales
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalProfits)}
            </div>
            <p className="text-xs text-muted-foreground">
              Beneficio total generado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clientes Únicos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueClients}</div>
            <p className="text-xs text-muted-foreground">
              Número de clientes diferentes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Ventas</CardTitle>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay ventas registradas para este producto
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Ganancia</TableHead>
                  <TableHead>Método de Pago</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => {
                  const productInSale = sale.products.find(
                    (p) => p.product === id
                  );
                  return (
                    <TableRow key={sale.id}>
                      <TableCell>
                        <div
                          onClick={() => {
                            navigate(`/inventory/sales/${sale.id}`);
                          }}
                          className="text-blue-500 cursor-pointer hover:underline"
                        >
                          {sale.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(sale.createdAt), "PPP HH:mm", {
                          locale: es,
                        })}
                      </TableCell>
                      <TableCell>
                        <ClientInfo
                          renderFn={(data) => {
                            return (
                              <>
                                {data.name} {data.lastName}
                              </>
                            );
                          }}
                          clientId={sale.client}
                          keyValue="name"
                        />
                      </TableCell>
                      <TableCell>{productInSale?.quantity || 0}</TableCell>
                      <TableCell>{formatCurrency(sale.amount)}</TableCell>
                      <TableCell className="text-green-600">
                        {formatCurrency(sale.profits)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {TRANSLATE_PAYMENT_METHODS[sale.paymentMethod]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            productInSale?.cancelled ? "destructive" : "default"
                          }
                        >
                          {productInSale?.cancelled
                            ? "Cancelado"
                            : "Completado"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableCaption>
                Lista completa de ventas para este producto
              </TableCaption>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
