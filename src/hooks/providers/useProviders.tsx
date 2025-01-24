import { STALE_24 } from "@/constants/time/time";
import { getProvidersAction } from "@/core/actions/providers/getProviders.action";
import { useQuery } from "@tanstack/react-query";

export default function useProviders() {
  const providersQuery = useQuery({
    queryKey: ["providers", "all"],
    queryFn: getProvidersAction,
    staleTime: STALE_24,
  });

  return {
    providersQuery,
  };
}
