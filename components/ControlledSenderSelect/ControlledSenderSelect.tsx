import Select, { SelectProps } from "@/common/components/Select";
import { SelectionOption } from "@/common/components/UncontrolledCheckboxGroup";
import { useContact } from "@/hooks/contact/use-contact";
import { FunctionComponent, useMemo } from "react";
import { useFormContext, Controller } from 'react-hook-form';

export const ControlledSenderSelect: FunctionComponent<Omit<SelectProps, "options">> = ({ name="sender_id" , ...props }) => {
    const { control } = useFormContext();

    const { contacts } = useContact({autoFetch: true}); 

    const locationOptions = useMemo<SelectionOption[]>(() => {
        if (contacts?.results) {
            const options = contacts?.results.map((constact) => ({
                value: constact.id + "",
                label: constact.name,
            }));

            return [
                {
                    value: "",
                    label: "Selecteer een locatie",
                },
            ].concat(options);
        }
        return [];
    }, [contacts?.results]);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => <Select {...props} {...field} options={locationOptions} />}
        />
    )
};