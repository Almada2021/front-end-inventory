import { lazy } from "react";

export const RegisterPage = lazy(
  () => import("@/layouts/RegisterUser/RegisterUser")
);

export const LoginPage = lazy(() => import("@/layouts/LoginPage/LoginPage"));

// Logged Routes
export const HomeScreen = lazy(() => import("@/layouts/Home/HomeScreen"));

export const AiScreen = lazy(() => import("@/layouts/AI/AiScreen"));

export const CheckoutScreen = lazy(
  () => import("@/layouts/Checkout/CheckoutScreen")
);

export const ProductsScreen = lazy(
  () => import("@/layouts/ProductsPage/ProductsPage")
);

export const NewProduct = lazy(
  () => import("@/layouts/ProductsPage/NewProduct/NewProduct")
);

export const EmployeeScreen = lazy(
  () => import("@/layouts/EmployeePage/EmployeePage")
);

export const SuppliersScreen = lazy(
  () => import("@/layouts/Suppliers/SuppliersPage")
);

export const ShowSupplier = lazy(
  () => import("@/layouts/Suppliers/ShowSuppliers/ShowSupplier")
);

export const SupplierInfp = lazy(
  () => import("@/layouts/Suppliers/SupplierInfo/SupplierInfo")
);
