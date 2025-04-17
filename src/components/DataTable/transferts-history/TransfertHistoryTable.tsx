import { TransfertHistory } from "@/infrastructure/interfaces/transfert-history/transfert-history..interface";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatCurrency } from "@/lib/formatCurrency.utils";
import { TRANSLATE_PAYMENT_METHODS } from "@/constants/translations/payments.methods";
interface Props {
  transferts: TransfertHistory[];
}

const columns: ColumnDef<TransfertHistory>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return <a href={`/transferts/${row.original.id}`}>{row.original.id}</a>;
    },
  },
  {
    accessorKey: "amount",
    header: "Monto Total",
    cell: ({ row }) => {
      return <div>{formatCurrency(row.original.amount)}</div>;
    },
  },
  {
    accessorKey: "user",
    header: "Persona",
    cell: ({ row }) => {
      return <div>{row.original.user}</div>;
    },
  },
  {
    accessorKey: "method",
    header: "Metodo",
    cell: ({ row }) => {
      return (
        <div>
          {
            TRANSLATE_PAYMENT_METHODS[
              row.original.method as keyof typeof TRANSLATE_PAYMENT_METHODS
            ]
          }
        </div>
      );
    },
  },
  {
    accessorKey: "bills",
    header: "Billetes",
    cell: ({ row }) => {
      return (
        <div>
          {Object.entries(row.original.bills).map(([key, value]) => {
            return (
              <div key={key}>
                {formatCurrency(Number(key))} x {value}
              </div>
            );
          })}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: "Fecha",
    cell: ({ row }) => {
      return (
        <div>
          {new Date(row.original.createdAt).toLocaleString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </div>
      );
    },
  },
];
export default function TransfertHistoryTable({ transferts }: Props) {
  const table = useReactTable({
    data: transferts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  if (transferts.length === 0) {
    return <div>No Existen transferencias De esta caja</div>;
  }
  return (
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
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
