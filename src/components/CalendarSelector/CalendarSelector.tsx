import { useState } from "react";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { Calendar as CalendarIcon } from "lucide-react";

interface Props {
  dateSelected?: Date;
  setDateSelected?: (date: Date | undefined) => void;
}
export default function CalendarSelector({ dateSelected = new Date(), setDateSelected = () => {} }: Props) {
  const [checked, setChecked] = useState<boolean>(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="border rounded-md px-3 py-2 bg-muted/50">
          <p className="text-sm font-medium">
            {dateSelected?.toLocaleDateString("es-PY", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            }) || "Select a date"}
          </p>
        </div>
        <Button
          onClick={() => setChecked(!checked)}
          variant="outline"
          size="icon"
          className="w-10 h-10"
        >
          <CalendarIcon className="h-4 w-4" />
        </Button>
      </div>

      {checked && (
        <Calendar
          mode="single"
          selected={dateSelected}
          onSelect={(date) => {
            setDateSelected(date);
            setChecked(false);
          }}
          className="rounded-md border shadow-lg"
          style={{
            position: "absolute",
            zIndex: 50,
            backgroundColor: "white",
          }}
        />
      )}
    </div>
  );
}
