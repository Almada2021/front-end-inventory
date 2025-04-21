import { BackendApi } from "@/core/api/api";

export const getOrderPendingAmountAction = async (id: string) => {
  try {
    const orders = await BackendApi.get<{ total: number }>(
      `/order/pending-orders/${id}`
    );
    return orders.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
