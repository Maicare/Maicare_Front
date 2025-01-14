import React, { FunctionComponent, useState } from "react";
import InputUncontrol from "@/common/components/InputUncontrol";
import UncontrolledCheckboxGroup, { SelectionOption } from "@/common/components/UncontrolledCheckboxGroup";
import { EmployeesSearchParams } from "@/types/employee.types";
import { Id } from "@/common/types/types";
import { LocationSelect } from "./LocationSelect";

const STATUS_OPTIONS: SelectionOption[] = [
  { value: "out_of_service", label: "Uit Dienst" },
  // { value: "is_archived", label: "wordt gearchiveerd" },
];

type Props = {
  onFiltersChange: (filters: Partial<EmployeesSearchParams>) => void;
};

const EmployeeFilters: FunctionComponent<Props> = ({ onFiltersChange }) => {
  const [selected, setSelected] = useState<SelectionOption["value"][]>([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState<Id>();

  return (
    <div className="flex flex-wrap items-center gap-8">
      <InputUncontrol
        placeholder="Zoek Medewerkers ..."
        type="search"
        className="lg:min-w-75"
        onChange={(e) => {
          setSearch(e.target.value);
          onFiltersChange({
            search: e.target.value,
            out_of_service: selected.includes("out_of_service"),
            location_id: location,
            is_archived: selected.includes("is_archived"),
          });
        }}
      />
      <LocationSelect
        label={"Locatie"}
        className={"lg:min-w-75 [&_label]:hidden"}
        onChange={(e) => {
          setLocation(+e.target.value || undefined);
          onFiltersChange({
            search,
            out_of_service: selected.includes("out_of_service"),
            location_id: +e.target.value || undefined,
            is_archived: selected.includes("is_archived"),
          });
        }}
      />
      <div className="flex items-center gap-2">
        <UncontrolledCheckboxGroup
          options={STATUS_OPTIONS}
          selected={selected}
          onChange={(selected) => {
            setSelected(selected);
            onFiltersChange({
              search,
              out_of_service: selected.includes("out_of_service"),
              location_id: location,
              is_archived: selected.includes("is_archived"),
            });
          }}
        />
      </div>
    </div>
  );
};

export default EmployeeFilters;
