"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/utils/cn"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

interface MultiSelectComboboxProps {
    options: { value: string; label: string }[]
    selectedValues: string[]
    onSelect: (values: string[]) => void
    placeholder?: string
    searchPlaceholder?: string
    emptyText?: string
    className?: string
}

export function MultiSelectCombobox({
    options,
    selectedValues,
    onSelect,
    placeholder = "Select options...",
    searchPlaceholder = "Search...",
    emptyText = "No options found.",
    className,
}: MultiSelectComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const [searchValue, setSearchValue] = React.useState("");

    const handleSelect = (currentValue: string) => {
        const newSelectedValues = selectedValues.includes(currentValue)
            ? selectedValues.filter((value) => value !== currentValue)
            : [...selectedValues, currentValue]
        onSelect(newSelectedValues);
        setSearchValue("");
    }

    const removeValue = (valueToRemove: string, e: React.MouseEvent) => {
        e.stopPropagation()
        onSelect(selectedValues.filter((value) => value !== valueToRemove))
    }
    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchValue.toLowerCase())
    );
    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        console.log("first  a")
        if (e.key === "Backspace" && searchValue === "") {
            onSelect(selectedValues.slice(0, -1));
            console.log("first")
        } else if (e.key === " " || e.key === "Enter") {
            const trimmedQuery = searchValue.trim();
            console.log("first  c")

            if (trimmedQuery && isValidEmail(trimmedQuery)) {
                e.preventDefault();
                if (!selectedValues.includes(trimmedQuery)) {
                    onSelect([...selectedValues, trimmedQuery]);
                }
                setSearchValue("");
            }
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between p-2 h-auto", className)}
                    id="combobox-button-emails"
                >
                    <div className="flex flex-wrap gap-1 overflow-hidden">
                        {selectedValues.length > 0 ? (
                            selectedValues.map((value) => {
                                return (
                                    <Badge
                                        key={value}
                                        variant="destructive"
                                        className="mr-1 rounded-md bg-indigo-500/30 hover:bg-red-300"
                                        onClick={(e) => removeValue(value, e)}
                                    >
                                        {value}
                                        <span className="ml-1 cursor-pointer">×</span>
                                    </Badge>
                                )
                            })
                        ) : (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-white">
                <Command>
                    <CommandInput
                        placeholder={searchPlaceholder}
                        value={searchValue}
                    onKeyDown={(e)=>handleKeyDown(e)}
                        onValueChange={setSearchValue}
                    />
                    <CommandEmpty>{emptyText}</CommandEmpty>
                    <CommandGroup className="max-h-60 overflow-auto">
                        {filteredOptions.map((option) => {
                            const isSelected = selectedValues.includes(option.value)
                            return (
                                <CommandItem
                                    key={option.value}
                                    onSelect={() => handleSelect(option.value)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            isSelected ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            )
                        })}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}