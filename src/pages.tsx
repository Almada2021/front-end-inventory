import { lazy } from "react";

export const RegisterPage = lazy(
  () => import("@/layouts/RegisterUser/RegisterUser")
);

export const LoginPage = lazy(() => import("@/layouts/LoginPage/LoginPage"));
