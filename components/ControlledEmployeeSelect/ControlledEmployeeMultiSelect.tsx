import React, { FunctionComponent, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import SearchableMultiSelect, { Option } from "./SearchableMultiSelect";
import { useEmployee } from "@/hooks/employee/use-employee";

type Props = {
    name: string;
    label?: string;
    className?: string;
    required?: boolean;
};

const ControlledEmployeeMultiSelect: FunctionComponent<Props> = ({
    name,
    label,
    className,
    required,
}) => {
    const { control } = useFormContext();
    // We no longer pass the search filter to useEmployee so that we always load the full list.
    // (Or you can call useEmployee with an empty filter.)
    const { employees } = useEmployee({ search: "" });
    const [filter, setFilter] = useState({ search: "" });

    return (
        <Controller
            name={name}
            defaultValue={[]} // default as empty array for multiple select
            control={control}
            render={({ field }) => {
                // Always build options from the full employees list
                const employeeOptions: Option[] = useMemo(() => {
                    if (!employees) return [];
                    return employees.results.map((emp: { first_name: string; last_name: string; id: number; }) => ({
                        label: `${emp.first_name} ${emp.last_name}`,
                        value: emp.id,
                    }));
                }, [employees]);

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
                            options={employeeOptions} // Use full list directly
                            value={field.value}
                            placeholder="Zoek medewerker..."
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

export default ControlledEmployeeMultiSelect;

