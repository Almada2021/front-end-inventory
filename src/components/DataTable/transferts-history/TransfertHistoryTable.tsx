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
import { Card, CardContent } from "@/components/ui/card";
import EmployeeTextInfo from "@/components/Infos/EmployeeTextInfo";

interface Props {
  transferts: TransfertHistory[];
}

const columns: ColumnDef<TransfertHistory>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return (
        <a
          href={`/inventory/transferts/${row.original.id}`}
          className="text-blue-600 hover:underline"
        >
          {row.original.id}
        </a>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Monto Total",
    cell: ({ row }) => {
      return (
        <div className="font-medium">{formatCurrency(row.original.amount)}</div>
      );
    },
  },
  {
    accessorKey: "user",
    header: "Persona",
    cell: ({ row }) => {
      return (
        <EmployeeTextInfo employeeId={row.original.user} keyValue="name" />
      );
    },
  },
  {
    accessorKey: "method",
    header: "Metodo",
    cell: ({ row }) => {
      return (
        <div
          className={`whitespace-nowrap font-bold ${
            row.original.method === "draw" ? "text-red-500" : "text-green-500"
          }`}
        >
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
        <div className="space-y-1">
          {Object.entries(row.original.bills).map(([key, value]) => {
            return (
              <div key={key} className="text-sm">
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
        <div className="text-sm whitespace-nowrap">
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
    return (
      <div className="text-center p-4 text-gray-500">
        No Existen transferencias De esta caja
      </div>
    );
  }

  // Vista móvil
  const MobileView = () => (
    <div className="space-y-4 md:hidden">
      {transferts.map((transfert) => (
        <Card key={transfert.id} className="overflow-hidden">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <a
                href={`/transferts/${transfert.id}`}
                className="text-blue-600 hover:underline"
              >
                ID: {transfert.id}
              </a>
              <span className="font-medium">
                {formatCurrency(transfert.amount)}
              </span>
            </div>
            <div className="text-sm">
              <div className="font-medium">Persona:</div>
              <div className="truncate">{transfert.user}</div>
            </div>
            <div className="text-sm">
              <div className="font-medium">Método:</div>
              <div>
                {
                  TRANSLATE_PAYMENT_METHODS[
                    transfert.method as keyof typeof TRANSLATE_PAYMENT_METHODS
                  ]
                }
              </div>
            </div>
            <div className="text-sm">
              <div className="font-medium">Billetes:</div>
              <div className="space-y-1">
                {Object.entries(transfert.bills).map(([key, value]) => (
                  <div key={key}>
                    {formatCurrency(Number(key))} x {value}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-sm">
              <div className="font-medium">Fecha:</div>
              <div>
                {new Date(transfert.createdAt).toLocaleString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Vista de escritorio
  const DesktopView = () => (
    <Table className="hidden md:table overflow-x-auto">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} className="whitespace-nowrap">
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
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

  return (
    <div className="w-full">
      <MobileView />
      <DesktopView />
    </div>
  );
}
