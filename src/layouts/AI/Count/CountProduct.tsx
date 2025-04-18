import ComboBox from "@/components/ComboBox/ComboBox";
import { Button } from "@/components/ui/button";
import useProducts from "@/hooks/products/useProducts";
import useSearchProducts from "@/hooks/products/useSearchProducts";
import LoadingScreen from "@/layouts/Loading/LoadingScreen";
import { useState } from "react";
import MultiImgUploader from "@/components/forms/MultiImgUploader/MultiImgUploader";
import { BackendApi } from "@/core/api/api";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";

type Mode = "count" | "sum" | "reset";

interface CountResult {
  success: boolean;
  productName: string;
  currentStock: number;
  newStock: number;
  count: number;
  stockChange: number;
  matchesCurrentStock: boolean | null;
  explanation: string;
}

export default function CountProduct() {
  const { productsQuery } = useProducts({ page: 1, limit: 10 });
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<Mode>("sum");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [result, setResult] = useState<CountResult | null>(null);
  const { searchProductsQuery } = useSearchProducts(search);

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!selectedProduct || images.length === 0) {
        // Show validation message
        return;
      }

      const formData = new FormData();
      images.forEach((file) => {
        formData.append(`images`, file);
      });
      formData.append("productId", selectedProduct.split("-")[1]);
      formData.append("mode", mode);
      const response = await BackendApi.post("/ai/count-product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      setResult(data);
    },
  });

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
      label:
        product.name.length > 40
          ? product.name.substring(0, 40) + "..."
          : product.name,
      img: product.photoUrl,
    })) || [];
  const searchedProducts = searchProductsQuery.data || [];
  const searchedProductsOptions =
    searchedProducts.map((product) => ({
      value: `${product.name}-${product.id}`,
      label:
        product.name.length > 40
          ? product.name.substring(0, 40) + "..."
          : product.name,
      img: product.photoUrl,
    })) || [];

  const handleProductSelect = (value: string) => {
    setSelectedProduct(value);
  };

  const handleImagesChange = (files: File[]) => {
    setImages(files);
    // Create preview URLs for the files
    const urls = files.map((file) => URL.createObjectURL(file));
    setImageUrls(urls);
  };

  const handleSubmit = async () => {
    await submitMutation.mutate();
  };

  const handleRestart = () => {
    setSelectedProduct(null);
    setImages([]);
    setImageUrls([]);
    setResult(null);
    // Clean up object URLs to prevent memory leaks
    imageUrls.forEach((url) => URL.revokeObjectURL(url));
  };

  return (
    <div className="w-full flex-col mt-12 md:mt-6 justify-center px-10">
      <div className="flex-col justify-between items-center">
        <h1 className="text-2xl font-bold mb-2">
          Clickea en el boton de Buscar producto para encontrar el producto que
          deseas Contar
        </h1>
        <ComboBox
          options={[...searchedProductsOptions, ...products]}
          placeholder="Buscar producto"
          searchFn={(value) => {
            setSearch(value);
          }}
          onChange={handleProductSelect}
        />
      </div>
      {/* Modos de Conteo Suma Cuenta Total y Verificar */}
      <div className="w-full px-4 md:px-0">
        {/* Botones para cambiar lo que hara la api debemos tener 3 uno que sea de verificar otro de sumar y otro de resetear */}
        <div className="flex flex-wrap gap-4 mt-4">
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
        <div className="w-full flex-col items-center justify-center mt-6">
          {/* Using our new MultiImgUploader component */}
          {!submitMutation.isPending && !result && (
            <MultiImgUploader
              onChange={handleImagesChange}
              maxImages={10}
              validation={selectedProduct === null}
              validationMessage={
                selectedProduct === null
                  ? "Por favor selecciona un producto primero"
                  : ""
              }
            />
          )}

          {submitMutation.isPending && (
            <div className="w-full flex flex-col items-center justify-center py-8">
              <LoadingScreen />
              <p className="mt-4 text-lg font-medium">Procesando imágenes...</p>
            </div>
          )}

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="w-full mt-6"
              >
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-500" />
                      )}
                      Resultado del conteo
                    </CardTitle>
                    <CardDescription>{result.productName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Stock actual:</p>
                        <p className="text-2xl font-bold">
                          {result.currentStock}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Nuevo stock:</p>
                        <p className="text-2xl font-bold">{result.newStock}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">
                          Productos contados:
                        </p>
                        <p className="text-2xl font-bold">{result.count}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Cambio en stock:</p>
                        <p
                          className={`text-2xl font-bold ${
                            result.stockChange > 0
                              ? "text-green-500"
                              : result.stockChange < 0
                              ? "text-red-500"
                              : ""
                          }`}
                        >
                          {result.stockChange > 0 ? "+" : ""}
                          {result.stockChange}
                        </p>
                      </div>
                    </div>

                    {result.matchesCurrentStock !== null && (
                      <div className="mt-4 p-4 rounded-md bg-gray-50 dark:bg-gray-800">
                        <p className="text-sm font-medium mb-2">
                          Verificación de stock:
                        </p>
                        <p
                          className={`font-bold ${
                            result.matchesCurrentStock
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {result.matchesCurrentStock
                            ? "El conteo coincide con el stock actual"
                            : "El conteo NO coincide con el stock actual"}
                        </p>
                      </div>
                    )}

                    <div className="mt-4 p-4 rounded-md bg-gray-50 dark:bg-gray-800">
                      <p className="text-sm font-medium mb-2">Explicación:</p>
                      <p>{result.explanation}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={handleRestart}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Volver a empezar
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {!submitMutation.isPending && !result && (
            <div className="mt-6 mb-6">
              <Button
                onClick={handleSubmit}
                disabled={!selectedProduct || images.length === 0}
                className="w-full md:w-auto"
              >
                {mode === "count" && "Contar Producto"}
                {mode === "sum" && "Sumar Producto"}
                {mode === "reset" && "Resetear Stock"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
