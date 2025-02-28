import { getTillById } from "@/core/actions/tills/getTillById";
import { useQuery } from "@tanstack/react-query";

export default function useTillById(id: string) {
  const tillsByIdQuery = useQuery({
    queryKey: ["till", "show", id],
    queryFn: () => getTillById(id),
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60,
  });
  return {
    tillsByIdQuery,
  };
}
