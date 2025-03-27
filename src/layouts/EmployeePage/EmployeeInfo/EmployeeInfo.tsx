import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router";
import useEmployeeById from "@/hooks/employees/useEmployeeById";
import { ArrowLeft, Loader2, UserRound, Mail, ShieldCheck } from "lucide-react";
import { ROLES } from "@/lib/database.types";

export default function EmployeeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { emplooyeByIdQuery } = useEmployeeById(id);

  if (emplooyeByIdQuery.isFetching) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (emplooyeByIdQuery.isError) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-red-600">
            Error al cargar datos del empleado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">
            No se pudo cargar la información del empleado.
          </p>
          <Button onClick={() => navigate(-1)} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver
          </Button>
        </CardContent>
      </Card>
    );
  }

  const employee = emplooyeByIdQuery.data;
  if (!employee) return null;
  return (
    <div className="p-8 md:p-16 max-w-4xl mx-auto">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver
      </Button>

      <Card className="w-full">
        <CardHeader className="text-center border-b pb-6">
          <CardTitle className="text-2xl">Detalles del Empleado</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-muted rounded-full p-4 mb-4">
              <UserRound className="h-16 w-16" />
            </div>
            <h2 className="text-xl font-bold">{employee.name}</h2>
          </div>

          <div className="grid gap-6">
            <div className="flex items-start gap-3 p-3 border rounded-md">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-sm text-muted-foreground">
                  Correo Electrónico
                </p>
                <p>{employee.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-md">
              <ShieldCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-sm text-muted-foreground">
                  Roles
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {employee.role.map((role, index) => (
                    <span
                      key={index}
                      className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
                    >
                      {ROLES[role.split("_")[0].toLowerCase()]}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-md">
              <div className="h-5 w-5 flex items-center justify-center text-muted-foreground">
                ID
              </div>
              <div>
                <p className="font-medium text-sm text-muted-foreground">
                  Identificador
                </p>
                <p className="text-sm font-mono">{employee.id}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <Button
              onClick={() => navigate(`/inventory/employee/edit/${employee.id}`)}
              className="mr-2"
            >
              Editar Empleado
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
