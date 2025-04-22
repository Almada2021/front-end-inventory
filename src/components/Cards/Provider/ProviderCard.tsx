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
import { Badge } from "@/components/ui/badge";
import { CircleUser, Eye, PhoneCallIcon, Trash2 } from "lucide-react";
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
    <AlertDialog>
      <div
        className={`group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md ${className}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold truncate">
                {provider.name}
              </h2>
              <Badge variant="outline" className="shrink-0">
                {provider.productsIds?.length || 0} productos
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <PhoneCallIcon className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{provider.phoneNumber}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <CircleUser className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{provider.seller}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={showProvider}
              variant="outline"
              className="w-full gap-2"
            >
              <Eye className="h-4 w-4" />
              Detalles
            </Button>

            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full gap-2">
                <Trash2 className="h-4 w-4" />
                Eliminar
              </Button>
            </AlertDialogTrigger>
          </div>
        </div>
      </div>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            Eliminar proveedor
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará permanentemente el proveedor y podría afectar
            los productos asociados. ¿Deseas continuar?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteMutation.mutate(provider.id)}>
            Confirmar eliminación
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
