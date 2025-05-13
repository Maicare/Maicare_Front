import React, { useState, useEffect, useMemo, FunctionComponent } from "react";
import { Combobox } from "@headlessui/react";
import { useDebounce } from "@/hooks/common/useDebounce";

export type Option = {
    label: string;
    value: number | string;
};

export type SearchableSelectProps = {
    options: Option[];
    // For multiple selections, value is an array of employee IDs (number|string)
    value: (number | string)[];
    onChange: (val: (number | string)[]) => void;
    placeholder?: string;
    className?: string;
    onSearchChange?: (search: string) => void;
    multiple?: boolean;
};

const SearchableMultiSelect: FunctionComponent<SearchableSelectProps> = ({
    options,
    value,
    onChange,
    placeholder,
    className,
    onSearchChange,
    multiple = false,
}) => {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        if (onSearchChange) onSearchChange(debouncedQuery);
    }, [debouncedQuery]);

    const filteredOptions = useMemo(() => {
        return options.filter((opt) =>
            opt.label.toLowerCase().includes(debouncedQuery.toLowerCase())
        );
    }, [debouncedQuery, options]);

    return (
        <Combobox
            value={value}
            onChange={(selected: (number | string)[]) => onChange(selected)}
            multiple={multiple}
        >
            {/* Outer container */}
            <div className={`relative w-full ${className || ""}`}>
                <Combobox.Input
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-white py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                    placeholder={placeholder || "Zoek medewerker..."}
                    // We set displayValue to an empty string as we're rendering selections below
                    displayValue={() => ""}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {/* Render selected options as chips below the input */}
                <div className="mt-2 flex flex-wrap gap-2">
                    {value.map((val) => {
                        const selectedOpt = options.find((opt) => opt.value === val);
                        if (!selectedOpt) return null;
                        return (
                            <span
                                key={selectedOpt.value}
                                className="flex items-center rounded bg-blue-100 px-2 py-1 text-blue-800"
                            >
                                {selectedOpt.label}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onChange(value.filter((item) => item !== selectedOpt.value));
                                    }}
                                    className="ml-1 font-bold"
                                >
                                    &times;
                                </button>
                            </span>
                        );
                    })}
                </div>
                <Combobox.Options className="shadow absolute bg-white z-40 left-0 rounded-lg max-h-60 overflow-y-auto flex flex-col w-full">
                    {filteredOptions.map((opt) => (
                        <Combobox.Option
                            key={opt.value}
                            value={opt.value}
                            className="cursor-pointer p-3 border-b last:border-b-0"
                        >
                            {opt.label}
                        </Combobox.Option>
                    ))}
                </Combobox.Options>
            </div>
        </Combobox>
    );
};

export default SearchableMultiSelect;