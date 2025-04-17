import {
  ReactElement,
  memo,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Product } from "@/infrastructure/interfaces/products.interface";
import ProductCard from "../Cards/Product/ProductCard";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Button } from "../ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useMediaQuery } from "usehooks-ts";

interface PaginatedProductGridProps {
  products: Product[];
  pushCart: (product: Product, quantity: number) => void;
}

// Configuraciones adaptativas para diferentes dispositivos
const PaginatedProductGrid = memo(
  ({ products, pushCart }: PaginatedProductGridProps): ReactElement => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery("(max-width: 768px)");
    const isSmallScreen = useMediaQuery("(max-width: 640px)");

    // Ajuste dinámico para tamaños por página
    const getDefaultItemsPerPage = useCallback(() => {
      if (isSmallScreen) return 10;
      if (isMobile) return 15;
      return 20;
    }, [isSmallScreen, isMobile]);

    const [itemsPerPage, setItemsPerPage] = useState(getDefaultItemsPerPage());
    const [currentPage, setCurrentPage] = useState(1);
    const [cols, setCols] = useState(isMobile ? 2 : 3);

    // Ajusta cols basado en ancho real del contenedor
    const updateColumns = useCallback(() => {
      if (!containerRef.current) return;

      const width = containerRef.current.clientWidth;

      if (width < 400) {
        setCols(1);
      } else if (width < 640) {
        setCols(2);
      } else if (width < 960) {
        setCols(3);
      } else if (width < 1280) {
        setCols(4);
      } else {
        setCols(5);
      }
    }, []);

    // Actualizar configuración en cambios de tamaño y al montar
    useEffect(() => {
      updateColumns();
      setItemsPerPage(getDefaultItemsPerPage());

      const resizeObserver = new ResizeObserver(() => {
        updateColumns();
      });

      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => resizeObserver.disconnect();
    }, [updateColumns, getDefaultItemsPerPage, isMobile, isSmallScreen]);

    const totalPages = Math.ceil(products.length / itemsPerPage);

    // Productos de la página actual
    const currentProducts = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, products.length);
      return products.slice(startIndex, endIndex);
    }, [products, currentPage, itemsPerPage]);

    // Resetear a la primera página si cambia el número total de productos
    useEffect(() => {
      setCurrentPage(1);
    }, [products.length, itemsPerPage]);

    // Altura de fila adaptativa según dispositivo
    const ROW_HEIGHT = isMobile ? 280 : 340;

    // Calcular el número de filas necesarias
    const rowCount = Math.ceil(currentProducts.length / cols);

    // Configuración del virtualizador con padding adicional
    const rowVirtualizer = useVirtualizer({
      count: rowCount,
      getScrollElement: () => containerRef.current,
      estimateSize: () => ROW_HEIGHT,
      overscan: 3, // Aumentamos el overscan para evitar problemas de renderizado
      paddingStart: 8,
      paddingEnd: 8,
    });

    // Función para obtener la clase de grid según el número de columnas
    const getGridColsClass = () => {
      switch (cols) {
        case 1:
          return "grid-cols-1";
        case 2:
          return "grid-cols-2";
        case 3:
          return "grid-cols-3";
        case 4:
          return "grid-cols-4";
        case 5:
          return "grid-cols-5";
        default:
          return "grid-cols-3";
      }
    };

    // Altura dinámica según dispositivo
    const getContainerHeight = () => {
      return "calc(100vh - 180px)"; // Ajustamos la altura para mostrar más contenido
    };

    return (
      <div className="flex w-full flex-col">
        {/* Controles de paginación adaptados */}
        <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 border-b bg-gray-50/80 px-2 py-2 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm text-gray-600 ${isMobile ? "hidden" : ""}`}
            >
              Mostrar:
            </span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger
                className={`${isMobile ? "w-16 h-7" : "w-20 h-8"}`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 15, 20, 50].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="text-sm text-gray-600">
              {products.length > 0
                ? `${Math.min(
                    products.length,
                    (currentPage - 1) * itemsPerPage + 1
                  )} - ${Math.min(
                    currentPage * itemsPerPage,
                    products.length
                  )} de ${products.length}`
                : "No hay productos"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="min-w-[4rem] text-center text-sm font-medium">
              {currentPage} / {totalPages || 1}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="h-8 w-8 p-0"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Grid de productos con virtualización optimizada */}
        <div
          ref={containerRef}
          className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300"
          style={{ height: getContainerHeight() }}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const startIndex = virtualRow.index * cols;
              const rowProducts = currentProducts.slice(
                startIndex,
                startIndex + cols
              );

              return (
                <div
                  key={virtualRow.index}
                  className={`absolute left-0 w-full px-2 py-1`}
                  style={{
                    top: `${virtualRow.start}px`,
                    height: `${virtualRow.size}px`,
                  }}
                >
                  <div className={`grid h-full ${getGridColsClass()} gap-3`}>
                    {rowProducts.map((product) => (
                      <div key={product.id} className="h-full">
                        <ProductCard
                          product={product}
                          variant="virtual"
                          onClick={() => pushCart(product, 1)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {products.length === 0 && (
          <div className="flex h-[200px] w-full items-center justify-center">
            <p className="text-gray-500">No se encontraron productos</p>
          </div>
        )}
      </div>
    );
  }
);

export default PaginatedProductGrid;
