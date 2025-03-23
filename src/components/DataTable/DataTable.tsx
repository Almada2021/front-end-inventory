import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCallback, useEffect, useState } from "react";
import { ProviderModel } from "@/infrastructure/interfaces/provider.interface";
import { useProviders } from "@/hooks/providers/useProviders";
import LoadingScreen from "@/layouts/Loading/LoadingScreen";
const data: ProviderModel[] = [];

const columns: ColumnDef<ProviderModel>[] = [
  {
    id: "select",
    header: ({ table }) => (
    <Checkbox
    checked={
    table.getIsAllPageRowsSelected() ||
    (table.getIsSomePageRowsSelected() && "indeterminate")
    }
    onCheckedChange={(value: unknown) =>
    table.toggleAllPageRowsSelected(!!value)
    }
    aria-label="Select all"
    />
    ),
    cell: ({ row }) => (
    <Checkbox
    checked={row.getIsSelected()}
    onCheckedChange={(value: unknown) => row.toggleSelected(!!value)}
    aria-label="Select row"
    />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
    return (
    <Button
    variant="ghost"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
    Nombre
    <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
    );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
  },
];

interface Props {
  initial: string[];
  notifyProvidersSelected: (prov: string[]) => void;
}

export default function DataTableView({ initial, notifyProvidersSelected }: Props) {
  const memoizedNotifyProvidersSelected = useCallback(
    (selectedRows: string[]) => {
    notifyProvidersSelected(selectedRows);
    },
    [notifyProvidersSelected]
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const { providersQuery } = useProviders();
  
  // Initialize row selection based on initial providers passed in
  useEffect(() => {
    if (initial && initial.length > 0) {
      const initialSelection: Record<string, boolean> = {};
      initial.forEach(id => {
        initialSelection[id] = true;
      });
      setRowSelection(initialSelection);
    }
  }, [initial]);

  const table = useReactTable({
    data: providersQuery?.data || data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => {
      return row.id;
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    const notify = () => {
      memoizedNotifyProvidersSelected(Object.keys(rowSelection));
    };
    return notify();
  }, [rowSelection, memoizedNotifyProvidersSelected]);
  
  if (providersQuery.isFetching) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-center gap-3 py-4">
        <Input
          placeholder="Filtrando Nombre"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="sm:ml-auto">
              Columnas <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              return table.previousPage();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.nextPage();
            }}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}