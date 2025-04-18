import { useQuery } from "@tanstack/react-query";
import { getTillOpensCloseHistory } from "@/core/actions/tills/getTillOpensCloseHistory";
import { TillOpensCloseFilters } from "@/infrastructure/interfaces/till-opens-close.interface";

export default function useTillOpensCloseHistory(
  tillId: string,
  filters?: TillOpensCloseFilters
) {
  const tillOpensCloseHistoryQuery = useQuery({
    queryKey: ["tillOpensCloseHistory", tillId, filters],
    queryFn: () => getTillOpensCloseHistory(tillId, filters),
    enabled: !!tillId,
  });

  return {
    tillOpensCloseHistoryQuery,
  };
}
