import { searchProductsAction } from "@/core/actions/products/searchProducts.action";
import { useQuery } from "@tanstack/react-query";

export default function useSearchProducts(query: string) {
  const searchProductsQuery = useQuery({
    queryKey: ["searchProducts", query],
    queryFn: () => searchProductsAction(query),
    enabled: !!query && query.length >= 2,
  });
  return {
    searchProductsQuery,
  };
}
