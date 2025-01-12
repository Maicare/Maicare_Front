import React, { FunctionComponent, ReactNode } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/utils/cn";

type InputFieldType = {
  name: string; // Add name for react-hook-form integration
  label: string;
  type: string;
  placeholder: string;
  icon?: ReactNode;
  className?: string;
};

const InputControl: FunctionComponent<InputFieldType> = ({
  name,
  label,
  className,
  icon,
  ...props
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={cn("mb-4", className)}>
      <label htmlFor={name} className="mb-2.5 block font-medium text-slate-800 dark:text-white">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="relative">
            <input
              {...field}
              id={name}
              className={cn(
                "w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                errors[name] ? "border-c_red" : ""
              )}
              {...props}
            />
            {icon && <span className="absolute right-4 top-4">{icon}</span>}
          </div>
        )}
      />
      {errors[name] && (
        <p className="text-c_red pt-1">{errors[name]?.message as string}</p>
      )}
    </div>
  );
};
export default InputControl;