import Select, { SelectProps } from "@/common/components/Select";
import { FunctionComponent } from "react";
import { useFormContext, Controller } from 'react-hook-form';
import Loader from "../common/loader";
import { useDomain } from "@/hooks/domain/use-domain";

export const ControlledDomainSelect: FunctionComponent<
  Omit<SelectProps, "options">
> = ({ name = "maturity_matrix_id", ...props }) => {
  const { control } = useFormContext();

    const { domains,isLoading } = useDomain({autoFetch: true});
    if(isLoading) return null;
    if (!domains) return <Loader />;
    const options = domains.map((domain) => ({
        value: domain.id + "",
        label: domain.topic_name,
    }));
    const actualOptions = [
        {
            value: "",
            label: "Selecteer een Domein",
        },
    ].concat(options);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select {...props} {...field} options={actualOptions} />
      )}
    />
  );
};
