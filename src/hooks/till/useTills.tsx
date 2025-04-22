import { getTillByStoreId } from "@/core/actions/tills/getTillByStoreId";
import { TillFilters } from "@/infrastructure/interfaces/till.interface";
import { useQuery } from "@tanstack/react-query";
import { useAdmin } from "../browser/useAdmin";

export default function useTills(id: string, filters?: TillFilters) {
  const isAdmin = useAdmin();
  const tillsByStoreQuery = useQuery({
    queryKey: ["till", "store", id],
    queryFn: () => getTillByStoreId(id, filters, isAdmin),
  });
  return {
    tillsByStoreQuery,
  };
}
