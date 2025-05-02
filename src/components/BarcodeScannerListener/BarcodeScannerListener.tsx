import { useEffect } from "react";
import onScan from "onscan.js";
import { Product } from "@/infrastructure/interfaces/products.interface";

interface BarcodeScannerListenerProps {
  mode: string;
  disabledScan: boolean;
  searchProductsByBarcode: (code: string) => Promise<Product[]>;
  pushCart: (product: Product, qty: number) => void;
  setProducts: (items: Product[]) => void;
  toast: (opts: { [key: string]: unknown }) => void;
}

export default function BarcodeScannerListener({
  mode,
  disabledScan,
  searchProductsByBarcode,
  pushCart,
  setProducts,
  toast,
}: BarcodeScannerListenerProps) {
  useEffect(() => {
    if (mode !== "products" || disabledScan) return;

    // Inicializar onscan.js sobre todo el documento
    const options = {
      suffixKeyCodes: [13], // Enter al final del escaneo
      timeBeforeScanTest: 2, // ms entre chars para considerar mismo scan
      avgTimeByChar: 20, // velocidad promedio esperada por char
      minLength: 3, // longitud mínima de código
      onScan: async (scannedCode: string) => {
        console.log("Código detectado por onscan.js:", scannedCode);

        // Validar código no vacío
        if (!scannedCode.trim()) {
          console.log("Código vacío, ignorando");
          return;
        }

        try {
          const results = await searchProductsByBarcode(scannedCode);
          console.log("Resultados de búsqueda:", results);

          if (results.length === 1) {
            pushCart(results[0], 1);
            toast({
              title: "Producto añadido",
              description: `${results[0].name} ha sido añadido al carrito`,
              variant: "default",
            });
          } else if (results.length > 1) {
            setProducts(results);
            toast({
              title: "Múltiples productos encontrados",
              description: `Se encontraron ${results.length} productos con el código ${scannedCode}`,
              variant: "default",
            });
          } else {
            toast({
              title: "Producto no encontrado",
              description: `No se encontró ningún producto con el código ${scannedCode}`,
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error al buscar producto:", error);
          toast({
            title: "Error de búsqueda",
            description: "No se pudo buscar el producto escaneado",
            variant: "destructive",
          });
        }
      },
    };

    onScan.attachTo(document, options);

    // Cleanup al desmontar
    return () => {
      onScan.detachFrom(document);
    };
  }, [
    mode,
    disabledScan,
    searchProductsByBarcode,
    pushCart,
    setProducts,
    toast,
  ]);

  return null; // Este componente no renderiza nada
}
