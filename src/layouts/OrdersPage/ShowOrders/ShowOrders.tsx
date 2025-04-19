import CalendarSelector from "@/components/CalendarSelector/CalendarSelector";
import OrdersDataTable from "@/components/DataTable/orders/OrdersDataTable";
import PaginationButtons from "@/components/PaginationButtons/PaginationButtons";
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
  const [page, setPage] = useState(1);
  const limit = 10;

  const { getOrdersQuery } = useOrders({
    page,
    limit,
    startDate: format(date.from!, "yyyy-MM-dd"),
    endDate: format(date.to!, "yyyy-MM-dd"),
  });

  return (
    <div className="mt-20 md:mt-4 flex gap-2 flex-col w-full">
      <div className="px-4 space-y-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">
            Gestión de Órdenes
          </h1>
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
              setPage(1); // Resetear la página cuando cambian las fechas
              return;
            } else {
              return;
            }
          }}
        />
      </div>

      <div className="flex-1 px-4">
        <OrdersDataTable
          orders={getOrdersQuery.data?.orders}
          isLoading={getOrdersQuery.isFetching}
        />
      </div>

      <div className="py-4 flex justify-center items-center border-t">
        <PaginationButtons
          currentPage={page}
          handlePageChange={(newPage) => setPage(newPage)}
          totalPages={
            Math.ceil(Number(getOrdersQuery.data?.numberOfPages) / limit) || 1
          }
        />
      </div>
    </div>
  );
}
