import {
  ReactElement,
  memo,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { Product } from "@/infrastructure/interfaces/products.interface";
import ProductCard from "../Cards/Product/ProductCard";

interface PaginatedProductGridProps {
  products: Product[];
  pushCart: (product: Product, quantity: number) => void;
}

// Configuraciones predefinidas para diferentes tamaños de pantalla
const ITEMS_PER_PAGE_OPTIONS = {
  xs: { cols: 1, items: 4 }, // Móvil
  sm: { cols: 2, items: 6 }, // Tablets pequeñas
  md: { cols: 3, items: 9 }, // Tablets
  lg: { cols: 4, items: 12 }, // Portátiles
  xl: { cols: 5, items: 15 }, // Escritorio
};

const PaginatedProductGrid = memo(
  ({ products, pushCart }: PaginatedProductGridProps): ReactElement => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [layoutConfig, setLayoutConfig] = useState(ITEMS_PER_PAGE_OPTIONS.md);

    const determineLayout = useCallback(() => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;

      if (containerWidth >= 1280) {
        setLayoutConfig(ITEMS_PER_PAGE_OPTIONS.xl);
      } else if (containerWidth >= 1024) {
        setLayoutConfig(ITEMS_PER_PAGE_OPTIONS.lg);
      } else if (containerWidth >= 768) {
        setLayoutConfig(ITEMS_PER_PAGE_OPTIONS.md);
      } else if (containerWidth >= 640) {
        setLayoutConfig(ITEMS_PER_PAGE_OPTIONS.sm);
      } else {
        setLayoutConfig(ITEMS_PER_PAGE_OPTIONS.xs);
      }
    }, []);

    useEffect(() => {
      const handleResize = () => {
        determineLayout();
      };

      const resizeObserver = new ResizeObserver(handleResize);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
        determineLayout();
      }

      return () => resizeObserver.disconnect();
    }, [determineLayout]);

    // Validar la página actual cuando cambia el layout o los productos
    useEffect(() => {
      const totalPages = Math.ceil(products.length / layoutConfig.items);
      if (currentPage > totalPages) {
        setCurrentPage(Math.max(1, totalPages));
      }
    }, [layoutConfig, products.length, currentPage]);

    const totalPages = Math.ceil(products.length / layoutConfig.items);
    const startIndex = (currentPage - 1) * layoutConfig.items;
    const currentProducts = products.slice(
      startIndex,
      startIndex + layoutConfig.items
    );

    const handlePageChange = (newPage: number) => {
      if (newPage < 1 || newPage > totalPages) return;
      setCurrentPage(newPage);
      // Desplazar hacia arriba al cambiar de página
      containerRef.current?.scrollTo(0, 0);
    };

    return (
      <div ref={containerRef} className="flex flex-col h-[calc(100vh-150px)]">
        {/* Contenedor de productos con scroll */}
        <div className="flex-grow overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="checkout"
                onClick={() => pushCart(product, 1)}
              />
            ))}
          </div>
        </div>

        {/* Paginación fija en fondo */}
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t py-4 w-full mt-auto">
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
            >
              Anterior
            </button>

            <span className="text-sm font-medium">
              Página {currentPage} de {totalPages || 1}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default PaginatedProductGrid;