import {
  Product,
  ProductResponse,
} from "@/infrastructure/interfaces/products.interface";
import { BackendApi } from "@/core/api/api";

export const searchProductsAction = async (
  query: string
): Promise<Product[]> => {
  try {
    if (query.length == 0) {
      return [];
    }
    const response = await BackendApi.get<ProductResponse>(`/products/search`, {
      params: {
        query,
      },
    });
    return response.data.products;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};
