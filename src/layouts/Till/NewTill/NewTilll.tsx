// components/NewTilll.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import Money from "@/components/Bills/Money/Money";
interface IDENOMINATION {
  value: string;
  type: "bill" | "coin";
}
const DENOMINATIONS: IDENOMINATION[] = [
  { value: "100000", type: "bill" },
  { value: "50000", type: "bill" },
  { value: "20000", type: "bill" },
  { value: "10000", type: "bill" },
  { value: "5000", type: "bill" },
  { value: "2000", type: "bill" },
  { value: "1000", type: "coin" },
  { value: "500", type: "coin" },
  { value: "100", type: "coin" },
  { value: "50", type: "coin" },
];

function MoneyControl({
  denomination,
  type,
  quantity,
  onQuantityChange,
}: {
  denomination: string;
  type: "coin" | "bill";
  quantity: number;
  onQuantityChange: (newQty: number) => void;
}) {
  return (
    <div className="flex items-center gap-4 p-2 bg-card rounded-lg border">
      <Money
        variant="control"
        type={type}
        src={`/money/${denomination}.${type === "bill" ? "jpg" : "png"}`}
        alt={`${denomination} Gs`}
        className="flex-1"
      />

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
        >
          -
        </Button>
        <span className="w-8 text-center font-medium">{quantity}</span>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onQuantityChange(quantity + 1)}
        >
          +
        </Button>
      </div>
    </div>
  );
}

export default function NewTilll() {
  const [bills, setBills] = useState<Map<string, number>>(
    new Map(DENOMINATIONS.map(({ value }) => [value, 0]))
  );

  const formik = useFormik({
    initialValues: {
      name: "",
      contabilizada: true,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("El nombre es requerido"),
      contabilizada: Yup.boolean().required(),
    }),
    onSubmit: (values) => {
      const formData = {
        ...values,
        bills: Object.fromEntries(bills),
        totalCash: Array.from(bills).reduce(
          (acc, [denom, qty]) => acc + parseInt(denom) * qty,
          0
        ),
      };
      console.log("Datos para enviar:", formData);
      formik.resetForm();
    },
  });

  return (
    <div className="w-full">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Nueva Caja Registradora</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Campo de nombre y checkbox */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la caja</Label>
                <Input
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  placeholder="Ej: Caja Principal"
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="contabilizada"
                  checked={formik.values.contabilizada}
                  onCheckedChange={(val) =>
                    formik.setFieldValue("contabilizada", val)
                  }
                />
                <Label htmlFor="contabilizada">Caja contabilizada</Label>
              </div>
            </div>

            {/* Configuración de efectivo */}
            <div className="space-y-4">
              <Label className="block text-lg">Efectivo inicial</Label>
              <div className="grid gap-3">
                {DENOMINATIONS.map(({ value, type }) => (
                  <MoneyControl
                    key={value}
                    denomination={value}
                    type={type}
                    quantity={bills.get(value) || 0}
                    onQuantityChange={(newQty) =>
                      setBills((prev) => new Map(prev).set(value, newQty))
                    }
                  />
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Crear Caja
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
