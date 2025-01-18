import { useNavigate } from "react-router";
import "./App.css";
import { RootState } from "./app/store";
import { useAppSelector } from "./config/react-redux.adapter";
import { useEffect } from "react";
import LoadingScreen from "@/layouts/Loading/LoadingScreen";

function App() {
  const { userInfo, token } = useAppSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo && !token) {
      navigate("/login");
    } else {
      navigate("/inventory");
    }
  }, [userInfo, token, navigate]);

  return (
    <div className="w-full h-full">
      <LoadingScreen />
    </div>
  );
}

export default App;
