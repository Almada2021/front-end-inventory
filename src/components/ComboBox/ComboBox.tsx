"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ComboBoxProps {
  options: {
    value: string;
    label: string;
    img?: string;
  }[];
  placeholder?: string;
  searchFn?: (value: string) => void;
  onChange?: (value: string) => void;
}
export function ComboBox({
  options,
  placeholder,
  searchFn,
  onChange,
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? options
                .find((option) => option.value === value)
                ?.label.substring(0, 18)
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            onValueChange={(value: string) => {
              if (value.length > 1 && searchFn) {
                searchFn(value);
              }
            }}
            placeholder={placeholder}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No se encontraron resultados</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue;
                    setValue(newValue);
                    setOpen(false);
                    if (onChange) {
                      onChange(newValue);
                    }
                  }}
                >
                  {option.img && (
                    <img
                      src={
                        option.img.startsWith("http")
                          ? option.img
                          : `${import.meta.env.VITE_BACKEND_URL}/static/${
                              option.img
                            }`
                      }
                      alt={option.label}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default ComboBox;
