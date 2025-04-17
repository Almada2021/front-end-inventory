import { useQuery } from "@tanstack/react-query";
import { getTransfertHistoryByTillIdAction } from "@/core/actions/transfertHistory/getTransfertHistoryByTillId.action";

interface Filters {
  page: number;
  limit: number;
}
export default function useTransfertHistory(id: string, filters: Filters) {
  const transfertHistoryQuery = useQuery({
    queryKey: ["transfert-history", id, filters.page, filters.limit],
    queryFn: () => getTransfertHistoryByTillIdAction(id, filters),
    enabled: !!id && id.length > 0,
  });
  return { transfertHistoryQuery };
}
