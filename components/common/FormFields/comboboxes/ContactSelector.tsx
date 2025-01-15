import React, { FunctionComponent, useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useContacts } from "@/utils/contacts/getContactList";
import FormikCombobox from "@/components/FormFields/Combobox";

const ContactSelector: FunctionComponent<{
  name: string;
  className?: string;
}> = ({ name, className }) => {
  const [query, setQuery] = useState<string>("");
  const debounceQuery = useDebounce(query, 300);
  const { data } = useContacts(debounceQuery);
  const options = useMemo(() => {
    if (!data) return [];
    return data.results?.map((item) => ({
      value: item,
      label: item.name,
    }));
  }, [data]);

  return (
    <FormikCombobox
      name={name}
      className={className}
      options={options}
      displayValue={(value) => value.name}
      handleQueryChange={(e) => {
        setQuery(e.target.value);
      }}
      label={"Opdrachtgever"}
      placeholder={"Selecteer een opdrachtgever"}
    />
  );
};

export default ContactSelector;
