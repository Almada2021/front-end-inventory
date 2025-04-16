import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useTillById from "@/hooks/till/useTillById";
import { formatCurrency } from "@/lib/formatCurrency.utils";

interface Props {
  id?: string;
}

export default function TillInfo({ id }: Props) {
  const { tillsByIdQuery } = useTillById(id || "");
  const { data, isFetching } = tillsByIdQuery;

  if (!id || isFetching || !data) return null;

  const baseTotal =
    data.type !== "till" && data.totalCash ? data.totalCash : 0;

  const billsTotal =
    data.type === "till"
      ? Object.entries(data.bills || {}).reduce(
          (sum, [denom, qty]) => sum + Number(denom) * qty,
          0
        )
      : 0;

  const total = baseTotal + billsTotal;

  return (
    <Card className="mt-4 shadow-lg rounded-2xl border border-gray-200">
      <CardHeader className="bg-blue-50 rounded-t-2xl p-4">
        <CardTitle className="text-xl text-blue-800 font-semibold">
          Datos de la caja: {data.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 space-y-4 bg-white rounded-b-2xl max-h-[200px] overflow-y-scroll">
        {data.type === "till" &&
          Object.entries(data.bills || {}).map(([denom, qty]) => {
            const value = Number(denom);
            const amount = value * qty;
            return (
              <div
                key={denom}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition"
              >
                <span className="font-medium text-green-600">
                  {formatCurrency(value)}
                </span>
                <span className="mx-2 font-medium text-blue-600">
                  x {qty}
                </span>
                <span className="font-medium text-gray-700">
                  = {formatCurrency(amount)}
                </span>
              </div>
            );
          })}

        {data.type !== "till" && data.totalCash != null && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm">
            <span className="font-medium text-gray-800">Efectivo inicial:</span>
            <span className="font-medium text-gray-800">
              {formatCurrency(data.totalCash)}
            </span>
          </div>
        )}

        <Separator className="my-2" />

        <div className="flex justify-end">
          <h4 className="text-2xl font-bold text-green-700">
            Total: {formatCurrency(total)}
          </h4>
        </div>
      </CardContent>
    </Card>
  );
}
