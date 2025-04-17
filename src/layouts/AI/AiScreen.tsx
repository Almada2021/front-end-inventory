import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, BarChart, Lightbulb, Bot } from "lucide-react";

interface AiItem {
  title: string;
  url: string;
  description: string;
  icon: React.ReactNode;
}

const AiModules: AiItem[] = [
  {
    title: "Carga Inteligente",
    url: "/inventory/ai/load-product",
    description: "Carga productos usando IA",
    icon: <UploadCloud className="w-8 h-8" />,
  },
  {
    title: "Optimización de Stock",
    url: "/inventory/ai/stock-optimization",
    description: "Recomendaciones de niveles de inventario",
    icon: <BarChart className="w-8 h-8" />,
  },
  {
    title: "Análisis Predictivo",
    url: "/inventory/sales-forecast",
    description: "Predicción de demanda futura",
    icon: <Lightbulb className="w-8 h-8" />,
  },
  {
    title: "Asistente Virtual",
    url: "/inventory/assistant",
    description: "Consulta interactiva con IA",
    icon: <Bot className="w-8 h-8" />,
  },
];

export default function AiScreen() {
  return (
    <div className="min-h-screen w-full p-8 mt-10 md:mt-0">
      <h1 className="text-3xl font-bold mb-8">Herramientas de IA</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {AiModules.map((module: AiItem, index: number) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow duration-300 group"
          >
            <CardHeader className="flex flex-col items-center text-center">
              <div className="mb-4 text-primary bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors">
                {module.icon}
              </div>
              <CardTitle className="text-xl">{module.title}</CardTitle>
              <CardDescription className="mt-2 text-gray-600 dark:text-gray-400">
                {module.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Button
                asChild
                className="w-full max-w-[200px] gap-2 transition-transform group-hover:scale-105"
                variant="outline"
              >
                <a href={module.url}>
                  <span>Iniciar</span>
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
