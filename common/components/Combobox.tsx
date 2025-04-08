import React, { ChangeEvent, InputHTMLAttributes, useCallback, useMemo } from "react";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from "@headlessui/react";
import { cn } from "@/utils/cn";
import { BaseObject, ComboboxOption as ComboboxOptionType } from "@/types/selection-option.types";

type Props<T extends BaseObject> = InputHTMLAttributes<HTMLInputElement> & {
  options: ComboboxOptionType<T>[];
  handleQueryChange: (event: ChangeEvent<HTMLInputElement>) => void;
  renderOption?: (option: ComboboxOptionType<T>) => React.ReactNode;
  displayValue?: (value: T) => string;
  label: string;
  value?: string; // The currently selected ID
  onChange?: (value: string) => void;
};

function FormCombobox<T extends BaseObject>({
  className,
  label,
  handleQueryChange,
  options,
  renderOption,
  displayValue,
  value,
  onChange,
  ...inputProps
}: Props<T>) {
  const optionsMap = useMemo<Record<string, T>>(() => {
    return options.reduce((acc, option) => {
      acc[option.value.id] = option.value;
      return acc;
    }, {} as Record<string, T>);
  }, [options]);

  const getDisplayValue = useCallback(
    (id: string) => {
      if (displayValue) {
        const valueObj = optionsMap[id];
        return valueObj ? displayValue(valueObj) || "" : "";
      }
      return "";
    },
    [displayValue, optionsMap]
  );

  return (
    <Combobox
      as="section"
      className={cn("relative", className)}
      value={value}
      onChange={onChange}
    >
      <Label className="mb-2.5 block text-black dark:text-white" htmlFor={inputProps.id}>
        {label} {inputProps.required && <span className="text-meta-1">*</span>}
      </Label>
      <ComboboxInput
        displayValue={getDisplayValue}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-white py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default"
        {...inputProps}
        onChange={handleQueryChange}
      />
      <ComboboxOptions className="shadow absolute bg-white dark:bg-form-input z-40 left-0 rounded-lg max-h-select overflow-y-auto flex flex-col w-full">
        {options.map((option) => (
          <ComboboxOption
            className="cursor-pointer border-b border-stroke dark:border-form-strokedark leading-6 p-3 pl-3 flex items-center"
            key={option.value.id}
            value={option.value.id}
          >
            {renderOption ? renderOption(option) : option.label}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  );
}

export default FormCombobox;
