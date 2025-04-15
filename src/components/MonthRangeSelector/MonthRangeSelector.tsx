import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, setMonth, setYear } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MonthRangeSelectorProps {
  onChange?: (startDate: string, endDate: string) => void;
}

export function MonthRangeSelector({ onChange }: MonthRangeSelectorProps) {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const currentYear = new Date().getFullYear();

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2000, i, 1);
    return {
      value: i,
      label: format(date, "MMMM", { locale: es }),
    };
  });

  const years = Array.from({ length: 31 }, (_, i) => currentYear - 10 + i);

  useEffect(() => {
    const start = startOfMonth(selectedMonth);
    const end = endOfMonth(selectedMonth);

    const formattedStartDate = format(start, "yyyy-MM-dd");
    const formattedEndDate = format(end, "yyyy-MM-dd");

    if (onChange) {
      onChange(formattedStartDate, formattedEndDate);
    }
  }, [selectedMonth, onChange]);

  const handleMonthChange = (monthIndex: string) => {
    const newDate = setMonth(selectedMonth, parseInt(monthIndex));
    setSelectedMonth(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = setYear(selectedMonth, parseInt(year));
    setSelectedMonth(newDate);
  };

  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium mx-4">Seleccionar Mes</h3>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(selectedMonth, "MMMM yyyy", { locale: es })}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4" align="end">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Mes</h4>
              <Select
                value={selectedMonth.getMonth().toString()}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar mes" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem
                      key={month.value}
                      value={month.value.toString()}
                    >
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Año</h4>
              <Select
                value={selectedMonth.getFullYear().toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar año" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
