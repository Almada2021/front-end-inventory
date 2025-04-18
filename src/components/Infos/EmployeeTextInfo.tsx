import useEmployeeById from "@/hooks/employees/useEmployeeById";
import { User } from "@/infrastructure/interfaces/user/user.interface";
import React from "react";
type keys = keyof User;
interface Props {
  employeeId: string;
  keyValue: keys;
  renderFn?: (data: User) => React.ReactNode;
}
export default function EmployeeTextInfo({
  employeeId,
  keyValue,
  renderFn,
}: Props) {
  const { emplooyeByIdQuery } = useEmployeeById(employeeId || "");
  const { data, isFetching } = emplooyeByIdQuery;
  if (isFetching) return null;
  if (!data) return null;
  if (data?.name && data?.name.length === 0) return null;
  if (renderFn) return renderFn(data);
  return <>{data[keyValue]}</>;
}
