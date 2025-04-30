import Image from "@/components/Image/Image";
import useStockReport from "@/hooks/products/useStockReport";
import { formatCurrency } from "@/lib/formatCurrency.utils";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { Product } from "@/infrastructure/interfaces/products.interface";
import { useAdmin } from "@/hooks/browser/useAdmin";

export default function StockReport() {
  const isAdmin = useAdmin();
  const { getStockReportQuery } = useStockReport();
  const { data, isLoading } = getStockReportQuery;

  // Column definitions for the table
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "photoUrl",
      header: "Imagen",
      cell: ({ row }) => (
        <Image
          src={row.original.photoUrl}
          alt={row.original.name}
          className="w-16 h-16 object-cover rounded-md"
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Nombre del Producto",
    },
    {
      accessorKey: "price",
      header: "Precio Unitario",
      cell: ({ row }) => formatCurrency(row.original.price),
    },
    {
      accessorKey: "stock", // Ensure this matches the key in your data
      header: "Stock Disponible",
    },
    {
      accessorKey: "basePrice",
      header: "Costo Unitario",
      cell: ({ row }) => formatCurrency(row.original.basePrice),
    },
    {
      accessorKey: "totalSpent",
      header: "Total Gastado",
      cell: ({ row }) =>
        formatCurrency(row.original.stock * row.original.basePrice),
    },
    {
      accessorKey: "moneyToReceive",
      header: "Dinero por Recibir",
      cell: ({ row }) =>
        formatCurrency(row.original.stock * row.original.price),
    },
  ];

  // Ensure table is always initialized
  const table = useReactTable({
    data: data?.products || [],
    columns,
    enableSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getCoreRowModel(), // Ensure sorting is applied
  });

  // Function to download CSV
  const downloadCSV = () => {
    const csvData = data?.products.map((product: Product) => ({
      Nombre: product.name,
      "Precio Unitario": product.price,
      "Stock Disponible": product.stock,
      "Costo Unitario": product.basePrice,
      "Total Gastado": product.stock * product.basePrice,
      "Dinero por Recibir": product.stock * product.price,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "reporte_stock.csv");
  };

  if (isLoading) return <div>Cargando...</div>;
  if (!isAdmin) return <div>No tienes permisos para ver esto</div>;
  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Módulos</h1>
        <h2 className="text-lg">Módulos de Administrador</h2>
        <h3 className="text-xl font-semibold">Tobias Almada</h3>
      </div>

      {/* Report Summary */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Reporte de Stock</h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-100 rounded shadow">
            <h2 className="text-lg font-semibold">Costo Total</h2>
            <p className="text-red-500 text-xl">
              {formatCurrency(data?.costPrice)}
            </p>
          </div>
          <div className="p-4 bg-gray-100 rounded shadow">
            <h2 className="text-lg font-semibold">Valoración Total</h2>
            <p className="text-green-500 text-xl">
              {formatCurrency(data?.valuation)}
            </p>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="mt-6">
        <Button onClick={downloadCSV} className="bg-blue-500 text-white">
          Descargar CSV
        </Button>
      </div>
      {/* Products Table */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Productos</h2>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-200">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border border-gray-300 px-4 py-2 cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()} // Add sorting handler
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {header.column.getIsSorted() === "asc" && " 🔼"}
                    {header.column.getIsSorted() === "desc" && " 🔽"}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-100">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border border-gray-300 px-4 py-2"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
