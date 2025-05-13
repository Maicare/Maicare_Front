import React, { FunctionComponent, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import SearchableMultiSelect, { Option } from "../ControlledEmployeeSelect/SearchableMultiSelect";
import { useClient } from "@/hooks/client/use-client"; // adjust path/hook as needed

type Props = {
    name: string;
    label?: string;
    className?: string;
    required?: boolean;
};

const ControlledClientMultiSelect: FunctionComponent<Props> = ({
    name,
    label,
    className,
    required,
}) => {
    const { control } = useFormContext();
    // Load clients; assume useClient accepts a search param similar to useEmployee
    const { clients } = useClient({ search: "" });
    const [filter, setFilter] = useState({ search: "" });

    return (
        <Controller
            name={name}
            defaultValue={[]} // default as empty array for multiple select
            control={control}
            render={({ field }) => {
                // Build options from the full clients list
                const clientOptions: Option[] = useMemo(() => {
                    if (!clients) return [];
                    return clients.results.map((client: { first_name: string; last_name: string; id: number; }) => ({
                        label: `${client.first_name} ${client.last_name}`,
                        value: client.id,
                    }));
                }, [clients]);

                return (
                    <div style={{ marginBottom: 16, width: "100%" }}>
                        {label && (
                            <label>
                                {label}
                                {required && <span style={{ color: "red" }}> *</span>}
                            </label>
                        )}
                        <SearchableMultiSelect
                            className={className}
                            options={clientOptions}
                            value={field.value}
                            placeholder="Zoek client..."
                            onChange={(val) => field.onChange(val)}
                            onSearchChange={(search) => setFilter({ search })}
                            multiple={true}
                        />
                    </div>
                );
            }}
        />
    );
};

export default ControlledClientMultiSelect;