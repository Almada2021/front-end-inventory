import MainCard from "@/components/Cards/Main/MainCard";
import { PlusCircleIcon, CupSoda } from "lucide-react";
import { useNavigate } from "react-router";

export default function ProductsPage() {
  const navigate = useNavigate();
  return (
    <div className=" w-full p-20  md:p-20 flex flex-wrap  gap-4 items-center justify-center">
      <MainCard
        onClick={() => {
          navigate("./new");
        }}
        Icon={PlusCircleIcon}
      >
        Crear Producto
      </MainCard>
      <MainCard
        onClick={() => {
          navigate("./show");
        }}
        Icon={CupSoda}
      >
        Ver Productos
      </MainCard>
    </div>
  );
}
