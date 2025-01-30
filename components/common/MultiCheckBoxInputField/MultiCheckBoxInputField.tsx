import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import CheckBoxInputFieldThin from "../CheckBoxInputThin/CheckBoxInputThin";

type MultiCheckBoxInputFieldType = {
  label: string;
  options: string[];
  name: string;
};

export function MultiCheckBoxInputField({
  label,
  options,
  name,
}: MultiCheckBoxInputFieldType) {
  const { control } = useFormContext();

  return (
    <div>
      <label className="mb-4 block text-slate-800 dark:text-white">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            {options.map((option_label, i) => (
              <CheckBoxInputFieldThin
                key={i}
                label={option_label}
                className="mb-3"
                name={`${name}[${i}]`}
                id={`${name}-${i}`}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const newValue = field.value ? [...field.value] : [];
                  if (e.target.checked) {
                    newValue.push(option_label);
                  } else {
                    const index = newValue.indexOf(option_label);
                    if (index > -1) {
                      newValue.splice(index, 1);
                    }
                  }
                  field.onChange(newValue);
                }}
                onBlur={field.onBlur}
                checked={field.value?.includes(option_label) || false}
              />
            ))}
          </>
        )}
      />
    </div>
  );
}
