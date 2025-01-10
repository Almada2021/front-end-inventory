import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AiItem {
  title: string;
  url: string;
  description: string;
}

const AiModules: AiItem[] = [
  {
    title: "Cargar Producto",
    url: "/inventory/load-product",
    description: "Permite cargar un producto",
  },
  {
    title: "Cargar Producto",
    url: "/inventory/load-product",
    description: "Permite cargar un producto",
  },
  {
    title: "Cargar Producto",
    url: "/inventory/load-product",
    description: "Permite cargar un producto",
  },
  {
    title: "Cargar Producto",
    url: "/inventory/load-product",
    description: "Permite cargar un producto",
  },
];
export default function AiScreen() {
  return (
    <div className="min-h-[100svh] w-full  flex px-10 py-10 items-center gap-10 flex-wrap">
      {AiModules.map((module: AiItem) => {
        return (
          <Card className="sm:w-full md:w-4/12 lg:w-3/12 ">
            <CardHeader>
              <img
                className="object-cover "
                src="https://cdn.corporatefinanceinstitute.com/assets/product-mix3.jpeg"
                alt={`${module.title} ${module.description}`}
              />
              <CardTitle>{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
