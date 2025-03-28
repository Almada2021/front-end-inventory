import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useTillById from "@/hooks/till/useTillById";
import { formatCurrency } from "@/lib/formatCurrency.utils";

interface Props {
  id?: string;
}
export default function TillInfo({ id }: Props) {
  const { tillsByIdQuery } = useTillById(id || "");
  let total = 0;
  if (!id || tillsByIdQuery.isFetching) return null;
  return (
    <Card className="mt-2">
      <CardHeader>
        <CardTitle>Datos de la caja {tillsByIdQuery.data?.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {Object.entries(tillsByIdQuery.data?.bills || {}).map(
          ([denomination, quantity]) => {
            const ndenomination = Number(denomination);
            const amount = ndenomination * quantity;
            total += amount;
            return (
              <div>
                <p>
                  <div className="text-green-400 inline-block font-bold">
                    {formatCurrency(ndenomination)}
                  </div>{" "}
                  x
                  <div className="text-blue-400 inline-block font-bold">
                    {quantity}
                  </div>
                  <div className=" inline-block font-bold">
                    = {formatCurrency(amount)}
                  </div>
                </p>
              </div>
            );
          }
        )}
        <Separator></Separator>
        <h4 className="font-bold">Total ={formatCurrency(total)}</h4>
      </CardContent>
    </Card>
  );
}
