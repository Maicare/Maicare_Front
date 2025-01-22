import React, { FunctionComponent, TextareaHTMLAttributes } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/utils/cn";

type TextareaFieldType = {
  name: string; // For react-hook-form integration
  label: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  required?: boolean;
};

const TextareaControlled: FunctionComponent<
  TextareaFieldType & TextareaHTMLAttributes<HTMLTextAreaElement>
> = ({
  name,
  label,
  placeholder,
  className,
  inputClassName,
  required,
  ...props
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={cn("mb-4", className)}>
      <label
        htmlFor={name}
        className="mb-2.5 block font-medium text-slate-800 dark:text-white"
      >
        {label} {required && <span className="text-meta-1">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <textarea
            {...field}
            id={name}
            placeholder={placeholder}
            className={cn(
              `w-full rounded-lg border-[1.5px] border-stroke bg-white py-3 px-5 font-medium outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`,
              inputClassName,
              errors[name] ? "border-c_red" : ""
            )}
            required={required}
            {...props}
          />
        )}
      />
      {errors[name] && (
        <p className="text-c_red pt-1">{errors[name]?.message as string}</p>
      )}
    </div>
  );
};

export default TextareaControlled;
