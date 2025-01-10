import { Progress } from "@/components/ui/progress";
import { ArchiveIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [load, setLoad] = useState<number>(0);
  useEffect(() => {
    const loadProgress = setTimeout(() => {
      setLoad((l: number) => (l > 100 ? 0 : l + 2));
    }, 100);
    return () => {
      clearTimeout(loadProgress);
    };
  }, [load]);
  return (
    <main className="w-full h-screen px-[40svw] flex flex-col gap-20 justify-center items-center">
      <a
        title="Logo"
        href="#"
        className="flex items-center gap-2 self-center font-medium"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <ArchiveIcon className="size-10" />
        </div>
      </a>
      <Progress value={load} />
    </main>
  );
}
