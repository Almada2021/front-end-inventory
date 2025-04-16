import { BackendApi } from "@/core/api/api";
import { ProductResponse } from "@/infrastructure/interfaces/products.interface";

 export const searchProductsAction = async (query: string) => {
    try {
      if(query.length <= 0) {
        return;
      }
      const products = await BackendApi.get<ProductResponse>(
        "/products/search",
        {
          params: {
            query,
          },
        }
      );
      return products.data.products;
    } catch (error) {
      console.log(error);
    }
  };