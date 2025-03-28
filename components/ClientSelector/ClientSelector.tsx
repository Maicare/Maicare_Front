import React, { FunctionComponent, useMemo } from "react";
import { useClient } from "@/hooks/client/use-client";
import { Client } from "@/types/client.types";
import FormCombobox from "@/common/components/Combobox";

type Props = {
  name: string;
  className?: string;
  value?: string;              // controlled selected client ID
  onChange?: (value: number) => void;
};

const ClientSelector: FunctionComponent<Props> = ({ name, className, value, onChange }) => {
  const { clients: data } = useClient({});
  const options = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.results.map((client: Client) => ({
      label: `${client.first_name} ${client.last_name}`,
      value: client,
    }));
  }, [data]);

  return (
    <FormCombobox
      name={name}
      className={className}
      placeholder="Zoek Cliënt..."
      options={options}
      displayValue={(client: Client) => `${client.first_name} ${client.last_name}`}
      // For now, we do nothing on query change; you can add local filtering if needed.
      handleQueryChange={() => { }}
      label="Cliënt"
      value={value}
      // onChange={(e) => console.log(e)}
      onChange={(e) => onChange?.(typeof e === 'number' ? e : 0)}
    />
  );
};

export default ClientSelector;
