import { STALE_24 } from "@/constants/time/time";
import { getProvidersAction } from "@/core/actions/providers/getProviders.action";
import { useQuery } from "@tanstack/react-query";

interface Options {
  page: number;
  limit: number;
}
export function useProviders(
  { page, limit }: Options = { page: 1, limit: 12 }
) {
  const providersQuery = useQuery({
    queryKey: ["providers", "all", page],
    queryFn: () => getProvidersAction({ page, limit }),
    staleTime: STALE_24,
  });

  return {
    providersQuery,
  };
}
