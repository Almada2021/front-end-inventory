import ComboBox from "@/components/ComboBox/ComboBox";
import { Button } from "@/components/ui/button";
import useProducts from "@/hooks/products/useProducts";
import useSearchProducts from "@/hooks/products/useSearchProducts";
import LoadingScreen from "@/layouts/Loading/LoadingScreen";
import { useState } from "react";
type Mode = "count" | "sum" | "reset";
export default function CountProduct() {
  const { productsQuery } = useProducts({ page: 1, limit: 10 });
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<Mode>("count");
  const { searchProductsQuery } = useSearchProducts(search);
  if (
    productsQuery.isFetching ||
    productsQuery.isLoading ||
    !productsQuery.data
  ) {
    return (
      <div className="w-full h-screen flex justify-center px-10">
        <LoadingScreen />
      </div>
    );
  }

  const products =
    productsQuery.data.map((product) => ({
      value: `${product.name}-${product.id}`,
      label: product.name,
      img: product.photoUrl,
    })) || [];
  const searchedProducts = searchProductsQuery.data || [];
  const searchedProductsOptions =
    searchedProducts.map((product) => ({
      value: `${product.name}-${product.id}`,
      label: product.name,
      img: product.photoUrl,
    })) || [];
  return (
    <div className="w-full flex-col mt-12 md:mt-6 justify-center px-10">
      <div className="flex-col justify-between items-center">
        <h1 className="text-2xl font-bold">
          Contar y Identificar haz click en donde dice Buscar producto para
          encontrar el producto que deseas Contar
        </h1>
        <ComboBox
          options={[...searchedProductsOptions, ...products]}
          placeholder="Buscar producto"
          searchFn={(value) => {
            setSearch(value);
          }}
        />
      </div>
      {/* Modos de Conteo Suma Cuenta Total y Verificar */}
      <div className="w-full px-4 md:px-0">
        {/* Botones para cambiar lo que hara la api debemos tener 3 uno que sea de verificar otro de sumar y otro de resetear */}
        <div className="flex gap-4 mt-4">
          <Button
            variant={mode === "count" ? "default" : "outline"}
            onClick={() => setMode("count")}
          >
            Contar
          </Button>
          <Button
            variant={mode === "sum" ? "default" : "outline"}
            onClick={() => setMode("sum")}
          >
            Sumar
          </Button>
          <Button
            variant={mode === "reset" ? "default" : "outline"}
            onClick={() => setMode("reset")}
          >
            Resetear Stock con las fotos
          </Button>
        </div>
        <div className="w-full">
          {/* Componente para cargar varias fotos  que muestra su preview y sigue la estetica de la app ademas de tener un boton de agregar mas las fotos se muestran en un grid de 3 columnas en pc mobil 1 columna  */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <input type="file" multiple />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
