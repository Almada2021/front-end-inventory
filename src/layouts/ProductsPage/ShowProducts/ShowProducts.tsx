import ProductCard from "@/components/Cards/Product/ProductCard";
import useProducts from "@/hooks/products/useProducts";
import { Product } from "@/infrastructure/interfaces/products.interface";

export default function ShowProducts() {
  const { productsQuery } = useProducts({ page: 1, limit: 40 });
  return (
    <div className="mt-20 sm:mt-0 min-h-[100dvh] w-full p-4 flex flex-col">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 
      gap-4 w-full flex-1 auto-rows-fr"
      >
        {productsQuery.data?.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="h-24 flex items-center justify-center border-t">
        {/* Tu paginación o controles adicionales */}
      </div>
    </div>
  );
}
