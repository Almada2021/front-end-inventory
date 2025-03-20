import ProductCard from "@/components/Cards/Product/ProductCard";
import PaginationButtons from "@/components/PaginationButtons/PaginationButtons";
import SearchBar from "@/components/SearchBar/SearchBar";
import useProducts from "@/hooks/products/useProducts";
import { Product } from "@/infrastructure/interfaces/products.interface";
import { useState } from "react";

export default function ShowProducts() {
  const [page, setPage] = useState(1);
  const { productsQuery } = useProducts({ page, limit: 40 });
  return (
    <div className="mt-20 sm:mt-0 min-h-[100dvh] w-full p-4 flex flex-col">
      <SearchBar<unknown>
        mutateFunction={async () => {
          throw "";
        }}
        placeholder="Buscar Productos por nombre o codigo o REF"
      />
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 
      gap-4 w-full flex-1 auto-rows-fr"
      >
        {productsQuery.data?.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="h-24 flex items-center justify-center border-t">
        <PaginationButtons
          handlePageChange={(number) => setPage(number)}
          currentPage={page}
          totalPages={1}
        />
      </div>
    </div>
  );
}
