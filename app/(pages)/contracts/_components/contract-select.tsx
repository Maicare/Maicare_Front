// ContractSelect.tsx
import React, { useMemo, useState } from "react";
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
import { useContract } from "@/hooks/contract/use-contract";
import { ContractResults } from "./columns";

type Props = {
  /** Selected client IDs */
  value: string;
  /** Fires with new array when a selection toggles */
  onChange: (ids: string) => void;
  label?: string;
  className?: string;
  clientId: string; // clientId to filter contracts
  modal?: boolean;
  getSelectedItem?: (item: ContractResults ) => void;
};

const ContractSelect = ({
  value,
  onChange,
  label = "Contracts",
  className,
  modal = false,
  clientId,
  getSelectedItem
}: Props) => {
  const [filter, setFilter] = useState({ search: "", autoFetch: true,clientId: clientId });
  const { contracts } = useContract({ ...filter, autoFetch: true });

  /* ── transform api results ───────────────────────────────────────────── */
  const options = useMemo(() => {
    if (!contracts) return [];
    return contracts.results.map(
      ({ care_name,id,care_type }) => ({
        label: `${care_name} (${care_type})`,
        value: id.toString(),
      }),
    );
  }, [contracts]);

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
              placeholder="Zoek contracts..."
              className="h-9"
              onValueChange={(search) => {
                setFilter(prev => ({ ...prev, search, autoFetch: true }));
              }}
            />
            <CommandList>
              <CommandEmpty>No contracts found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    value={option.label}
                    key={option.value}
                    onSelect={() => {
                      onChange(option.value);
                      getSelectedItem?.(contracts?.results.find(
                        (item) => item.id.toString() === option.value
                      ) as ContractResults);
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

export default ContractSelect;
