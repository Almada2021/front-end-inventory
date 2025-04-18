import { BackendApi } from "@/core/api/api";

export const withdrawMoney = async (data: {
  billsToWithdraw: { [key: string]: number };
  amount: number;
  tillId: string;
  method: "cash" | "card" | "transfer" | "draw";
  user: string;
}) => {
  try {
    const response = await BackendApi.post("/till/withdraw-money", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
