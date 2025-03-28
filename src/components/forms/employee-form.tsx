import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BackendApi } from "@/core/api/api";
import { useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Define available roles
const AVAILABLE_ROLES = [
  { id: "USER_ROLE", label: "Usuario Normal" },
  { id: "ADMIN_ROLE", label: "Administrator" },
];

// User registration form values interface
interface EmployeeFormValues {
  name: string;
  email: string;
  password: string;
  roles: string[];
}
interface Props {
  editMode?: boolean;
  editValues?: EmployeeFormValues;
  id?: string;
}

export default function EmployeeForm({ editMode = false, editValues, id }: Props) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik<EmployeeFormValues>({
    initialValues: {
      name: editValues?.name || "",
      email: editValues?.email || "",
      password: "",
      roles: ["USER_ROLE"], // Default role
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Full name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters"),
      roles: Yup.array()
        .of(Yup.string())
        .min(1, "At least one role must be selected"),
    }),
    onSubmit: async (
      values,
      { resetForm }: FormikHelpers<EmployeeFormValues>
    ) => {
      setIsSubmitting(true);
      try {
        // Send the data in JSON format to the registration endpoint
        if (!editMode) {
          await BackendApi.post("/auth/register", values);
          toast({
            title: "Registro exitoso",
            description: `Empleado ${values.name} ha sido registrado exitosamente.`,
            variant: "default",
            className:
              "bg-green-50 border-2 border-green-500 p-4 max-w-md w-full shadow-lg", // Larger, more visible styling
          });

          // Reset the form after successful submission
          resetForm();
        } else {
          if (id) {
            await BackendApi.put(`/auth/user/${id}`,{ ...values, password:values.password || editValues?.password});
            toast({
              title: "Empleado Actualizado",
              description: "El empleado ha sido actualizado exitosamente.",
              variant: "default",
              className:
              "bg-green-50 border-2 border-green-500 p-4 max-w-md w-full shadow-lg", // Larger, more visible styling

            })
          }else {
            throw "No existe id en el formulario"
          }
        }

        // Update the employees cache if necessary
        queryClient.invalidateQueries({ queryKey: ["employees"] });

        // Show success message
      } catch (error) {
        // Handle error cases
        console.error(error);
        let msg = "Un Error inesperado ocurrio";
        if (error instanceof Error) {
          msg = error.message;
        }
        const errorMsg = msg;
        toast({
          title: "Fallo en el Registro",
          description: errorMsg,
          variant: "destructive",
          className:
            "bg-red-50 text-black border-2 border-red-500 p-4 max-w-md w-full shadow-lg", // Larger, more visible styling
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Handle role checkbox changes
  const handleRoleChange = (roleId: string, checked: boolean) => {
    let updatedRoles;
    if (checked) {
      // Add role if checked
      updatedRoles = [...formik.values.roles, roleId];
    } else {
      // Remove role if unchecked
      updatedRoles = formik.values.roles.filter((role) => role !== roleId);
    }
    formik.setFieldValue("roles", updatedRoles);
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>{editMode ? "Editar Empleado" : "Nuevo Empleado"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-4">
            {/* Full Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formik.values.name}
                onChange={formik.handleChange}
                disabled={isSubmitting}
              />
              {formik.errors.name && formik.touched.name && (
                <p className="text-xs text-red-600">{formik.errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Correo Electronico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                disabled={isSubmitting}
              />
              {formik.errors.email && formik.touched.email && (
                <p className="text-xs text-red-600">{formik.errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="text"
                placeholder="••••••••"
                value={formik.values.password}
                onChange={formik.handleChange}
                disabled={isSubmitting}
              />
              {formik.errors.password && formik.touched.password && (
                <p className="text-xs text-red-600">{formik.errors.password}</p>
              )}
            </div>

            {/* Roles Selection */}
            <div className="grid gap-2">
              <Label>Roles</Label>
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_ROLES.map((role) => (
                  <div key={role.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`role-${role.id}`}
                      checked={formik.values.roles.includes(role.id)}
                      onCheckedChange={(checked) =>
                        handleRoleChange(role.id, checked as boolean)
                      }
                      disabled={isSubmitting}
                    />
                    <Label
                      htmlFor={`role-${role.id}`}
                      className="cursor-pointer"
                    >
                      {role.label}
                    </Label>
                  </div>
                ))}
              </div>
              {formik.errors.roles && formik.touched.roles && (
                <p className="text-xs text-red-600">
                  {formik.errors.roles as string}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {!editMode
                ? isSubmitting
                  ? "Registrando..."
                  : "Registrar Empleado"
                : null}

              {editMode
                ? isSubmitting
                  ? "Editando..."
                  : "Editar Empleado"
                : null}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
