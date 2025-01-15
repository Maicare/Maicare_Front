import React, { FunctionComponent, useMemo, useState } from "react";
import Combobox from "@/components/FormFields/Combobox";
import { useEmployeesList } from "@/utils/employees/getEmployeesList";
import { EmployeesSearchParams } from "@/types/employees/employees-search-params";

type Props = {
  name: string;
  label?: string;
  className?: string;
  required?: boolean;
};

const EmployeeSelector: FunctionComponent<Props> = ({ name, className, label, required }) => {
  const [filter, setFilter] = useState<EmployeesSearchParams>({
    search: "",
    out_of_service: false,
  });
  const { data } = useEmployeesList(filter);
  const options = useMemo(() => {
    if (!data) {
      return [];
    }
    return data?.results.map((employee) => ({
      label: employee.first_name + " " + employee.last_name,
      value: employee,
    }));
  }, [data]);
  return (
    <Combobox
      name={name}
      className={className}
      placeholder={"Zoek medewerker..."}
      options={options}
      displayValue={(value) => value.first_name + " " + value.last_name}
      handleQueryChange={(e) => {
        const search = e.target.value;
        setFilter({ ...filter, search });
      }}
      required={required}
      label={label ?? "Medewerker"}
    />
  );
};

export default EmployeeSelector;
