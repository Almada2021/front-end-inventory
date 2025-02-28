import { useState } from "react";

export default function useLocalStorage<T>(key: string, newVal?: unknown) {
  const [state, setState] = useState<T | string | null>(
    JSON.parse(localStorage.getItem(key) || "null")
  );
  if (newVal) {
    const str = JSON.stringify(newVal);
    localStorage.setItem(key, str);
    setState(str);
  }
  const updateState = (val: T) => {
    const str = JSON.stringify(val);
    localStorage.setItem(key, str);
    setState(str);
  };
  return [state, updateState];
}
