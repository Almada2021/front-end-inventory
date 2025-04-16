import StoresForm from "@/components/forms/stores-form";
import { useAdmin } from "@/hooks/browser/useAdmin";
import { useNavigate } from "react-router";

export default function NewStores() {
  const isAdmin = useAdmin();
  const navigate = useNavigate();
  if (!isAdmin) {
    navigate("/inventory")
  }
  return (
    <div className="w-full h-screen p-10 md:p-20 mt-20 md:mt-0">
      <StoresForm />
    </div>
  );
}
