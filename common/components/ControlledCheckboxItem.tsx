import { FC, InputHTMLAttributes } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import CheckboxItem from './CheckboxItem';

interface ControlledCheckboxItemProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label: string;
}

const ControlledCheckboxItem: FC<ControlledCheckboxItemProps> = ({ name, label, ...props }) => {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <CheckboxItem
                    id={name}
                    label={label}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    {...props}
                />
            )}
        />
    );
};

export default ControlledCheckboxItem;