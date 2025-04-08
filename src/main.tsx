import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import AppSidebar from "./components/Sidebar/AppSidebar";
import { ErrorBoundary } from "./components/Errors/ErrorBoundary";
import ProtectedRoutes from "./layouts/guard/ProtectedRoutes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as ToasterHot} from "react-hot-toast"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RegisterPage,
  LoginPage,
  HomeScreen,
  AiScreen,
  POSPage,
  ProductsScreen,
  EmployeeScreen,
  SuppliersScreen,
  ShowSupplier,
  NewProduct,
  ProductInfo,
  SupplierInfo,
  ShowProducts,
  NewSupplier,
  StoresAndBill,
  NewStore,
  ShowStores,
  StoreById,
  NewTill,
  TillById,
  LoadProduct,
  CheckoutScreen,
  ClientPage,
  NewClient,
  SalesPage,
  NewEmployee,
  ShowEmployees,
  ClientIdPage,
  SaleByIdPage,
  EmployeeInfo,
  OrdersPage,
  EditEmployee,
  NewOrder,
  ShowOrders,
  ShowClient,
  OrderInfo
} from "@/pages";

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
                  <Suspense fallback={null}>
                    <Routes>
                      <Route path="/" element={<App />} />
                      <Route path="inventory">
                        <Route index element={<HomeScreen show />} />
                        <Route path="ai">
                          <Route index element={<AiScreen />} />
                          <Route
                            path="load-product"
                            element={<LoadProduct />}
                          />
                        </Route>
                        <Route path="clients">
                          <Route index element={<ClientPage />} />
                          <Route path="new" element={<NewClient />} />
                          <Route path="show" element={<ShowClient />} />
                          <Route path=":id" element={<ClientIdPage />} />
                        </Route>
                        <Route path="checkout">
                          <Route index element={<POSPage />} />
                          <Route path=":id" element={<CheckoutScreen />} />
                        </Route>
                        <Route path="checkout" element={<POSPage />} />
                        <Route path="products">
                          <Route index element={<ProductsScreen />} />
                          <Route path="new" element={<NewProduct />}></Route>
                          <Route path="show" element={<ShowProducts />}></Route>
                          <Route path=":id" element={<ProductInfo />}></Route>
                        </Route>
                        <Route path="employee" >
                          <Route index element={<EmployeeScreen />} />
                          <Route path="new" element={<NewEmployee />} />
                          <Route path="show" element={<ShowEmployees />} />
                          <Route path="show/:id" element={<EmployeeInfo />} />          
                          <Route path="edit/:id" element={<EditEmployee />} />        
                        </Route>
                        <Route path="suppliers">
                          <Route index element={<SuppliersScreen />} />
                          <Route path="new" element={<NewSupplier />}></Route>
                          <Route path="show" element={<ShowSupplier />}></Route>
                          <Route path=":id" element={<SupplierInfo />}></Route>
                        </Route>
                        <Route path="sales">
                          <Route index element={<SalesPage />} />
                          <Route path=":id" element={<SaleByIdPage/>}/>
                        </Route>
                        <Route path="stores">
                          <Route index element={<StoresAndBill />} />
                          <Route path="new" element={<NewStore />}></Route>
                          <Route
                            path="new-till/:id"
                            element={<NewTill />}
                          ></Route>
                          <Route path="show" element={<ShowStores />}></Route>
                          <Route
                            path="show/:id"
                            element={<StoreById />}
                          ></Route>
                        </Route>
                        <Route path="orders">
                          <Route index element={<OrdersPage/>} />
                          <Route path="new" element={<NewOrder />} />
                          <Route path="show" element={<ShowOrders />} />
                          <Route path=":id" element={<OrderInfo/>}/>
                        </Route>
                        <Route path="register" element={<RegisterPage />} />
                        {/* Till */}
                        <Route path="till/:id" element={<TillById />} />
                      </Route>

                      <Route path="/test" element={<App />} />
                      <Route path="/login" element={<LoginPage show />} />
                      <Route
                        path="*"
                        element={<div>No encontrado</div>}
                      ></Route>
                    </Routes>
                  </Suspense>
                  <Toaster />
                  <ToasterHot/>
                </ProtectedRoutes>
              </AppSidebar>
            </BrowserRouter>
          </section>
        </Provider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
