import { lazy } from "react";

export const RegisterPage = lazy(
  () => import("@/layouts/RegisterUser/RegisterUser")
);

export const LoginPage = lazy(() => import("@/layouts/LoginPage/LoginPage"));

// Logged Routes
export const HomeScreen = lazy(() => import("@/layouts/Home/HomeScreen"));

//* Ai
export const AiScreen = lazy(() => import("@/layouts/AI/AiScreen"));
export const LoadProduct = lazy(
  () => import("@/layouts/AI/LoadProduct/LoadProduct")
);
//* POS
export const POSPage = lazy(() => import("@/layouts/Checkout/POSPage"));

export const CheckoutScreen = lazy(
  () => import("@/layouts/Checkout/CheckoutScreen")
);

// * Employee
export const EmployeeScreen = lazy(
  () => import("@/layouts/EmployeePage/EmployeePage")
);

export const NewEmployee = lazy(() => import("@/layouts/EmployeePage/NewEmployee/NewEmployee"));
// * Suppliers
export const SuppliersScreen = lazy(
  () => import("@/layouts/Suppliers/SuppliersPage")
);

export const NewSupplier = lazy(
  () => import("@/layouts/Suppliers/NewSupplier/NewSupplier")
);

export const ShowSupplier = lazy(
  () => import("@/layouts/Suppliers/ShowSuppliers/ShowSupplier")
);

export const SupplierInfo = lazy(
  () => import("@/layouts/Suppliers/SupplierInfo/SupplierInfo")
);

// * Products
export const ShowProducts = lazy(
  () => import("@/layouts/ProductsPage/ShowProducts/ShowProducts")
);

export const ProductsScreen = lazy(
  () => import("@/layouts/ProductsPage/ProductsPage")
);

export const NewProduct = lazy(
  () => import("@/layouts/ProductsPage/NewProduct/NewProduct")
);

export const ProductInfo = lazy(
  () => import("@/layouts/ProductsPage/ProductInfo/ProductInfo")
);

// * Stores

export const StoresAndBill = lazy(
  () => import("@/layouts/Stores/StoresAndBills")
);

export const NewStore = lazy(
  () => import("@/layouts/Stores/NewStores/NewStores")
);

export const ShowStores = lazy(
  () => import("@/layouts/Stores/ShowStores/ShowStores")
);

export const StoreById = lazy(() => import("@/layouts/Stores/[id]/StoreById"));

// * Till

export const NewTill = lazy(() => import("@/layouts/Till/NewTill/NewTilll"));

export const TillById = lazy(() => import("@/layouts/Till/[id]/TillById"));

// * Clients

export const ClientPage = lazy(() => import("@/layouts/Client/ClientPage"));

export const NewClient = lazy(
  () => import("@/layouts/Client/NewClient/NewClient")
);
export const ShowClient = lazy(
  () => import("@/layouts/Client/ShowClient/ShowClient")
);

// * Sales

export const SalesPage = lazy(() => import("@/layouts/Sales/SalesPage"));
