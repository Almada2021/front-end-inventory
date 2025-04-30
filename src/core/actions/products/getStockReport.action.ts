import { BackendApi } from "@/core/api/api";

export const getStockReportAction = async () => {
  try {
    const response = await BackendApi.get("/products/stock-report");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
