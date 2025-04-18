import { modifySaleAction } from "@/core/actions/sales/modifySale.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { CreateSaleDto } from "@/infrastructure/interfaces/sale/sale.interface";

export default function useModifySale() {
  const queryClient = useQueryClient();

  const modifySaleMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: CreateSaleDto }) =>
      modifySaleAction(id, dto),
    onSuccess: (data) => {
      // Invalidate the sale query to refetch the updated data
      queryClient.invalidateQueries({ queryKey: ["sales", data.id] });
      toast({
        title: "Venta modificada",
        description: "La venta ha sido modificada exitosamente",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error("Error modifying sale:", error);
      toast({
        title: "Error al modificar la venta",
        description: "Ha ocurrido un error al intentar modificar la venta",
        variant: "destructive",
      });
    },
  });

  return { modifySaleMutation };
}
