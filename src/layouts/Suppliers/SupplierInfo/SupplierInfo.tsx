import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useProductsByIds from "@/hooks/products/useProductsByIds";
import useProvider from "@/hooks/providers/useProvider";
import { Product } from "@/infrastructure/interfaces/products.interface";
import LoadingScreen from "@/layouts/Loading/LoadingScreen";
import {
  ArrowUpRight,
  CircleUser,
  Frown,
  PhoneCallIcon,
  TruckIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
export default function SupplierInfo() {
  const { id } = useParams<{ id: string }>();
  const { getProviderById } = useProvider(id!);
  const navigate = useNavigate();
  const { getProductsByIds } = useProductsByIds(
    getProviderById.data?.productsIds || []
  );
  if (
    getProviderById.isFetching ||
    getProviderById.isLoading ||
    getProductsByIds.isFetching
  ) {
    return <LoadingScreen />;
  }
  if (!getProviderById.data) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center mt-10 md:mt-4">
        <Frown size={64} />
        <h3 className="text-primary text-3xl font-bold">No Encontrado</h3>
        <Button
          onClick={() => {
            navigate(-1);
          }}
        >
          Volver Atras
        </Button>
      </div>
    );
  }
  return (
    <div className="w-full p-4 md:p-6 max-w-6xl mx-auto mt-10 md:mt-4">
      {/* Sección de información del proveedor */}
      <div className="mb-8 space-y-6">
        <div className="border rounded-lg p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <TruckIcon className="h-8 w-8 text-primary" />
              {getProviderById.data.name}
            </h1>
            <Badge variant="secondary" className="w-fit">
              ID: {getProviderById.data.id}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CircleUser className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Vendedor</p>
                <p className="font-medium">{getProviderById.data.seller}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <PhoneCallIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Contacto</p>
                <p className="font-medium">
                  {getProviderById.data.phoneNumber}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />
      </div>

      {/* Sección de productos */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          Productos asociados
          <Badge variant="outline" className="text-sm">
            {getProductsByIds.data?.length || 0}
          </Badge>
        </h2>
      </div>

      {getProductsByIds.data?.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No hay productos asociados</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Producto</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-right">Costo</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-center">Imagen</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {getProductsByIds.data?.map((product: Product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>

                <TableCell className="text-right">
                  <span className="text-green-600 font-semibold">
                    {product.price.toLocaleString()} Gs.
                  </span>
                </TableCell>

                <TableCell className="text-right">
                  {product.basePrice?.toLocaleString() || "0"} Gs.
                </TableCell>

                <TableCell className="text-right">
                  <Badge
                    variant={product.stock > 0 ? "default" : "destructive"}
                  >
                    {product.stock}
                  </Badge>
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <img
                      alt={product.name}
                      src={product.photoUrl}
                      className="h-12 w-12 rounded-md object-cover border hover:scale-105 transition-transform cursor-pointer"
                      onClick={() => navigate(`../../products/${product.id}`)}
                    />
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`../../products/${product.id}`)}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableCaption>
            Lista completa de productos proveídos por{" "}
            {getProviderById.data.name}
          </TableCaption>
        </Table>
      )}
    </div>
  );
}
