import { getOrderPendingAmountAction } from "@/core/actions/orders/getOrdersPendingAmount.action";
import { useQuery } from "@tanstack/react-query";

export default function useOrderPendingAmount(id: string) {
  const orderPendingQuery = useQuery({
    queryFn: () => getOrderPendingAmountAction(id),
    queryKey: ["pending-orders", id],
  });
  return {
    orderPendingQuery,
  };
}
