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
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import useSales from "@/hooks/sales/useSales";
import {
  keyTPaymentMethod,
  TRANSLATE_PAYMENT_METHODS,
} from "@/constants/translations/payments.methods";
import { formatCurrency } from "@/lib/formatCurrency.utils";
import { DateRange } from "react-day-picker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Search, CalendarIcon, Filter, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const data: Sale[] = [];
interface Props {
  date?: DateRange;
}

const columns: ColumnDef<Sale>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID del Recibo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <a
        className="text-blue-500 underline"
        href={`./sales/${row.getValue("id")}`}
      >
        {row.getValue("id")}
      </a>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Monto
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div
        className={`${
          !row.original.reverted ? "bg-green-500" : "bg-yellow-600"
        } rounded-md p-2 font-bold text-center shadow-md `}
      >
        {row.original.reverted && "Revertido"}{" "}
        {`${formatCurrency(row.getValue("amount"))}`}
      </div>
    ),
  },
  {
    accessorKey: "profits",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ganancias
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Método de Pago
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
        .map(([denom, count]) => `${count}x${formatCurrency(Number(denom))}`)
        .join(", ");
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  // Nuevos estados para filtros avanzados
  // Modificar el estado inicial
  console.log(sorting, "sorting");
  const maxPossibleAmount = useMemo(() => {
    if (!salesQuery.data || salesQuery.data.length === 0) return 10000;

    const max = Math.max(...salesQuery.data.map((sale) => sale.amount || 0));
    return Number.isFinite(max) && max > 0 ? max : 10000;
  }, [salesQuery.data]);
  const [minAmount, setMinAmount] = useState(0);
  const [maxAmount, setMaxAmount] = useState(maxPossibleAmount);

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("cash");
  const [dateFilterRange, setDateFilterRange] = useState<DateRange | undefined>(
    undefined
  );
  const [showFilters, setShowFilters] = useState(false);

  // Obtener valores mínimos y máximos para montos

  const table = useReactTable({
    data: salesQuery.data || data,
    columns: columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting: sorting,
      columnFilters: columnFilters,
      columnVisibility: columnVisibility,
      rowSelection: rowSelection,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getRowId: (row) => {
      return row.id;
    },
  });

  // Aplicar filtro de rango de monto
  const applyAmountFilter = () => {
    table.getColumn("amount")?.setFilterValue([minAmount, maxAmount]);
  };

  // Aplicar filtro de método de pago
  const applyPaymentMethodFilter = (value: string) => {
    setSelectedPaymentMethod(value);
    if (value) {
      table.getColumn("paymentMethod")?.setFilterValue(value);
    } else {
      table.getColumn("paymentMethod")?.setFilterValue(undefined);
    }
  };

  // Aplicar filtro de fecha
  const applyDateFilter = (range: DateRange | undefined) => {
    setDateFilterRange(range);
    if (range?.from) {
      const filterValue = range.to
        ? [format(range.from, "yyyy-MM-dd"), format(range.to, "yyyy-MM-dd")]
        : format(range.from, "yyyy-MM-dd");
      table.getColumn("createdAt")?.setFilterValue(filterValue);
    } else {
      table.getColumn("createdAt")?.setFilterValue(undefined);
    }
  };

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    setColumnFilters([]);
    setGlobalFilter("");
    setMinAmount(0);
    setMaxAmount(maxPossibleAmount);
    setSelectedPaymentMethod("");
    setDateFilterRange(undefined);
  };

  if (salesQuery.isFetching) return null;

  return (
    <div className="mx-4 mt-4 w-full max-w-[80vw]">
      <div className="flex items-center justify-between py-4">
        <div className="flex gap-2 items-center">
          <div className="relative max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar en todas las columnas..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-8 max-w-sm"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
          </Button>
          {columnFilters.length > 0 && (
            <Button
              variant="ghost"
              onClick={clearAllFilters}
              size="sm"
              className="h-8 px-2 lg:px-3"
            >
              Limpiar filtros
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex gap-1">
          {columnFilters.map((filter) => (
            <Badge key={filter.id} variant="secondary" className="mr-1">
              {filter.id === "paymentMethod" && "Método de pago: "}
              {filter.id === "amount" && "Monto: "}
              {filter.id === "createdAt" && "Fecha: "}
              {filter.value?.toString()}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 ml-1 p-0"
                onClick={() => {
                  setColumnFilters((prev) =>
                    prev.filter((f) => f.id !== filter.id)
                  );
                  if (filter.id === "paymentMethod")
                    setSelectedPaymentMethod("");
                  if (filter.id === "amount") {
                    setMinAmount(0);
                    setMaxAmount(maxPossibleAmount);
                  }
                  if (filter.id === "createdAt") setDateFilterRange(undefined);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>

      {showFilters && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtro de método de pago */}
              <div>
                <Label htmlFor="payment-method">Método de pago</Label>
                <Select
                  value={selectedPaymentMethod}
                  onValueChange={applyPaymentMethodFilter}
                >
                  <SelectTrigger id="payment-method">
                    <SelectValue placeholder="Seleccionar método de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {Object.entries(TRANSLATE_PAYMENT_METHODS).map(
                      ([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro de rango de monto */}
              <div className="flex items-center justify-between">
                <span>{formatCurrency(Math.max(0, minAmount))}</span>
                <span>{formatCurrency(Math.max(100, maxAmount))}</span>
              </div>
              <Slider
                value={[
                  Math.max(0, minAmount),
                  Math.max(minAmount + 100, maxAmount),
                ]}
                min={0}
                max={Math.max(1000, maxPossibleAmount)}
                step={100}
                onValueChange={(values) => {
                  setMinAmount(Math.max(0, values[0]));
                  setMaxAmount(Math.max(values[0] + 100, values[1]));
                }}
                onValueCommit={applyAmountFilter}
              />
              {/* Filtro de fecha */}
              <div>
                <Label>Fecha de venta</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal mt-1"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFilterRange?.from ? (
                        dateFilterRange.to ? (
                          <>
                            {format(dateFilterRange.from, "dd/MM/yyyy")} -{" "}
                            {format(dateFilterRange.to, "dd/MM/yyyy")}
                          </>
                        ) : (
                          format(dateFilterRange.from, "dd/MM/yyyy")
                        )
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={new Date()}
                      selected={dateFilterRange}
                      onSelect={applyDateFilter}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                No se encontraron resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            {table.getHeaderGroups()[0].headers.map((header) => {
              // Cálculo de totales como en el código original
              const totalAmount =
                salesQuery.data?.reduce(
                  (sum, sale) => (sale?.reverted ? 0 : sum + sale.amount),
                  0
                ) || 0;
              const totalProfits =
                salesQuery.data?.reduce(
                  (sum, sale) => (sale?.reverted ? 0 : sum + sale.profits),
                  0
                ) || 0;
              const totalProducts =
                salesQuery.data?.reduce(
                  (sum, sale) =>
                    sum +
                    sale.products.reduce(
                      (acc, product) =>
                        sale.reverted ? 0 : acc + product.quantity,
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
