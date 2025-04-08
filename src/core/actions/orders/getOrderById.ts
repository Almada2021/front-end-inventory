import { BackendApi } from "@/core/api/api";
import { SingeOrderRes } from "@/infrastructure/interfaces/order/order.interface";

export const getOrderByIdAction = async (id: string) => {
  try {
    const orders = await BackendApi.get<SingeOrderRes>(`/order/id/${id}`);
    return orders.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
