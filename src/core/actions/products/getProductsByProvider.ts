import { BackendApi } from "@/core/api/api";
import {
  Product,
  ProductResponse,
} from "@/infrastructure/interfaces/products.interface";

export const getProductsByProviderAction = async ({
  providerId,
}: {
  providerId: string;
}): Promise<Product[]> => {
  try {
    const { data } = await BackendApi.get<ProductResponse>(
      `/products/provider/${providerId}`
    );
    return data.products;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
