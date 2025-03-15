import { ReactElement, memo } from "react";
import { Product } from "@/infrastructure/interfaces/products.interface";
import ProductCard from "../Cards/Product/ProductCard";

interface PaginatedProductGridProps {
  products: Product[];
  currentPage: number;
  itemsPerPage: number;
  pushCart: (product: Product, quantity: number) => void;
  onPageChange: (newPage: number) => void;
}

const PaginatedProductGrid = memo(
  ({
    products,
    currentPage,
    itemsPerPage,
    pushCart,
    onPageChange,
  }: PaginatedProductGridProps): ReactElement => {
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = products.slice(startIndex, endIndex);

    return (
      <div className="mt-[20vh] h-full flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 flex-1 px-4">
          {currentProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="checkout"
              onClick={() => pushCart(product, 1)}
            />
          ))}
        </div>

        {/* Controles de paginación */}
        <div className="flex justify-center items-center gap-4 p-4 border-t">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Anterior
          </button>

          <span className="text-sm">
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    );
  }
);

export default PaginatedProductGrid;
