import Bills from "@/components/Bills/Bills";
import { useSidebar } from "@/components/ui/sidebar";
import { useEffect } from "react";

export default function CheckoutScreen() {
  const { open, setOpen } = useSidebar();
  useEffect(() => {
    if (open) {
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="h-screen w-full">
      <Bills
        onValueChange={(v) => {
          console.log(v);
        }}
      />
    </div>
  );
}
