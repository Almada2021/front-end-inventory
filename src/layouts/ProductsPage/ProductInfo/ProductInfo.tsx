import ProductsForm from "@/components/forms/products-form";
import Image from "@/components/Image/Image";
import { Button } from "@/components/ui/button";
import useProductsByIds from "@/hooks/products/useProductsByIds";
import {
  BoxIcon,
  PackageIcon,
  DollarSignIcon,
  TagIcon,
  UsersIcon,
  Pencil,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import ProviderList from "./ProvidersItem/ProviderList";
import ProductChanges from "./ProductChanges/ProductChanges";
import ProductSales from "./ProductSales/ProductSales";
import { useAdmin } from "@/hooks/browser/useAdmin";
import LoadingScreen from "@/layouts/Loading/LoadingScreen";
import toast from "react-hot-toast";
import { BackendApi } from "@/core/api/api";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";

export default function ProductInfo() {
  const { id } = useParams();
  const { getProductsByIds } = useProductsByIds([id!]);
  const [loadProducts, setLoadProducts] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [mode, setMode] = useState<"changes" | "sales">("changes");
  const isAdmin = useAdmin();
  const navigate = useNavigate();
  if (getProductsByIds.isLoading) return null;
  if (!getProductsByIds.data?.[0]) return <div>Producto no encontrado</div>;

  const product = getProductsByIds.data[0];
  if (getProductsByIds.isFetching) {
    return (
      <div className="flex min-h-svh w-full flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <LoadingScreen />
      </div>
    );
  }
  if (editMode) {
    // Convert getProductsByIds.data[0].photoUrl as File is url fetch and convert
    return (
      <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
        <ProductsForm
          editMode={editMode}
          resolveEditFn={() => {
            setEditMode(false);
            getProductsByIds.refetch();
          }}
          values={{
            id: getProductsByIds.data[0].id,
            name: getProductsByIds.data[0].name,
            price: getProductsByIds.data[0].price,
            basePrice: getProductsByIds.data[0].basePrice,
            image: getProductsByIds.data[0].photoUrl,
            stock: getProductsByIds.data[0].stock,
            providers: getProductsByIds.data[0].providers,
            uncounted: getProductsByIds.data[0].uncounted,
            barCode: Number(getProductsByIds.data[0].barCode),
            rfef: getProductsByIds.data[0].rfef,
            sellByWeight: getProductsByIds.data[0].sellByWeight || false,
            weightUnit: getProductsByIds.data[0].weightUnit || "",
          }}
        />
      </div>
    );
  }
  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Encabezado */}
        <div className="bg-primary/10 p-6 border-b border-gray-200 flex  items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 w-11/12">
            {product.name}
          </h1>
          <button
            onClick={() => {
              setEditMode(true);
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors justify-self-end flex justify-center items-center"
            aria-label="Editar cliente"
          >
            <Pencil className="h-6 w-6 text-gray-600" />
          </button>
          {isAdmin && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors justify-self-end flex justify-center items-center"
                  aria-label="Eliminar producto"
                >
                  <Trash className="h-6 w-6 text-red-500" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Estás seguro de que deseas eliminar este producto? Esta
                    acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    <Button variant={"default"}>Cancelar</Button>
                  </AlertDialogCancel>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      try {
                        const response = await BackendApi.delete(
                          `/products/delete/${product.id}`
                        );
                        if (response.data) {
                          toast.success("Producto eliminado correctamente");
                          navigate(-1);
                          setTimeout(() => {
                            window.location.reload();
                          }, 2000);
                        }
                      } catch (error) {
                        toast.error(`Error al eliminar el producto ${error}`);
                      }
                    }}
                  >
                    Eliminar
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
          {/* Imagen */}
          <div className="relative h-96 rounded-xl overflow-hidden shadow-md">
            <Image
              className="object-contain w-full h-full bg-gray-50 p-4"
              src={product.photoUrl}
              alt={product.name}
            />
          </div>

          {/* Información */}
          <div className="space-y-6">
            {/* Estadísticas principales */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <InfoCard
                icon={<BoxIcon className="w-6 h-6" />}
                title="Stock"
                value={product.stock}
                color="bg-blue-100"
              />
              <InfoCard
                icon={<DollarSignIcon className="w-6 h-6" />}
                title="Precio"
                value={`${product.price.toLocaleString()} Gs`}
                color="bg-green-100"
              />
              <InfoCard
                icon={<TagIcon className="w-6 h-6" />}
                title="P. Base"
                value={`${product.basePrice.toLocaleString()} Gs`}
                color="bg-purple-100"
              />
            </div>

            {/* Detalles adicionales */}
            <div className="space-y-4">
              <DetailItem
                title="Proveedores"
                value={<ProviderList ids={product.providers} />}
                icon={<UsersIcon className="w-5 h-5" />}
              />
              <DetailItem
                title="No contabilizado"
                value={product.uncounted ? "Sí" : "No"}
                icon={<PackageIcon className="w-5 h-5" />}
              />
              {product.sellByWeight && (
                <DetailItem
                  title="Venta por peso"
                  value={`Sí (${product.weightUnit})`}
                  icon={<PackageIcon className="w-5 h-5" />}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-4 flex justify-center gap-2 mb-10 md:mb-2">
        <Button
          onClick={() => {
            setMode("sales");
            setLoadProducts(true);
          }}
        >
          Cargar Historial Ventas
        </Button>
        <Button
          onClick={() => {
            setMode("changes");
            setLoadProducts(true);
          }}
        >
          Historial de Cambios
        </Button>
      </div>
      {mode == "changes" && (
        <>
          <ProductChanges id={getProductsByIds.data[0].id} />
        </>
      )}
      {mode == "sales" && loadProducts && (
        <ProductSales id={getProductsByIds.data[0].id} />
      )}
    </div>
  );
}

// Componente auxiliar para tarjetas de información
const InfoCard = ({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
}) => (
  <div className={`${color} p-4 rounded-lg transition-all hover:shadow-md`}>
    <div className="flex items-center gap-2 mb-2">
      <div className="p-2 bg-white rounded-full shadow-sm">{icon}</div>
      <span className="font-semibold text-gray-600">{title}</span>
    </div>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

// Componente auxiliar para detalles
const DetailItem = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | React.ReactNode;
  icon: React.ReactNode;
}) => (
  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
    <div className="p-2 bg-white rounded-full shadow-sm">{icon}</div>
    <div>
      <h4 className="font-semibold text-gray-600 mb-1">{title}</h4>
      <p className="text-gray-700">{value}</p>
    </div>
  </div>
);
