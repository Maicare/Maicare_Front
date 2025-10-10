import React, { useMemo, useState } from "react";
import { useClient } from "@/hooks/client/use-client";
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

type Selection = {
  type: "client" | "employee";
  id: Id;
};

type Props = {
  value: Selection | null;
  onChange: (selection: Selection) => void;
  label?: string;
  className?: string;
  modal?: boolean;
};

const MultiPartySelect = ({
  value,
  onChange,
  label,
  className,
  modal = false,
}: Props) => {
  const [filter, setFilter] = useState({ search: "", autoFetch: true });
  const { clients } = useClient({ ...filter, autoFetch: true });
  const { employees } = useEmployee({ ...filter, autoFetch: true });

  const clientOptions = useMemo(() => {
    if (!clients) return [];
    return clients.results
      .map((c: { first_name: string; last_name?: string; id: number }) => ({
        label: c.last_name ? `${c.first_name} ${c.last_name}` : c.first_name,
        id: c.id as Id,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [clients]);

  const employeeOptions = useMemo(() => {
    if (!employees) return [];
    return employees.results
      .map(
        (e: { first_name: string; last_name: string; id: number }) => ({
          label: `${e.first_name} ${e.last_name}`,
          id: e.id as Id,
        })
      )
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [employees]);

  const selectedLabel = useMemo(() => {
    if (!value) return "";
    if (value.type === "client") {
      const found = clientOptions.find((opt) => opt.id === value.id);
      return found ? found.label : "";
    }
    if (value.type === "employee") {
      const found = employeeOptions.find((opt) => opt.id === value.id);
      return found ? found.label : "";
    }
    return "";
  }, [value, clientOptions, employeeOptions]);

  const buttonText = selectedLabel
    ? selectedLabel
    : label
      ? `Selecteer ${label.toLowerCase()}…`
      : `Filter op partij...`;

  return (
    <div className={cn("w-full" , className)}>
      {label && (
        <Label className="flex items-center justify-between text-slate-600 font-medium mb-1">
          {label}
        </Label>
      )}
      <Popover modal={modal}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between h-[35px] hover:bg-white hover:border-indigo-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200",
              !value && "text-muted-foreground"
            )}
          >
            {buttonText}
            <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-white border border-slate-200 rounded-lg shadow-xl">
          <Command>
            <CommandInput
              placeholder="Zoek cliënten of medewerkers…"
              className="h-9"
              onValueChange={(search) =>
                setFilter((prev) => ({ ...prev, search, autoFetch: true }))
              }
            />
            <CommandList className="max-h-60 overflow-y-auto">
              <CommandEmpty className="px-4 py-2 text-sm text-slate-500">
                Geen resultaten gevonden
              </CommandEmpty>
              {clientOptions.length > 0 && (
                <CommandGroup heading="Cliënten">
                  {clientOptions.map((opt) => {
                    const isSelected =
                      value?.type === "client" && value.id === opt.id;
                    return (
                      <CommandItem
                        key={`client-${opt.id}`}
                        value={opt.label}
                        onSelect={() => onChange({ type: "client", id: opt.id })}
                        className="group cursor-pointer px-4 py-2 text-sm hover:bg-indigo-50 aria-selected:bg-indigo-50 transition-colors"
                      >
                        <Check
                          className={cn(
                            "mr-3 h-4 w-4 text-indigo-600",
                            isSelected
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-40"
                          )}
                        />
                        <span className="text-slate-700">{opt.label}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}
              {employeeOptions.length > 0 && (
                <CommandGroup heading="Medewerkers">
                  {employeeOptions.map((opt) => {
                    const isSelected =
                      value?.type === "employee" && value.id === opt.id;
                    return (
                      <CommandItem
                        key={`employee-${opt.id}`}
                        value={opt.label}
                        onSelect={() =>
                          onChange({ type: "employee", id: opt.id })
                        }
                        className="group cursor-pointer px-4 py-2 text-sm hover:bg-indigo-50 aria-selected:bg-indigo-50 transition-colors"
                      >
                        <Check
                          className={cn(
                            "mr-3 h-4 w-4 text-indigo-600",
                            isSelected
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-40"
                          )}
                        />
                        <span className="text-slate-700">{opt.label}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MultiPartySelect;