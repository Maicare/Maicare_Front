import React, { FunctionComponent } from "react";
import { useFormContext, Controller } from "react-hook-form";
import ChevronDown from "@/components/icons/ChevronDown";
import { SelectionOption } from "./UncontrolledCheckboxGroup";
import { cn } from "@/utils/cn";

export type SelectProps = {
  name: string;
  label: string;
  options: SelectionOption[];
  className?: string;
  id?: string;
  required?: boolean;
};

const SelectControlled: FunctionComponent<SelectProps> = ({
  name,
  label,
  options,
  className,
  id,
  required,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={cn("mb-4", className)}>
      <label htmlFor={id || name} className="mb-2.5 block text-slate-800 dark:text-white">
        {label} {required && <span className="text-meta-1">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="relative z-20">
            <select
              {...field}
              id={id || name}
              required={required}
              className={cn(
                "relative z-20 w-full appearance-none rounded-lg border border-stroke bg-white py-2 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                errors[name] ? "border-c_red" : ""
              )}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2 pointer-events-none">
              <ChevronDown />
            </span>
          </div>
        )}
      />
      {errors[name] && (
        <p role="alert" className="text-c_red pt-1">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default SelectControlled;
