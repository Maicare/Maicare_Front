
import React, { FunctionComponent, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useEmployee } from "@/hooks/employee/use-employee";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Info } from "lucide-react";
import { cn } from "@/utils/cn";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import Tooltip from "@/common/components/Tooltip";

type Props = {
    name: string;
    label?: string;
    className?: string;
    required?: boolean;
};

export const EmployeeSelect: FunctionComponent<Props> = ({
    name,
    className,
}) => {
    const form = useFormContext();
    const [filter, setFilter] = useState({ search: "", autofetch: true });
    const { employees } = useEmployee(filter);
    // Build options from employees
    const options = useMemo(() => {
        if (!employees) return [];
        return employees.results.map((emp: { first_name: string; last_name: string; id: number; }) => ({
            label: `${emp.first_name} ${emp.last_name}`,
            value: `${emp.id}`,
        }));
    }, [employees]);

    return (
        <FormField
            name={name}
            defaultValue={0} // or null, depending on your defaults
            control={form.control}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="flex items-center justify-between">
                        Medewerker
                        <Tooltip text='This is Locatie '>
                            <Info className='h-5 w-5 mr-2' />
                        </Tooltip>
                    </FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "justify-between",
                                        !field.value && "text-muted-foreground",
                                        className
                                    )}
                                >
                                    {field.value
                                        ? options.find(
                                            (option) => option.value === field.value
                                        )?.label
                                        : "Select option"}
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0 bg-white">
                            <Command>
                                <CommandInput
                                    placeholder="Zoek medewerker..."
                                    className="h-9"
                                    onValueChange={(search) => {
                                        setFilter(prev => ({ ...prev, search }));
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
                                                    form.setValue(name, option.value)
                                                }}
                                            >
                                                {option.label}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        option.value === field.value
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
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default EmployeeSelect;