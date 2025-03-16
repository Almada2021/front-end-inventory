// import { Receipt } from "@/components/Receipt/Receipt";

import CalendarSelector from "@/components/CalendarSelector/CalendarSelector";
import { useState } from "react";
import SalesDataTable from "@/components/DataTable/sales/SalesDataTable";
export default function SalesPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  

  return (
    <div className="w-full h-screen mt-20 md:mt-4">
      <div className="mx-4">

      <CalendarSelector
        dateSelected={date}
        setDateSelected={setDate}
      />
      </div>

      <div>
        {/* <Receipt data={test} /> */}
        <SalesDataTable 
          date={date}
        />
      </div>
    </div>
  );
}
