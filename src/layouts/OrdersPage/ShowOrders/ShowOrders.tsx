import CalendarSelector from "@/components/CalendarSelector/CalendarSelector";
import OrdersDataTable from "@/components/DataTable/orders/OrdersDataTable";
import { Button } from "@/components/ui/button";
import useOrders from "@/hooks/order/useOrders";
import { addDays, format, subDays } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { Link } from "react-router";
import { PlusCircle } from "lucide-react";

export default function ShowOrders() {
  const [date, setDate] = useState<DateRange>({
    from: subDays(new Date(), 14),
    to: addDays(new Date(), 0),
  });
  
  const { getOrdersQuery } = useOrders({
    page: 1,
    limit: 500,
    startDate: format(date.from!, "yyyy-MM-dd"),
    endDate: format(date.to!, "yyyy-MM-dd"),
  });

  return (
    <div className="mt-20 md:mt-4 space-y-4 px-4 w-full">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Gestión de Órdenes</h1>
        <Link to="/inventory/orders/new">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Nueva Orden
          </Button>
        </Link>
      </div>
      
      <CalendarSelector
        className="w-full"
        date={date}
        setDate={(date: DateRange | undefined) => {
          if (date != undefined) {
            setDate(date!);
            return;
          } else {
            return;
          }
        }}
      />
      
      <OrdersDataTable 
        orders={getOrdersQuery.data?.orders} 
        isLoading={getOrdersQuery.isFetching} 
      />
    </div>
  );
}