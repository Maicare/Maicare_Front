import { cn } from "@/utils/cn";
import React, { FunctionComponent, TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  placeholder?: string;
  inputClassName?: string;
  error?: any;
};

const Textarea: FunctionComponent<Props> = ({
  label,
  id,
  className = "",
  inputClassName = "",
  required,
  error,
  ...props
}) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2.5 block text-slate-800  dark:text-white">
        {label} {required && <span className="text-meta-1">*</span>}
      </label>
      <textarea
        {...props}
        required={required}
        id={id}
        className={cn(
          `w-full rounded-lg border-[1.5px] border-stroke py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary bg-white`,
          inputClassName
        )}
      ></textarea>
      {error && (
        <p role="alert" className="pt-1 text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Textarea;
