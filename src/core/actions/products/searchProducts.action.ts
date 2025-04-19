import { Product } from "@/infrastructure/interfaces/products.interface";
import { BackendApi } from "@/core/api/api";

export const searchProductsAction = async (
  query: string
): Promise<Product[]> => {
  try {
    const response = await BackendApi.get(`/products/search?q=${query}`);
    return response.data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};
