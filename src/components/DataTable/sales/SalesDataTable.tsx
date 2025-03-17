import { Sale } from "@/infrastructure/interfaces/sale/sale.interface";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";
import { format } from "date-fns";
import useSales from "@/hooks/sales/useSales";
import {
  TRANSLATE_PAYMENT_METHODS,
  keyTPaymentMethod,
} from "@/constants/translations/payments.methods";
import { formatCurrency } from "@/lib/formatCurrency.utils";
import { DateRange } from "react-day-picker";
const data: Sale[] = [];
interface Props {
  date?: DateRange;
}

const columns: ColumnDef<Sale>[] = [
  { accessorKey: "id", header: "ID del Recibo" },
  {
    accessorKey: "amount",
    header: "Monto",
    cell: ({ row }) => `${formatCurrency(row.getValue("amount"))}`,
  },
  {
    accessorKey: "profits",
    header: "Ganancias",
    cell: ({ row }) => `${row.getValue("profits")?.toLocaleString()}`,
  },
  {
    accessorKey: "products",
    header: "Productos",
    cell: ({ row }) =>
      row.original.products.reduce((acc, curr) => acc + curr.quantity, 0) +
      " unidades",
  },
  {
    accessorKey: "paymentMethod",
    header: "Método de Pago",
    cell: ({ row }) =>
      `${
        TRANSLATE_PAYMENT_METHODS[
          row.getValue("paymentMethod") as keyTPaymentMethod
        ]
      }`,
  },
  {
    accessorKey: "bills",
    header: "Billetes Usados",
    cell: ({ row }) => {
      const bills = row.original.bills;
      return Object.entries(bills)
        .map(([denom, count]) => `${count}x${formatCurrency(Number(denom))}`)
        .join(", ");
    },
  },
  {
    accessorKey: "billsCashBack",
    header: "Vueltos Entregados",
    cell: ({ row }) => {
      const cashBack = row.original.billsCashBack;
      return Object.entries(cashBack)
        .map(([denom, count]) => `${count}x$${denom}`)
        .join(", ");
    },
  },
  {
    accessorKey: "createdAt",
    header: "Fecha",
    cell: ({ row }) =>
      format(new Date(row.original.createdAt), "dd/MM/yyyy HH:mm"),
  },
];

// Component
export default function SalesDataTable({ date }: Props) {
  const { salesQuery } = useSales({
    page: 1,
    limit: 500,
    startDate: date ? format(date.from!, "yyyy-MM-dd") : "",
    endDate: date?.to ? format(date.to, "yyyy-MM-dd") : "",
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable({
    // data: data,
    data: salesQuery.data || data,
    columns: columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting: sorting,
      columnFilters: columnFilters,
      columnVisibility: columnVisibility,
      rowSelection: rowSelection,
    },
    getRowId: (row) => {
      return row.id;
    },
  });
  if (salesQuery.isFetching) return null;

  return (
    <div className="mx-4 mt-4 w-full">
      <Table className="overflow-x-scroll">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No Se Encontraro resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            {table.getHeaderGroups()[0].headers.map((header) => {
              // Calculate totals only for relevant columns
              const totalAmount =
                salesQuery.data?.reduce((sum, sale) => sum + sale.amount, 0) ||
                0;
              const totalProfits =
                salesQuery.data?.reduce((sum, sale) => sum + sale.profits, 0) ||
                0;
              const totalProducts =
                salesQuery.data?.reduce(
                  (sum, sale) =>
                    sum +
                    sale.products.reduce(
                      (acc, product) => acc + product.quantity,
                      0
                    ),
                  0
                ) || 0;

              return (
                <TableCell key={header.id} className="font-medium">
                  {header.column.id === "amount" && formatCurrency(totalAmount)}
                  {header.column.id === "profits" &&
                    totalProfits.toLocaleString()}
                  {header.column.id === "products" &&
                    `${totalProducts} unidades`}
                  {header.column.id === "id" && "Total de Ventas"}
                  {/* Empty cells for other columns */}
                  {!["id", "amount", "profits", "products"].includes(
                    header.column.id
                  ) && ""}
                </TableCell>
              );
            })}
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
