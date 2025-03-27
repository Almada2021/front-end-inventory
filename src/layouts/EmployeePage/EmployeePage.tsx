import MainCard from "@/components/Cards/Main/MainCard";
import { Network, PlusCircleIcon } from "lucide-react";
import { useNavigate } from "react-router";

export default function EmployeePage() {
  const navigate = useNavigate();
  
  const goToPage = (page: string) => {
    navigate(page);
  }
  return (
    <div className=" w-full p-20  md:p-20 flex flex-wrap  gap-4 items-center justify-center">
      <MainCard
        onClick={() => {
          goToPage("./new");
        }}
        Icon={PlusCircleIcon}
      >
        Crear Empleado
      </MainCard>
      <MainCard
        onClick={() => {
          goToPage("./show");
        }}
        Icon={Network}
      >
        Ver Empleados
      </MainCard>
    </div>
  );
}
