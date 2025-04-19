import { BackendApi } from "@/core/api/api";
import {
  Product,
  ProductResponse,
} from "@/infrastructure/interfaces/products.interface";
import { FilterOptionsRequest } from "@/infrastructure/interfaces/shared/filter.interface";

export const getAllProductsAction = async ({
  limit,
  page,
}: FilterOptionsRequest): Promise<Product[]> => {
  try {
    const { data } = await BackendApi.get<ProductResponse>("/products/all", {
      params: {
        limit,
        page,
      },
    });
    return data.products;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
