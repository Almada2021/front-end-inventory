import MainCard from "@/components/Cards/Main/MainCard";
import { PlusCircleIcon, StoreIcon } from "lucide-react";
import { useNavigate } from "react-router";

export default function StoresAndBillsPage() {
  const navigate = useNavigate();
  return (
    <div className=" w-full p-20  md:p-20 flex flex-wrap  gap-4 items-center justify-center">
      <MainCard
        onClick={() => {
          navigate("./new");
        }}
        Icon={PlusCircleIcon}
      >
        Crear Tienda
      </MainCard>
      <MainCard
        onClick={() => {
          navigate("./show");
        }}
        Icon={StoreIcon}
      >
        Mostrar Tiendas
      </MainCard>
    </div>
  );
}
