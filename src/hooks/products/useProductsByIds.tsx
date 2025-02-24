import { getProductsByIdsAction } from "@/core/actions/products/getProductsByIds";
import { useQuery } from "@tanstack/react-query";

export default function useProductsByIds(ids: string[]) {
  const getProductsByIds = useQuery({
    queryKey: ["producst", "ids", ids.join("-")],
    queryFn: async () => await getProductsByIdsAction(ids),
  });
  return {
    getProductsByIds,
  };
}
