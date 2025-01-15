import React, { FunctionComponent, useMemo, useState } from "react";
import { ClientsSearchParams } from "@/types/clients/clients-search-params";
import { useClientsList } from "@/utils/clients/getClientsList";
import Combobox from "@/components/FormFields/Combobox";

type Props = {
  name: string;
  className?: string;
};

const ClientSelector: FunctionComponent<Props> = ({ name, className }) => {
  const [filter, setFilter] = useState<ClientsSearchParams>({
    search: "",
  });
  const { data } = useClientsList(filter);
  const options = useMemo(() => {
    if (!data) {
      return [];
    }
    return data?.results.map((client) => ({
      label: client.first_name + " " + client.last_name,
      value: client,
    }));
  }, [data]);
  return (
    <Combobox
      name={name}
      className={className}
      placeholder={"Zoek Cliënt..."}
      options={options}
      displayValue={(value) => value.first_name + " " + value.last_name}
      handleQueryChange={(e) => {
        const search = e.target.value;
        setFilter({ ...filter, search });
      }}
      label={"Cliënt"}
    />
  );
};

export default ClientSelector;
