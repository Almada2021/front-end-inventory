import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import AppSidebar from "./components/ui/app-sidebar";

function App() {
  return (
    <>
      <Navbar />
      <AppSidebar show={false} />
    </>
  );
}

export default App;
