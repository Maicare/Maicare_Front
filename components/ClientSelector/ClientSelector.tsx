import React, { FunctionComponent, useMemo, useState } from "react";
import { useClient } from "@/hooks/client/use-client";
import { Client, ClientsSearchParams } from "@/types/client.types";
import { Any } from "@/common/types/types";
import FormCombobox from "@/common/components/Combobox";

type Props = {
  name: string;
  className?: string;
};

const ClientSelector: FunctionComponent<Props> = ({ name, className }) => {
  const [filter, setFilter] = useState({
    search: "",
  });
  const { clients: data } = useClient({})
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
    <FormCombobox
      name={name}
      className={className}
      placeholder={"Zoek Cliënt..."}
      options={options}
      displayValue={(value: Client) => value.first_name + " " + value.last_name}
      handleQueryChange={(e: Any) => {
        const search = e.target.value;
        setFilter({ ...filter, search });
      }}
      label={"Cliënt"}
    />
  );
};

export default ClientSelector;
