import React, { FunctionComponent, InputHTMLAttributes } from "react";

type CheckBoxInputFieldType = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

const CheckBoxInputFieldThin: FunctionComponent<CheckBoxInputFieldType> = ({
  label,
  className,
  id,
  required,
  ...props
}) => {
  return (
    <div className={className}>
      <label className="flex-1 items-center cursor-pointer">
        <input
          type="checkbox"
          {...props}
          id={id}
          required={required}
          className="w-5 h-5 mx-2 cursor-pointer"
        />
        {label}
      </label>
    </div>
  );
};

export default CheckBoxInputFieldThin;
