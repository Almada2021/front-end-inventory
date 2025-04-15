import { BackendApi } from "@/core/api/api";
import { StockOptimizationResponse } from "@/infrastructure/interfaces/ai/stock-optimization.interface";

export const stockOptimizationAction = async ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  try {
    const aiRes = await BackendApi.get<StockOptimizationResponse>("/ai/stock-optimization", {
      params: {
        startDate,
        endDate,
      },
    });
    return aiRes.data;
  } catch (error) {
    console.log(error);
  }
};
