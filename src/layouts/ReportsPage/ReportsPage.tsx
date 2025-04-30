import MainCard from "@/components/Cards/Main/MainCard";
import { Archive, ArrowDown10 } from "lucide-react";
import { useNavigate } from "react-router";

export default function ReportsPage() {
  const navigate = useNavigate();
  return (
    <div className=" w-full p-20  md:p-20 flex flex-wrap  gap-4 items-center justify-center">
      <MainCard
        onClick={() => {
          navigate("/inventory/reports/stock-report");
        }}
        Icon={Archive}
      >
        Reporte de Stock
      </MainCard>
      <MainCard
        onClick={() => {
          navigate("/inventory/reports/low-stock");
        }}
        Icon={ArrowDown10}
      >
        Bajo Stock y Alertas
      </MainCard>
    </div>
  );
}
