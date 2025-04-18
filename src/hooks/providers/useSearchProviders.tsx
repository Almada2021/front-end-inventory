import { searchProviderAction } from "@/core/actions/providers/searchProvider.action";
import { useQuery } from "@tanstack/react-query";

export default function useSearchProviders(query: string) {
  const searchProvidersQuery = useQuery({
    queryKey: ["providers", "search", query],
    queryFn: () => searchProviderAction(query),
    enabled: !!query && query.length >= 1,
  });
  return {
    searchProvidersQuery,
  };
}
