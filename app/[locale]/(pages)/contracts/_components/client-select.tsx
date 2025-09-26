// ClientSelect.tsx
import React, { useMemo, useState } from "react";
import { useClient } from "@/hooks/client/use-client";
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

type Props = {
  /** Selected client IDs */
  value: string;
  /** Fires with new array when a selection toggles */
  onChange: (ids: string) => void;
  label?: string;
  className?: string;
  modal?: boolean;
};

const ClientSelect = ({
  value,
  onChange,
  label = "Clients",
  className,
  modal = false,
}: Props) => {
  const [filter, setFilter] = useState({ search: "", autoFetch: true });
  const { clients } = useClient({ ...filter, autoFetch: true });

  /* ── transform api results ───────────────────────────────────────────── */
  const options = useMemo(() => {
    if (!clients) return [];
    return clients.results.map(
      (c: { first_name: string; last_name?: string; id: number }) => ({
        label: c.last_name
          ? `${c.first_name} ${c.last_name}`
          : c.first_name,
        value: c.id.toString(),
      }),
    );
  }, [clients]);

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
                "justify-between",
                !value && "text-muted-foreground",
                className
              )}
            >
              {value
                ? options.find(
                  (option) => option.value === value
                )?.label
                : "Select option"}
              <ChevronsUpDown className="opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-white">
          <Command>
            <CommandInput
              placeholder="Zoek medewerker..."
              className="h-9"
              onValueChange={(search) => {
                setFilter(prev => ({ ...prev, search, autoFetch: true }));
              }}
            />
            <CommandList>
              <CommandEmpty>No medewerker found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    value={option.label}
                    key={option.value}
                    onSelect={() => {
                      onChange(option.value);
                    }}
                  >
                    {option.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        option.value === value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ClientSelect;
