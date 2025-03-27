import MainCard from "@/components/Cards/Main/MainCard";
import { PlusCircleIcon, ReceiptCentIcon } from "lucide-react";
import { useNavigate } from "react-router";

export default function OrdersPage() {
    const navigate = useNavigate();
  return (
    <div className=" w-full p-20  md:p-20 flex flex-wrap  gap-4 items-center justify-center">
    <MainCard
      onClick={() => {
        navigate("./new");
      }}
      Icon={PlusCircleIcon}
    >
      Crear Pedido
    </MainCard>
    <MainCard
      onClick={() => {
        navigate("./show");
      }}
      Icon={ReceiptCentIcon}
    >
      Ver Pedidos
    </MainCard>
  </div>
  )
}
