import { getTransfertHistoryByIdAction } from "@/core/actions/transfertHistory/getTransfertHistoryById.action";
import { useQuery } from "@tanstack/react-query";
export default function useTransfertHistoryById(id: string) {
  const getHistoryTransfertQuery = useQuery({
    queryFn: () => getTransfertHistoryByIdAction(id),
    queryKey: ["transfert-history", id],
  });
  return { getHistoryTransfertQuery };
}
