import React, { useMemo, useState } from "react";
import { useEmployee } from "@/hooks/employee/use-employee";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/utils/cn";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Id } from "@/common/types/types";

type Props = {
  value: Id[];
  onChange: (ids: Id[]) => void;
  label?: string;
  className?: string;
  modal?: boolean;
};

const MultiEmployeeSelect = ({
  value,
  onChange,
  label = "Participants",
  className,
  modal = false,
}: Props) => {
  const [filter, setFilter] = useState({ search: "", autoFetch: true });
  const { employees } = useEmployee({ ...filter, autoFetch: true });

  const options = useMemo(() => {
    if (!employees) return [];
    return employees.results.map(
      (emp: { first_name: string; last_name: string; id: number }) => ({
        label: `${emp.first_name} ${emp.last_name}`,
        value: emp.id as Id,
      }),
    );
  }, [employees]);

  const selectedLabels = options
    .filter((o) => value.includes(o.value))
    .map((o) => o.label);
  const buttonText =
    selectedLabels.length === 0
      ? `Select ${label.toLowerCase()}…`
      : selectedLabels.slice(0, 2).join(", ") +
      (selectedLabels.length > 2 ? ` +${selectedLabels.length - 2}` : "");

  return (
    <div className={cn("w-full", className)}>
      <Label className="flex items-center justify-between text-slate-600 font-medium mb-1">
        {label}
      </Label>

      <Popover modal={modal}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between hover:bg-white hover:border-indigo-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200",
              value.length === 0 && "text-muted-foreground",
            )}
          >
            {buttonText}
            <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0 bg-white border border-slate-200 rounded-lg shadow-xl">
          <Command>
            <CommandInput
              placeholder="Search employees…"
              className="h-9"
              onValueChange={(search) =>
                setFilter((prev) => ({ ...prev, search, autoFetch: true }))
              }
            />
            <CommandList className="max-h-60 overflow-y-auto">
              <CommandEmpty className="px-4 py-2 text-sm text-slate-500">
                No employees found
              </CommandEmpty>
              <CommandGroup>
                {options.map((opt) => {
                  const isSelected = value.includes(opt.value);
                  return (
                    <CommandItem
                      key={opt.value}
                      value={opt.label}
                      onSelect={() => {
                        onChange(
                          isSelected
                            ? value.filter((v) => v !== opt.value)
                            : [...value, opt.value],
                        );
                      }}
                      className="group cursor-pointer px-4 py-2 text-sm hover:bg-indigo-50 aria-selected:bg-indigo-50 transition-colors"
                    >
                      <Check
                        className={cn(
                          "mr-3 h-4 w-4 text-indigo-600",
                          isSelected
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-40",
                        )}
                      />
                      <span className="text-slate-700">{opt.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MultiEmployeeSelect;
