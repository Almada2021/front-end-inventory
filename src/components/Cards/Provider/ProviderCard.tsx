import { Button } from "@/components/ui/button";
import { ProviderModel } from "@/infrastructure/interfaces/provider.interface";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProviderAction } from "@/core/actions/providers/deleteProvider.action";
import { useNavigate } from "react-router";
interface Props {
  provider: ProviderModel;
  className?: string;
  length?: number;
  key?: string;
  onDeleteLength?: () => void;
}

export default function ProviderCard({
  provider,
  className,
  length = 0,
  onDeleteLength = () => {},
}: Props) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return deleteProviderAction(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["providers", "all"],
        refetchType: "active",
      });
      if (length == 1 || length == 0) {
        onDeleteLength();
      }
    },
  });
  const showProvider = () => {
    return navigate(`../${provider.id}`);
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-lg border bg-white shadow-md transition-all hover:shadow-lg w-[280px] ${className}`}
    >
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Estás absolutamente seguro de que deseas eliminar el proveedor?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Si hay productos asociados con este proveedor y no existe otro,
              ese producto se eliminará. Si no puedes marcar la casilla de no
              eliminar producto aunque se elimine el proveedor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteMutation.mutate(provider.id);
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-slate-100 opacity-0 transition-opacity group-hover:opacity-100" />

        <div className="relative p-6 space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">
              {provider.name}
            </h2>
            <div className="space-y-1">
              <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <span className="font-medium">Tel:</span> {provider.phoneNumber}
              </p>

              <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <span className="font-medium">Vendedor:</span> {provider.seller}
              </p>
            </div>
          </div>

          <div className="pt-4 flex gap-2">
            <Button
              onClick={showProvider}
              className="w-full bg-primary hover:bg-primary text-white transition-colors"
            >
              Ver
            </Button>
            <AlertDialogTrigger asChild>
              <Button className="w-full bg-red-700 hover:bg-red-800 text-white transition-colors">
                Borrar
              </Button>
            </AlertDialogTrigger>
          </div>
        </div>
      </AlertDialog>
    </div>
  );
}
