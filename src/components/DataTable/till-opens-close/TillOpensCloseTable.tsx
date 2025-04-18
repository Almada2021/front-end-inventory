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
import { Card, CardContent } from "@/components/ui/card";

interface TillOpensClose {
  id: string;
  tillId: string;
  openingAmount: number;
  closingAmount?: number;
  openingTime: string;
  closingTime?: string;
  status: "open" | "closed";
  createdAt?: string;
  updatedAt?: string;
}

interface Props {
  tillOpensClose: TillOpensClose[];
}

const columns: ColumnDef<TillOpensClose>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return (
        <div className="font-medium text-sm text-blue-600">
          {row.original.id.slice(0, 8)}
        </div>
      );
    },
  },
  {
    accessorKey: "openingAmount",
    header: "Monto Apertura",
    cell: ({ row }) => {
      return (
        <div className="font-medium text-green-600">
          {formatCurrency(row.original.openingAmount)}
        </div>
      );
    },
  },
  {
    accessorKey: "closingAmount",
    header: "Monto Cierre",
    cell: ({ row }) => {
      return row.original.closingAmount ? (
        <div className="font-medium text-green-600">
          {formatCurrency(row.original.closingAmount)}
        </div>
      ) : (
        <div className="text-gray-500">Pendiente</div>
      );
    },
  },
  {
    accessorKey: "openingTime",
    header: "Fecha Apertura",
    cell: ({ row }) => {
      return (
        <div className="text-sm whitespace-nowrap">
          {new Date(row.original.openingTime).toLocaleString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "closingTime",
    header: "Fecha Cierre",
    cell: ({ row }) => {
      return row.original.closingTime ? (
        <div className="text-sm whitespace-nowrap">
          {new Date(row.original.closingTime).toLocaleString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      ) : (
        <div className="text-gray-500">Pendiente</div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      return (
        <div
          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
            row.original.status === "open"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.original.status === "open" ? "Abierto" : "Cerrado"}
        </div>
      );
    },
  },
];

export default function TillOpensCloseTable({ tillOpensClose }: Props) {
  console.log("TillOpensClose data:", tillOpensClose); // Debugging line

  const table = useReactTable({
    data: tillOpensClose || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!tillOpensClose || tillOpensClose.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        No hay registros de aperturas/cierres
      </div>
    );
  }

  // Vista móvil
  const MobileView = () => (
    <div className="space-y-4 md:hidden">
      {tillOpensClose.map((record) => (
        <Card key={record.id} className="overflow-hidden">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-600">
                ID: {record.id.slice(0, 8)}
              </span>
              <div
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  record.status === "open"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {record.status === "open" ? "Abierto" : "Cerrado"}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-sm text-gray-500">Monto Apertura</div>
                <div className="font-medium text-green-600">
                  {formatCurrency(record.openingAmount)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Monto Cierre</div>
                {record.closingAmount ? (
                  <div className="font-medium text-green-600">
                    {formatCurrency(record.closingAmount)}
                  </div>
                ) : (
                  <div className="text-gray-500">Pendiente</div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-sm text-gray-500">Fecha Apertura</div>
                <div className="text-sm">
                  {new Date(record.openingTime).toLocaleString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Fecha Cierre</div>
                {record.closingTime ? (
                  <div className="text-sm">
                    {new Date(record.closingTime).toLocaleString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                ) : (
                  <div className="text-gray-500">Pendiente</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Vista de escritorio
  const DesktopView = () => (
    <Table className="hidden md:table">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
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
    <div>
      <MobileView />
      <DesktopView />
    </div>
  );
}
