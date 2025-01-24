import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import {
  RegisterPage,
  LoginPage,
  HomeScreen,
  AiScreen,
  CheckoutScreen,
  ProductsScreen,
  EmployeeScreen,
  SuppliersScreen,
} from "@/pages";
import AppSidebar from "./components/Sidebar/AppSidebar";
import { ErrorBoundary } from "./components/Errors/ErrorBoundary";
import ProtectedRoutes from "./layouts/guard/ProtectedRoutes";
import NewSupplier from "./layouts/Suppliers/NewSupplier/NewSupplier";
import { Toaster } from "@/components/ui/toaster";
import ShowSupplier from "./layouts/Suppliers/ShowSuppliers/ShowSupplier";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const client = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary fallback={<div></div>}>
      <QueryClientProvider client={client}>
        <Provider store={store}>
          <section className="">
            <BrowserRouter>
              <AppSidebar>
                <ProtectedRoutes>
                  <Routes>
                    <Route path="/" element={<App />} />

                    <Route path="inventory">
                      <Route index element={<HomeScreen show />} />
                      <Route path="ai" element={<AiScreen />} />
                      <Route path="checkout" element={<CheckoutScreen />} />
                      <Route path="products" element={<ProductsScreen />} />
                      <Route path="employee" element={<EmployeeScreen />} />
                      <Route path="suppliers">
                        <Route index element={<SuppliersScreen />} />
                        <Route path="new" element={<NewSupplier />}></Route>
                        <Route path="show" element={<ShowSupplier />}></Route>
                      </Route>
                      <Route path="register" element={<RegisterPage />} />
                    </Route>

                    <Route path="/test" element={<App />} />
                    <Route path="/login" element={<LoginPage show />} />
                    <Route path="*" element={<div>No encontrado</div>}></Route>
                  </Routes>
                  <Toaster />
                </ProtectedRoutes>
              </AppSidebar>
            </BrowserRouter>
          </section>
        </Provider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
