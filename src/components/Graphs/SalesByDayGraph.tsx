import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { addDays, subDays } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useSalesDashboard from "@/hooks/graphs/useSalesDashboard";
import { Skeleton } from "../ui/skeleton";
import { formatCurrency } from "@/lib/formatCurrency.utils";
import { useNavigate } from "react-router";

const chartConfig = {
  desktop: {
    label: "ventas", // Cambiado a español
    color: "#2c5282", // Azul oscuro que combina con tema blanco/negro
  },
} satisfies ChartConfig;
interface Props {
  date?: Date;
  range?: number;
}
export function SalesByDayGraph({ date = new Date(), range = 7 }: Props) {
  const startDate = subDays(date, range);
  const endDate = addDays(date, 1);
  const navigate = useNavigate();
  const { salesByDayQuery } = useSalesDashboard(startDate, endDate);
  const salesData = salesByDayQuery.data || [];
  if (salesData.length < 1) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ventas</CardTitle>
          <CardDescription>No hay datos para mostrar</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  const parseDataToGraph = Object.entries(salesData || {}).map(
    ([key, value]) => ({
      date: key,
      ventas: value,
    })
  );

  // Add validation to ensure parseDataToGraph has elements
  if (parseDataToGraph.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ventas</CardTitle>
          <CardDescription>No hay datos para mostrar</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const maxSales = Math.max(...parseDataToGraph.map((item) => item.ventas), 0);
  const yAxisMax = Math.ceil(maxSales / 100000) * 100000;
  const yAxisTicks = Array.from(
    { length: Math.floor(yAxisMax / 100000) + 1 },
    (_, i) => i * 100000
  );
  // Calcular tendencia basada en los últimos dos días
  let trendPercentage = 0;
  let trendDirection = "alza"; // Dirección predeterminada

  if (parseDataToGraph.length >= 2) {
    const lastDaySales = parseDataToGraph[parseDataToGraph.length - 1].ventas;
    const penultimateDaySales =
      parseDataToGraph[parseDataToGraph.length - 2].ventas;

    if (penultimateDaySales > 0) {
      trendPercentage =
        ((lastDaySales - penultimateDaySales) / penultimateDaySales) * 100;
      trendDirection = trendPercentage >= 0 ? "alza" : "baja";
      trendPercentage = Math.abs(trendPercentage);
    }
  }
  const formattedTrendPercentage = trendPercentage.toFixed(1);

  if (salesByDayQuery.isFetching) {
    return <Skeleton className="h-10 w-full md:w-1/2 " />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas</CardTitle>
        <CardDescription>
          {" "}
          {startDate.toLocaleDateString()}-{date.toLocaleDateString()}{" "}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={parseDataToGraph}>
            <CartesianGrid vertical={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={20}
              width={100}
              ticks={yAxisTicks}
              tickFormatter={(value: number) =>
                new Intl.NumberFormat("es-PY", {
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(value)
              }
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              style={{
                fontWeight: 700,
              }}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              onClick={(e: { date: string }) => {
                navigate(
                  `/inventory/sales?startDate=${e.date}&endDate=${e.date}`
                );
              }}
              dataKey="ventas"
              fill="var(--color-desktop)"
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Tendencia {trendDirection == "alza" ? "al" : "a la"} {trendDirection}{" "}
          del {formattedTrendPercentage}% entre los últimos días hoy:{" "}
          <div className="bg-green-500 rounded-md px-2">
            {parseDataToGraph.length > 0 &&
              formatCurrency(
                parseDataToGraph[parseDataToGraph.length - 1].ventas
              )}
          </div>
          <TrendingUp
            className={`h-4 w-4 ${
              trendDirection === "baja" ? "rotate-180" : ""
            }`}
          />
        </div>
        <div className="leading-none text-muted-foreground">
          Mostrando ventas totales de los últimos {range} días
        </div>
      </CardFooter>
    </Card>
  );
}
