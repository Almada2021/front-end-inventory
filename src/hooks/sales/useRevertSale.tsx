import { revertSaleAction } from "@/core/actions/sales/revertSale.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export default function useRevertSale() {
  const queryClient = useQueryClient();

  const revertSaleMutation = useMutation({
    mutationFn: revertSaleAction,
    onSuccess: (data) => {
      // Invalidate the sale query to refetch the updated data
      queryClient.invalidateQueries({ queryKey: ["sales", data.id] });
      toast({
        title: "Venta revertida",
        description: "La venta ha sido revertida exitosamente",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error("Error reverting sale:", error);
      toast({
        title: "Error al revertir la venta",
        description: "Ha ocurrido un error al intentar revertir la venta",
        variant: "destructive",
      });
    },
  });

  return { revertSaleMutation };
}
