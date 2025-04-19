import EmployeeCard from "@/components/Cards/EmployeeCard/EmployeeCard";
import useEmployees from "@/hooks/employees/useEmployees";
import LoadingScreen from "@/layouts/Loading/LoadingScreen";

export default function ShowEmployees() {
  const { employeesQuery } = useEmployees();
  if (employeesQuery.isFetching && !employeesQuery.data?.users)
    return (
      <div className="flex min-h-svh w-full flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <LoadingScreen />
      </div>
    );
  return (
    <div className="mt-20 md:mt-4 ">
      <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
        {employeesQuery.data?.users.map((employee) => (
          <div key={employee.id}>
            <EmployeeCard employee={employee} />
          </div>
        ))}
      </div>
    </div>
  );
}
