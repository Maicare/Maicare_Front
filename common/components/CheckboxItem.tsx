import React, { FunctionComponent, InputHTMLAttributes } from "react";
import CheckIcon from "@/components/icons/CheckIcon";
import { cn } from "@/utils/cn";
import "../../app/globals.css";
interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const CheckboxItem: FunctionComponent<Props> = ({ id, label, ...props }) => {
  return (
    <label htmlFor={id} className="flex cursor-pointer pt-1">
      <div className="relative  !pt-[2px]">
        <input type="checkbox" {...props} id={id} className="sr-only taskCheckbox" />
        <div
          className={cn("flex items-center justify-center w-5 h-5 mr-3 border rounded box",
            props.checked ? "border-primary bg-primary dark:border-primary" : "border-stroke dark:border-strokedark",
          )}
        >
          <span
            className={cn("text-white dark:text-white",
              props.checked ? "opacity-100" : "opacity-0",
            )}
            aria-hidden="true"
          >
            <CheckIcon />
          </span>
        </div>
      </div>
      <p>{label}</p>
    </label>
  );
};

export default CheckboxItem;
