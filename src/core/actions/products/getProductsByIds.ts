import { BackendApi } from "@/core/api/api";
import {
  Product,
  ProductResponse,
} from "@/infrastructure/interfaces/products.interface";

export const getProductsByIdsAction = async (
  ids: string[]
): Promise<Product[]> => {
  try {
    if (ids.length == 0) return [];
    const { data } = await BackendApi.post<ProductResponse>("/products/ids", {
      ids,
    });
    return data.products;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
