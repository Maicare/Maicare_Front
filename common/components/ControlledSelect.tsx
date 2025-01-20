import Select, { SelectProps } from "@/common/components/Select";
import { SelectionOption } from "@/common/components/UncontrolledCheckboxGroup";
import { FunctionComponent } from "react";
import { useFormContext, Controller } from 'react-hook-form';

export const ControlledSelect: FunctionComponent<Omit<SelectProps, "options"> & { options: SelectionOption[] }> = ({ name, options, ...props }) => {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => <Select {...props} {...field} options={options} />}
        />
    )
};