import { getAllProductsAction } from "@/core/actions/products/getAllProducts.action";
import { FilterOptionsRequest } from "@/infrastructure/interfaces/shared/filter.interface";
import { useQuery } from "@tanstack/react-query";

export default function useProducts({ page, limit }: FilterOptionsRequest) {
  const productsQuery = useQuery({
    queryKey: ["products", page, limit],
    queryFn: () => getAllProductsAction({ page, limit }),
    staleTime: 1000 * 60 * 5,
  });
  return {
    productsQuery,
  };
}
