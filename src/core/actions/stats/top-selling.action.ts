import { BackendApi } from "@/core/api/api";
import {
  Datum,
  TopSellingResponse,
} from "@/infrastructure/interfaces/stats/top-selling.interface";

export const getTopSellingProducts = async (): Promise<Datum[]> => {
  try {
    const topSellingProducts = await BackendApi.get<TopSellingResponse>(
      "/inventory-stats/top-selling"
    );
    if (!topSellingProducts.data.data){
        throw "Not Found";
    } 
    return topSellingProducts.data.data;
  } catch (error) {
    window.location.reload();
    console.log(error);
    throw error;
  }
};
