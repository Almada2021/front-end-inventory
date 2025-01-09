import { lazy } from "react";

export const RegisterPage = lazy(
  () => import("@/layouts/RegisterUser/RegisterUser")
);
