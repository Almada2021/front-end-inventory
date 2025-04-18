"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

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
  isLoading?: boolean;
  error?: string | boolean;
  className?: string;
}

export function ComboBox({
  options,
  placeholder,
  searchFn,
  onChange,
  isLoading,
  error,
  className,
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between h-10",
              error ? "border-destructive" : "",
              className
            )}
          >
            <span className="truncate">
              {value
                ? options.find((option) => option.value === value)?.label
                : placeholder}
            </span>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin opacity-70" />
            ) : (
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command className="w-full">
            <CommandInput
              onValueChange={(search: string) => {
                if (search.length > 1 && searchFn) {
                  searchFn(search);
                }
              }}
              placeholder={`Buscar ${placeholder?.toLowerCase()}...`}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty className="py-6 text-center text-sm">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Buscando...</span>
                  </div>
                ) : (
                  "No se encontraron resultados"
                )}
              </CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      const newValue =
                        currentValue === value ? "" : currentValue;
                      setValue(newValue);
                      setOpen(false);
                      if (onChange) {
                        onChange(newValue);
                      }
                    }}
                    className="flex items-center gap-2 py-2"
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
                        className="h-8 w-8 rounded-md object-cover"
                      />
                    )}
                    <span className="flex-1 truncate">{option.label}</span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
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
      {typeof error === "string" && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}

export default ComboBox;
