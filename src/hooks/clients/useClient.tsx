import { getClientAction } from "@/core/actions/clients/getClient.action";
import { useQuery } from "@tanstack/react-query";

export default function useClient(query?: string, limit?: number) {

  const getClientQuery  = useQuery({
    queryFn: () => getClientAction(query, limit),
    queryKey: ["client", query, limit],
    staleTime: 60 * 60 * 5,
  });
  return { getClientQuery };
}
