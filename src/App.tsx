import { useNavigate } from "react-router";
import "./App.css";
import { useEffect } from "react";

function App() {
  const shouldRedirect = true;
  const navigate = useNavigate();
  useEffect(() => {
    if (shouldRedirect) {
      navigate("/login");
    }
  }, []);
  return null;
}

export default App;
