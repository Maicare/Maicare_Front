import Select, { SelectProps } from "@/common/components/Select";
import { SelectionOption } from "@/common/components/UncontrolledCheckboxGroup";
import { useRole } from "@/hooks/role/use-role";
import { FunctionComponent, useMemo } from "react";
import { useFormContext, Controller } from 'react-hook-form';

export const ControlledRoleSelect: FunctionComponent<Omit<SelectProps, "options">> = ({ name = "location_id", ...props }) => {
    const { control } = useFormContext();

    const { roles } = useRole();

    const roleOptions = useMemo<SelectionOption[]>(() => {
        if (roles) {
            const options = roles.map((role) => ({
                value: role.id + "",
                label: role.name,
            }));

            return [
                {
                    value: "",
                    label: "Selecteer een rol",
                },
            ].concat(options);
        }
        return [];

    }, [roles]);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => <Select {...props} {...field} options={roleOptions} />}
        />
    )
};