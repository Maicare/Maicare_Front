import Select, { SelectProps } from "@/common/components/Select";
import { useRole } from "@/hooks/role/use-role";
import { FunctionComponent } from "react";
import { useFormContext, Controller } from "react-hook-form";
import Loader from "../common/loader";

export const ControlledRoleSelect: FunctionComponent<
  Omit<SelectProps, "options">
> = ({ name = "location_id", ...props }) => {
  const { control } = useFormContext();

  const { roles, isLoading } = useRole();
  if (isLoading) return null;
  if (!roles) return <Loader />;
  const options = roles.map((role) => ({
    value: role.id + "",
    label: role.name,
  }));
  const actualOptions = [
    {
      value: "",
      label: "Selecteer een rol",
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
