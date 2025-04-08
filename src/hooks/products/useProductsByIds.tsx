import { STALE_24 } from "@/constants/time/time";
import { getProductsByIdsAction } from "@/core/actions/products/getProductsByIds";
import { useQuery } from "@tanstack/react-query";

export default function useProductsByIds(ids: string[]) {
  const getProductsByIds = useQuery({
    queryKey: ["products", "ids", ids.join("-")],
    queryFn: async () => await getProductsByIdsAction(ids),
    staleTime: STALE_24,
    enabled: ids.length > 0,
  });
  return {
    getProductsByIds,
  };
}
