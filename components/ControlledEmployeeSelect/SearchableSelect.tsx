import React, { useState, useEffect, useMemo, FunctionComponent } from "react";
import { Combobox } from "@headlessui/react";
import { useDebounce } from "@/hooks/common/useDebounce";

export type Option = {
    label: string;
    value: number | string;
};

export type SearchableSelectProps = {
    options: Option[];
    value: number | string;
    onChange: (val: number | string) => void;
    placeholder?: string;
    className?: string;
    onSearchChange?: (search: string) => void;
};

const SearchableSelect: FunctionComponent<SearchableSelectProps> = ({
    options,
    value,
    onChange,
    placeholder,
    className,
    onSearchChange,
}) => {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 300);

    // Update parent when query changes (for API calls)
    useEffect(() => {
        if (onSearchChange) onSearchChange(debouncedQuery);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedQuery]);

    // Filter options based on debounced query.
    const filteredOptions = useMemo(() => {
        return options.filter((opt) =>
            opt.label.toLowerCase().includes(debouncedQuery.toLowerCase())
        );
    }, [debouncedQuery, options]);

    // Find selected option.
    const selectedOpt = options.find((opt) => opt.value === value);

    return (
        <Combobox<number | string> value={value} onChange={(val: number | string) => onChange(val)}>
            <div className={className} style={{ position: "relative" }}>
                <Combobox.Input
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-white py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    placeholder={placeholder || "Search..."}
                    // If an option is selected, display its label; otherwise show current query.
                    displayValue={() => (selectedOpt ? selectedOpt.label : query)}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Combobox.Options className="shadow absolute bg-white dark:bg-form-input z-40 left-0 rounded-lg max-h-select overflow-y-auto flex flex-col w-full">
                    {filteredOptions.map((opt) => (
                        <Combobox.Option
                            key={opt.value}
                            value={opt.value}
                            className="cursor-pointer border-stroke border-b last:border-b-0 dark:border-form-strokedark leading-6 p-3 pl-3 flex items-center"
                        >
                            {opt.label}
                        </Combobox.Option>
                    ))}
                </Combobox.Options>
            </div>
        </Combobox>
    );
};

export default SearchableSelect;