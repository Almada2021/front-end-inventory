import CalendarSelector from "@/components/CalendarSelector/CalendarSelector";
import OrdersDataTable from "@/components/DataTable/orders/OrdersDataTable";
import useOrders from "@/hooks/order/useOrders";
import { addDays, format, subDays } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";

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
    <div className="mt-20 md:mt-4">
      <CalendarSelector
        className="w-full px-4"
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
      {!getOrdersQuery.isFetching && (
        <OrdersDataTable orders={getOrdersQuery.data?.orders} />
      )}
    </div>
  );
}
