import { BackendApi } from "@/core/api/api";

export const addMoney = async (data: {
  billsToAdd: { [key: string]: number };
  amount: number;
  tillId: string;
  method: "cash";
  user: string;
}) => {
  try {
    const response = await BackendApi.post("/till/add-money", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
