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
} from "@/pages";
import AppSidebar from "./components/Sidebar/AppSidebar";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <section className="">
        <AppSidebar>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="inventory">
                <Route index element={<HomeScreen show />} />
                <Route path="ai" element={<AiScreen />} />
                <Route path="checkout" element={<CheckoutScreen />} />
              </Route>

              <Route path="/test" element={<App />} />
              <Route path="/login" element={<LoginPage show />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </BrowserRouter>
        </AppSidebar>
      </section>
    </Provider>
  </StrictMode>
);
