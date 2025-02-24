import { Button } from "@/components/ui/button";
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
import { CircleUser, Frown, PhoneCallIcon, TruckIcon } from "lucide-react";
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
      <div className="w-full h-screen flex flex-col items-center justify-center">
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
    <div className="w-full">
      <section className="w-full p-2 md:px-20 ">
        <div className=" mt-20 rounded border-2 border-separate border-primary min-h-[200px] flex flex-col justify-center ">
          <div className="flex items-center gap-1 mt-2 mx-2">
            <TruckIcon size={24} />
            <h2 className="text-md font-bold">Nombre:</h2>
            {getProviderById.data.name}
          </div>

          <div className="flex items-center gap-1 mt-2 mx-2">
            <CircleUser size={24} />
            <h2 className="text-md font-bold">Vendedor:</h2>
            <p>{getProviderById.data.seller}</p>
          </div>
          <div className="flex items-center gap-1 mt-2 mx-2">
            <PhoneCallIcon size={24} />
            <h2 className="text-md font-bold">Numero:</h2>
            <p>{getProviderById.data.phoneNumber}</p>
          </div>
        </div>
      </section>
      <section className="w-full p-1 md:p-20">
        <Table>
          <TableCaption>
            Lista de productos del proveedor {getProviderById.data.name}
            <TableHeader>
              <TableRow>
                <TableHead className="w-2/12 bg-primary text-white text-center ">
                  Nombre
                </TableHead>
                <TableHead className="w-2/12 bg-primary text-white text-center">
                  Precio
                </TableHead>
                <TableHead className="w-2/12 bg-primary text-white text-center">
                  Costo
                </TableHead>
                <TableHead className="w-2/12  bg-primary text-white text-center">
                  Cantidad
                </TableHead>
                <TableHead className="w-2/12  bg-primary text-white text-center">
                  Foto
                </TableHead>
                <TableHead className="w-2/12 bg-primary text-white text-center">
                  Ir
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getProductsByIds.data?.map((product: Product) => {
                return (
                  <TableRow>
                    <TableCell>{product.name}</TableCell>
                    <TableCell className="text-xs md:text-sm">
                      {product.price.toLocaleString()} Gs.
                    </TableCell>
                    <TableCell className="text-xs md:text-sm">
                      {product.basePrice.toLocaleString() || 0} Gs.
                    </TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <img
                        alt={product.name}
                        src={product.photoUrl}
                        style={{
                          minWidth: "30px",
                          minHeight: "30px",
                          objectFit: "contain",
                        }}
                      ></img>
                    </TableCell>
                    <TableCell>
                      <p
                        onClick={() => {
                          navigate(`../../products/${product.id}`);
                        }}
                      >
                        ir
                      </p>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </TableCaption>
        </Table>
      </section>
    </div>
  );
}
