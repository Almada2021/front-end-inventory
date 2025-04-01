import { getTillByStoreId } from "@/core/actions/tills/getTillByStoreId";
import { TillFilters } from "@/infrastructure/interfaces/till.interface";
import { useQuery } from "@tanstack/react-query";

export default function useTills(id: string, filters? : TillFilters) {
  const tillsByStoreQuery = useQuery({
    queryKey: ["till", "store", id],
    queryFn: () => getTillByStoreId(id, filters),
  });
  return {
    tillsByStoreQuery,
  };
}
