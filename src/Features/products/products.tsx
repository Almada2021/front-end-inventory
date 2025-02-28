//! NOT READY YET
import { lazy } from "react";
import { RouteObject } from "react-router";

const ProductsScreen = lazy(
  () => import("@/layouts/ProductsPage/ShowProducts/ShowProducts")
);
const NewProduct = lazy(
  () => import("@/layouts/ProductsPage/NewProduct/NewProduct")
);
const ProductInfo = lazy(
  () => import("@/layouts/ProductsPage/ProductInfo/ProductInfo")
);

export const productRoutes: RouteObject[] = [
  {
    path: "products",
    children: [
      { index: true, element: <ProductsScreen /> },
      { path: "new", element: <NewProduct /> },
      { path: ":id", element: <ProductInfo /> },
    ],
  },
];
