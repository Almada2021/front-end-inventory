import { getTillByStoreId } from "@/core/actions/tills/getTillByStoreId";
import { useQuery } from "@tanstack/react-query";

export default function useTills(id: string) {
  const tillsByStoreQuery = useQuery({
    queryKey: ["till", "store", id],
    queryFn: () => getTillByStoreId(id),
    staleTime: 1000 * 60 * 10,
  });
  return {
    tillsByStoreQuery,
  };
}
