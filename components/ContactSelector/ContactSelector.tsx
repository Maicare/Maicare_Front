import React, { FunctionComponent, useMemo } from "react";
import FormCombobox from "@/common/components/Combobox";
import { useContact } from "@/hooks/contact/use-contact";
import { Contact } from "@/types/contacts.types";


const ContactSelector: FunctionComponent<{
  name: string;
  className?: string;
}> = ({ name, className }) => {
  // const [query, setQuery] = useState<string>("");

  const { contacts } = useContact({autoFetch: true});

  const options = useMemo(() => {
    if (!contacts) return [];
    return contacts.results?.map((item: Contact) => ({
      value: { name: item.name, id: item.id ?? "" },
      label: item.name,
    }));
  }, [contacts]);

  return (
    <FormCombobox
      name={name}
      className={className}
      options={options}
      displayValue={(value) => value.name || ""}
      handleQueryChange={() => {
        // setQuery(e.target.value);
      }}
      label={"Opdrachtgever"}
      placeholder={"Selecteer een opdrachtgever"}
    />
  );
};

export default ContactSelector;
