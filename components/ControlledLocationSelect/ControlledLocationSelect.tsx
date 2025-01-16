import Select, { SelectProps } from "@/common/components/Select";
import { SelectionOption } from "@/common/components/UncontrolledCheckboxGroup";
import { useLocation } from "@/hooks/location/use-location";
import { FunctionComponent, useMemo } from "react";
import { useFormContext, Controller } from 'react-hook-form';

export const ControlledLocationSelect: FunctionComponent<Omit<SelectProps, "options">> = ({ name = "location_id", ...props }) => {
    const { control } = useFormContext();

    const { locations } = useLocation();

    const locationOptions = useMemo<SelectionOption[]>(() => {
        if (locations) {
            const options = locations.map((location) => ({
                value: location.id + "",
                label: location.name,
            }));

            return [
                {
                    value: "",
                    label: "Selecteer een locatie",
                },
            ].concat(options);
        }
        return [];
    }, [locations]);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => <Select {...props} {...field} options={locationOptions} />}
        />
    )
};