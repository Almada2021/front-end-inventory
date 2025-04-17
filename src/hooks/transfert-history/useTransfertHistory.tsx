import { useQuery } from "@tanstack/react-query";
import { getTransfertHistoryByTillIdAction } from "@/core/actions/transfertHistory/getTransfertHistoryByTillId.action";

interface Filters {
  page: number;
  limit: number;
}
export default function useTransfertHistory(id: string, filters: Filters) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["transfert-history", id],
    queryFn: () => getTransfertHistoryByTillIdAction(id, filters),
    enabled: !!id && id.length > 0,
  });
  return { data, isLoading, error };
}
