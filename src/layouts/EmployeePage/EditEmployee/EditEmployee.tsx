import EmployeeForm from "@/components/forms/employee-form";
import useEmployeeById from "@/hooks/employees/useEmployeeById";
import LoadingScreen from "@/layouts/Loading/LoadingScreen";
import { useParams } from "react-router";

export default function EditEmployee() {
  const { id } = useParams();
  const { emplooyeByIdQuery } = useEmployeeById(id);
  if (emplooyeByIdQuery.isFetching) {
    return (
      <div className="flex min-h-svh w-full flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <LoadingScreen />
      </div>
    );
  }
  return (
    <div className="w-full h-screen p-10 md:p-20 mt-20 md:mt-0">
      <EmployeeForm
        id={emplooyeByIdQuery.data?.id}
        editValues={{
          name: emplooyeByIdQuery.data?.name || "",
          email: emplooyeByIdQuery.data?.email || "",
          password: emplooyeByIdQuery.data?.password || "",
          roles: emplooyeByIdQuery.data?.role || [],
        }}
        editMode={true}
      />
    </div>
  );
}
