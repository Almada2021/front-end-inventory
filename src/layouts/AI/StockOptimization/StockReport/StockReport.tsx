import useAiReport from "@/hooks/ai/useAiReport";
import LoadingScreen from "@/layouts/Loading/LoadingScreen";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import ReactMarkdown from "react-markdown";
import { AlertCircle } from "lucide-react";

interface Props {
  startDate: string;
  endDate: string;
}

export default function StockReport({ startDate, endDate }: Props) {
  const { useAiReportQuery } = useAiReport({ startDate, endDate });

  if (useAiReportQuery.isFetching) {
    return <LoadingScreen />;
  }

  const data = useAiReportQuery.data;

  if (!data) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          No se pudieron cargar los datos de optimización de stock.
        </AlertDescription>
      </Alert>
    );
  }

  // Format data for charts
  const chartData = data.predictions.map((prediction) => ({
    name: prediction.Producto,
    "Stock Recomendado": prediction.StockRecomendado,
    "Demanda Pronosticada": prediction.DemandaPronosticada,
    "Stock Seguridad": prediction.StockSeguridad,
  }));

  // Data for pie chart
  const pieData = data.predictions.map((prediction) => ({
    name: prediction.Producto,
    value: prediction.DemandaPronosticada,
  }));

  // Colors for pie chart
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82ca9d",
  ];

  // Calculate totals for summary
  const totalDemand = data.predictions.reduce(
    (sum, item) => sum + item.DemandaPronosticada,
    0
  );
  const totalRecommendedStock = data.predictions.reduce(
    (sum, item) => sum + item.StockRecomendado,
    0
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reporte de Optimización de Stock</CardTitle>
          <CardDescription>
            Análisis del período: {new Date(startDate).toLocaleDateString()} -{" "}
            {new Date(endDate).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Demanda Total Pronosticada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalDemand.toFixed(1)} unidades
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Stock Total Recomendado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalRecommendedStock} unidades
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="table">Tabla de Predicciones</TabsTrigger>
          <TabsTrigger value="charts">Visualizaciones</TabsTrigger>
          <TabsTrigger value="analysis">Análisis Detallado</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Predicciones de Stock</CardTitle>
              <CardDescription>
                Recomendaciones basadas en el análisis de demanda histórica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>
                  Predicciones para el próximo período
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-right">
                      Demanda Pronosticada
                    </TableHead>
                    <TableHead className="text-right">
                      Stock de Seguridad
                    </TableHead>
                    <TableHead className="text-right">
                      Stock Recomendado
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.predictions.map((prediction, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {prediction.Producto}
                      </TableCell>
                      <TableCell className="text-right">
                        {prediction.DemandaPronosticada.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-right">
                        {prediction.StockSeguridad.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {prediction.StockRecomendado}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Comparativa de Stock y Demanda</CardTitle>
                <CardDescription>
                  Stock recomendado vs. demanda pronosticada
                </CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Stock Recomendado" fill="#8884d8" />
                    <Bar dataKey="Demanda Pronosticada" fill="#82ca9d" />
                    <Bar dataKey="Stock Seguridad" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución de Demanda</CardTitle>
                <CardDescription>
                  Proporción de demanda por producto
                </CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        `${value} unidades`,
                        "Demanda Pronosticada",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Análisis y Recomendaciones</CardTitle>
              <CardDescription>
                Conclusiones detalladas sobre la optimización de stock
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert bg-card p-4 rounded-md border">
                <ReactMarkdown>{data.comments}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
