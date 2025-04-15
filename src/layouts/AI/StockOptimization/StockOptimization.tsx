import { MonthRangeSelector } from "@/components/MonthRangeSelector/MonthRangeSelector";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import StockReport from "./StockReport/StockReport";

export default function StockOptimization() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [generateReport, setGenerateReport] = useState<boolean>(false);
  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };
  const handleReportChange = () => {
    if (!startDate && !endDate) {
      return;
    }
    setGenerateReport(true);
  };
  return (
    <div className="mt-10 md:mt-4 flex flex-col md:flex-row w-full">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Optimización de Stock</h2>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <MonthRangeSelector onChange={handleDateChange} />
        </div>

        {startDate && endDate && (
          <div className="mt-8 p-4 bg-blue-50 rounded-md">
            <p className="font-medium">Período seleccionado para análisis:</p>
            <p>Desde: {startDate}</p>
            <p>Hasta: {endDate}</p>
          </div>
        )}
        <div className="my-4 ">
          <Button onClick={handleReportChange} size="lg">
            Generar Reporte
          </Button>
        </div>
      </div>
      <div className="w-full h-full p-6">
        {generateReport && <StockReport startDate={startDate} endDate={endDate} />}
        {!generateReport && (
          <div className="flex h-full w-full justify-center items-center">
            <h3
              className="font-bold text-3xl text-center"
            >
            (Selecciona el mes) y <p></p>
            Presiona Generar reporte para empezar
            </h3>
          </div>
        )}  
      </div>
    </div>
  );
}
