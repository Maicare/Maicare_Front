import React, { ChangeEvent, InputHTMLAttributes, useCallback, useMemo } from "react";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from "@headlessui/react";
import { useField } from "formik";
import { cn } from "@/utils/cn";
import { BaseObject, ComboboxOption as ComboboxOptionType } from "@/types/selection-option.types";

type Props<T extends BaseObject> = InputHTMLAttributes<HTMLInputElement> & {
  options: ComboboxOptionType<T>[];
  handleQueryChange: (event: ChangeEvent<HTMLInputElement>) => void;
  renderOption?: (option: ComboboxOptionType<T>) => React.ReactNode;
  displayValue?: (value: T) => string;
  label: string;
};

function FormCombobox<T extends BaseObject>({
  className,
  label,
  handleQueryChange,
  options,
  renderOption,
  multiple,
  displayValue,
  ...inputProps
}: Props<T>) {
  // const [fieldProps, metaProps, helpers] = useField<T["id"]>({
  //   name: inputProps?.name,
  //   id: inputProps?.id,
  // });

  const optionsMap = useMemo<Record<string, T>>(() => {
    return options.reduce(
      (acc, option) => {
        acc[option.value.id] = option.value;
        return acc;
      },
      {} as Record<string, T>
    );
  }, [options]);

  const getDisplayValue = useCallback(
    (value: string) => {
      if (displayValue) {
        const valueObj = optionsMap[value];
        return valueObj ? displayValue(valueObj) || "" : "";
      }
      return "";
    }
    ,
    [displayValue, optionsMap]
  );

  return (
    <Combobox
      as="section"
      className={cn("relative", className)}
    // onChange={(value: T["id"]) => {
    //   helpers.setValue(value);
    // }}
    // onBlur={() => {
    //   helpers.setTouched(true);
    // }}
    // value={fieldProps.value}
    >
      <Label className="mb-2.5 block text-black dark:text-white" htmlFor={inputProps.id}>
        {label} {inputProps.required && <span className="text-meta-1">*</span>}
      </Label>
      <ComboboxInput
        displayValue={getDisplayValue}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-white py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        {...inputProps}
        onChange={handleQueryChange}
      />
      <ComboboxOptions className="shadow absolute bg-white dark:bg-form-input z-40 left-0 rounded-lg max-h-select overflow-y-auto flex flex-col w-full">
        {options.map((option) => (
          <ComboboxOption
            className="cursor-pointer border-stroke border-b last:border-b-0 dark:border-form-strokedark leading-6 p-3 pl-3 flex items-center ui-disabled:bg-whiter ui-disabled:text-graydark dark:ui-disabled:form-strokedark ui-active:bg-primary ui-active:text-white"
            key={option.value.id}
            value={option.value.id}
          // disabled={fieldProps.value === option.value.id}
          >
            {renderOption ? renderOption(option) : option.label}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  );
}

export default FormCombobox;
