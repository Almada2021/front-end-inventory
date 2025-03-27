import { User } from "@/infrastructure/interfaces/user/user.interface";
import { ROLES } from "@/lib/database.types";
import { cn } from "@/lib/utils"; // Assuming utility class merging
import { useNavigate } from "react-router";

interface Props {
  employee: User;
}
export default function EmployeeCard({ employee }: Props) {
  const navigate = useNavigate();
  // Generate initials for avatar
  const initials = employee.name
    ? employee.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "??";

  // Role color mapping
  const roleColors: { [key: string]: string } = {
    admin_role: "bg-red-100 text-red-800",
    user_role: "bg-blue-100 text-blue-800",
    // Add other roles as needed
  };
  const goToEmployee = () => {
    navigate(`./${employee.id}`)
  }
  return (
    <div
      onClick={goToEmployee}
      className="group relative p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 hover:border-gray-200"
    >
      <div className="flex items-center gap-4">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
            {initials}
          </div>
        </div>

        {/* User Info */}
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {employee.name || "Unknown Employee"}
          </h3>
          <p className="text-sm text-gray-500 truncate hover:text-blue-600 transition-colors">
            <a href={`mailto:${employee.email}`}>{employee.email}</a>
          </p>
        </div>
      </div>

      {/* Roles Badges */}
      {employee.role?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {employee.role.map((role) => (
            <span
              key={role}
              className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-medium",
                roleColors[role.toLowerCase()] || "bg-gray-100 text-gray-800"
              )}
            >
              {ROLES[role.split("_")[0].toLowerCase()]}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
