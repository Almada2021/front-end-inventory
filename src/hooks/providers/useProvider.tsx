import { getProviderByIdAction } from "@/core/actions/providers/getProviderById";
import { useQuery } from "@tanstack/react-query";

export default function useProvider(id: string) {
  const getProviderById = useQuery({
    queryFn: () => getProviderByIdAction(id),
    queryKey: ["providers", id],
  });
  return {
    getProviderById,
  };
}
