import EmployeeForm from "@/components/forms/employee-form";
import useEmployeeById from "@/hooks/employees/useEmployeeById";
import LoadingScreen from "@/layouts/Loading/LoadingScreen";
import { useParams } from "react-router";

export default function EditEmployee() {
  const { id } = useParams();
  const { emplooyeByIdQuery } = useEmployeeById(id);
  if (emplooyeByIdQuery.isFetching) {
    return <LoadingScreen />;
  }
  return (
    <div className="w-full h-screen p-10 md:p-20 mt-20 md:mt-0">
      <EmployeeForm
        editValues={{
          name: emplooyeByIdQuery.data?.name || "",
          email: emplooyeByIdQuery.data?.email || "",
          password: emplooyeByIdQuery.data?.password || "",
          roles: emplooyeByIdQuery.data?.role || []
        }}
        editMode
      />
    </div>
  );
}
