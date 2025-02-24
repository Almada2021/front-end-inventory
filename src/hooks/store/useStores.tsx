import { STALE_24 } from "@/constants/time/time";
import { getStoresAction } from "@/core/actions/store/getStoresActions";
import { useQuery } from "@tanstack/react-query";

interface Options {
  page: number;
  limit: number;
}
export function useStores({ page, limit }: Options = { page: 1, limit: 200 }) {
  const storesQuery = useQuery({
    queryKey: ["stores", "all", page],
    queryFn: () => getStoresAction({ page, limit }),
    staleTime: STALE_24,
  });

  return {
    storesQuery,
  };
}
