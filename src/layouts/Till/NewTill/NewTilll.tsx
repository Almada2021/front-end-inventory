import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Checkbox } from "@/components/ui/checkbox";
import { MouseEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  NewTillAction,
  TillActionRequirements,
} from "@/core/actions/tills/newTillAction";
import { useParams } from "react-router";
import toast from "react-hot-toast";

const DENOMINATIONS = [
  "100000",
  "50000",
  "20000",
  "10000",
  "5000",
  "2000",
  "1000",
  "500",
  "100",
  "50",
];

interface MoneyProps {
  denomination: string;
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
}

function MoneyCounter({
  denomination,
  quantity,
  onQuantityChange,
}: MoneyProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-1 md:p-2 border rounded-lg">
      <div className="md:w-32">
        <Label>Gs. {parseInt(denomination).toLocaleString()}</Label>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={(event: MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            return onQuantityChange(Math.max(0, quantity - 1));
          }}
        >
          -
        </Button>
        <span className="w-8 text-center">{quantity}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={(event: MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();

            onQuantityChange(quantity + 1);
          }}
        >
          +
        </Button>
        {(Number(denomination) * quantity).toLocaleString()}Gs
      </div>
    </div>
  );
}

export default function NewTilll({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [bills, setBills] = useState<Map<string, number>>(
    new Map(DENOMINATIONS.map((denomination) => [denomination, 0]))
  );
  const { id } = useParams();
  const newTillMutate = useMutation({
    mutationFn: (data: TillActionRequirements) => NewTillAction(data),
    mutationKey: [],
    onSuccess: () => {},
  });
  const formik = useFormik({
    initialValues: {
      name: "",
      contabilizada: true,
      bank: false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("El nombre de la caja es requerido"),
      contabilizada: Yup.boolean().optional(),
      bank: Yup.boolean().optional(),
    }),
    onSubmit: async (values) => {
      const formData = {
        // ...values,
        name: values.name,
        storeId: String(id),
        bills: Object.fromEntries(bills),
        totalCash: Array.from(bills).reduce(
          (acc, [denom, qty]) => acc + parseInt(denom) * qty,
          0
        ),
        // uncounted: for
        type: values.bank ? "bankAcount" : "till",
      };
      newTillMutate.mutate(formData);
      toast.success("La Caja se Creo correctamente");
      formik.resetForm();
    },
  });

  const handleBillChange = (denomination: string, quantity: number) => {
    setBills((prev) => new Map(prev).set(denomination, quantity));
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 w-full mt-10 md:mt-4 px-10 md:px-4 ",
        className
      )}
      {...props}
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Nueva Caja Registradora</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid gap-6">
              {/* Nombre de la caja */}
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre de la caja</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Caja Principal"
                  required
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
              </div>

              {/* Checkbox Contabilizada */}
              <div className="flex gap-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="contabilizada"
                    name="contabilizada"
                    checked={formik.values.contabilizada}
                    onCheckedChange={(checked) =>
                      formik.setFieldValue("contabilizada", checked)
                    }
                  />
                  <Label htmlFor="contabilizada">Caja contabilizada</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="bank"
                    name="bank"
                    checked={formik.values.bank}
                    onCheckedChange={(checked) =>
                      formik.setFieldValue("bank", checked)
                    }
                  />
                  <Label htmlFor="contabilizada">Es un Banco</Label>
                </div>
              </div>

              {/* Configuración de efectivo */}
              <div className="grid gap-4">
                <Label>Configuración de efectivo inicial</Label>

                <div className="grid grid-cols-1 gap-2">
                  {DENOMINATIONS.map((denomination) => (
                    <MoneyCounter
                      key={denomination}
                      denomination={denomination}
                      quantity={bills.get(denomination) || 0}
                      onQuantityChange={(newQty) =>
                        handleBillChange(denomination, newQty)
                      }
                    />
                  ))}
                </div>

                <Button type="submit" className="w-full">
                  Crear Caja Registradora
                </Button>
                <div>
                  {DENOMINATIONS.reduce((a, b) => {
                    const quantity = Number(bills.get(b));
                    const total = quantity * Number(b);
                    return a + total;
                  }, 0).toLocaleString()}{" "}
                  Gs
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
