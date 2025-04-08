import CalendarSelector from "@/components/CalendarSelector/CalendarSelector";
import { useState } from "react";
import SalesDataTable from "@/components/DataTable/sales/SalesDataTable";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Sheet } from "lucide-react";
import { BackendApi } from "@/core/api/api";
import { useAdmin } from "@/hooks/browser/useAdmin";
export default function SalesPage() {
  const isAdmin = useAdmin();
  const [date, setDate] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 0),
  });
  const DownloadCsv = async () => {
    try {
      const startDate = format(date.from!, "yyyy-MM-dd");
      const endDate = format(date.to!, "yyyy-MM-dd");
      const csv = await BackendApi.get("/sale/csv", { params: { startDate, endDate: endDate ? endDate :startDate } });
      const blob = new Blob([csv.data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Ventas-${startDate}-${endDate}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error)
    }
  }
  if(!isAdmin){
    return null;
  }
  return (
    <div className="w-full h-screen mt-20 md:mt-4">
      <div className="mx-4 flex">
        <CalendarSelector
          className="w-full"
          date={date}
          setDate={(date: DateRange | undefined) => {
            if(date != undefined){
              setDate(date!)
              return;
            }else {
              return;
            }
          }}
        />

        <Button
          onClick={DownloadCsv}
        >
          <Sheet />
          Descargar Csv
        </Button>
      </div>

      <div className="p-2 block max-w-full overflow-x-scroll overflow-y-hidden">
        {/* <Receipt data={test} /> */}
        <SalesDataTable date={date} />
      </div>
    </div>
  );
}
