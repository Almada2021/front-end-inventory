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
