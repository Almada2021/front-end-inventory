import useTillById from "@/hooks/till/useTillById";
import { Till } from "@/infrastructure/interfaces/till.interface";
import React from "react";
type keys = keyof Till;
interface Props {
  tillId: string;
  keyValue: keys;
  renderFn?: (data: Till) => React.ReactNode;
}
export default function TillTextInfo({ tillId, keyValue, renderFn }: Props) {
  const { tillsByIdQuery } = useTillById(tillId || "");
  const { data, isFetching } = tillsByIdQuery;
  if (isFetching) return null;
  if (!data) return null;
  if (data?.name && data?.name.length === 0) return null;
  if (renderFn) return renderFn(data);
  return <>{data[keyValue]}</>;
}
