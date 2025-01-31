import MainCard from "@/components/Cards/Main/MainCard";
import { PlusCircleIcon, Container } from "lucide-react";
import { useNavigate } from "react-router";
export default function SuppliersPage() {
  const navigate = useNavigate();
  return (
    <div className=" w-full p-20  md:p-20 flex flex-wrap  gap-4 items-center justify-center">
      {/* <SuppliersForm /> */}
      <MainCard
        onClick={() => {
          navigate("./new");
        }}
        Icon={PlusCircleIcon}
      >
        Crear Proveedor
      </MainCard>
      <MainCard
        onClick={() => {
          navigate("./show");
        }}
        Icon={Container}
      >
        Mostras Proveedores
      </MainCard>
    </div>
  );
}
