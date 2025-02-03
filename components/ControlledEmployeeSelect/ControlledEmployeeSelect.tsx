// This wraps the SearchableSelect with react-hook-form's Controller
// and calls the useEmployee hook to load employees based on search.

import React, { FunctionComponent, useMemo, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import SearchableSelect from "./SearchableSelect";
import { useEmployee } from "@/hooks/employee/use-employee";

type Props = {
    name: string;
    label?: string;
    className?: string;
    required?: boolean;
};

export const ControlledEmployeeSelect: FunctionComponent<Props> = ({
    name,
    className,
    label,
    required,
}) => {
    const { control } = useFormContext();
    const [filter, setFilter] = useState({ search: "" });
    const { employees } = useEmployee(filter);

    // Build options from employees
    const options = useMemo(() => {
        if (!employees) return [];
        return employees.results.map((emp: { first_name: string; last_name: string; id: number; }) => ({
            label: `${emp.first_name} ${emp.last_name}`,
            value: emp.id,
        }));
    }, [employees]);

    return (
        <Controller
            name={name}
            defaultValue={0} // or null, depending on your defaults
            control={control}
            render={({ field }) => (
                <div style={{ marginBottom: 16 }}>
                    {label && (
                        <label>
                            {label}
                            {required && <span style={{ color: "red" }}> *</span>}
                        </label>
                    )}
                    <SearchableSelect
                        className={className}
                        options={options}
                        value={field.value}
                        placeholder="Zoek medewerker..."
                        onChange={(val) => field.onChange(val)}
                        onSearchChange={(search) => setFilter({ search })}
                    />
                </div>
            )}
        />
    );
};

export default ControlledEmployeeSelect;