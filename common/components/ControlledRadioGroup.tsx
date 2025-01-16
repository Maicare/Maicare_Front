import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import RadioGroup from "./RadioGroup";

export type SelectionOption = {
    label: string;
    value: string;
};

interface ControlledRadioGroupProps {
    name: string;
    options: SelectionOption[];
    label?: string;
    className?: string;
}

const ControlledRadioGroup: React.FC<ControlledRadioGroupProps> = ({
    name,
    options,
    label,
    className,
}) => {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <RadioGroup
                    name={field.name}
                    picked={field.value}
                    onChange={(value: string) => field.onChange(value)}
                    options={options}
                    label={label}
                    className={className}
                    id={name}
                />
            )}
        />
    );
};

export default ControlledRadioGroup;