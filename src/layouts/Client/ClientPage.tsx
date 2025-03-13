import MainCard from "@/components/Cards/Main/MainCard";
import { Contact, PlusCircleIcon } from "lucide-react";
import { useNavigate } from "react-router";

export default function ClientPage() {
  const navigate = useNavigate();
  return (
    <div className=" w-full p-20  md:p-20 flex flex-wrap  gap-4 items-center justify-center">
      <MainCard
        onClick={() => {
          navigate("./new");
        }}
        Icon={PlusCircleIcon}
      >
        Crear Cliente
      </MainCard>
      <MainCard
        onClick={() => {
          navigate("./show");
        }}
        Icon={Contact}
      >
        Ver Clientes
      </MainCard>
    </div>
  );
}
