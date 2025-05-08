import React, { useEffect } from "react";
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
  // Guardar el último código y tiempo
  const lastScanRef = React.useRef<{ code: string; time: number }>({
    code: "",
    time: 0,
  });
  const LOCK_MS = 500;

  useEffect(() => {
    if (mode !== "products" || disabledScan) return;

    const options = {
      suffixKeyCodes: [13],
      timeBeforeScanTest: 2,
      avgTimeByChar: 20,
      minLength: 3,
      onScan: async (scannedCode: string) => {
        const now = Date.now();
        // Si el código es igual y fue hace menos de LOCK_MS, ignorar
        if (
          lastScanRef.current.code === scannedCode.trim() &&
          now - lastScanRef.current.time < LOCK_MS
        ) {
          console.log("Escaneo ignorado (doble):", scannedCode);
          return;
        }
        lastScanRef.current = { code: scannedCode.trim(), time: now };

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

  return null;
}
