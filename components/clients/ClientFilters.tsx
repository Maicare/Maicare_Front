import React, { FunctionComponent, useState } from "react";
import InputUncontrol from "@/common/components/InputUncontrol";
import  { SelectionOption } from "@/common/components/UncontrolledCheckboxGroup";
import { Id } from "@/common/types/types";
import { ClientsSearchParams } from "@/types/client.types";
import { LocationSelect } from "../employee/LocationSelect";
import Select from "@/common/components/Select";
import { STATUS_OPTIONS } from "@/consts";

type Props = {
  onFiltersChange: (filters: Partial<ClientsSearchParams>) => void;
};

const ClientFilters: FunctionComponent<Props> = ({ onFiltersChange }) => {
  const [_selected, _setSelected] = useState<SelectionOption["value"][]>([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState<Id>();

  return (
    <div className="flex flex-wrap items-center gap-8">
      <InputUncontrol
        placeholder="Zoek Medewerkers ..."
        type="search"
        className="min-w-60"
        onChange={(e) => {
          setSearch(e.target.value);
          onFiltersChange({
            search: e.target.value,
            location_id: location,
          });
        }}
      />
      <LocationSelect
        label={"Locatie"}
        className={"min-w-60 [&_label]:hidden "}
        onChange={(e) => {
          setLocation(+e.target.value || undefined);
          onFiltersChange({
            search,
            location_id: +e.target.value || undefined,
          });
        }}
      />
      <Select
        options={STATUS_OPTIONS}
        className={"min-w-60 [&_label]:hidden"}
        onChange={(selected) => {
          onFiltersChange({
            status: selected.target.value
          });
        }}
      />
    </div>
  );
};

export default ClientFilters;
