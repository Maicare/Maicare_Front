import Select, { SelectProps } from "@/common/components/Select";
import { SelectionOption } from "@/common/components/UncontrolledCheckboxGroup";
import { useLocation } from "@/hooks/location/use-location";
import { FunctionComponent, useMemo } from "react";

export const LocationSelect: FunctionComponent<Omit<SelectProps, "options">> = (props) => {
    const {locations} = useLocation();
    const locationOptions = useMemo<SelectionOption[]>(() => {
      if (locations) {
        const options = locations.map((location) => ({
          value: location.id + "",
          label: location.name,
        }));
  
        return [
          {
            value: "",
            label: "Selecteer een locatie",
          },
        ].concat(options);
      }
      return [];
    }, [locations]);
    return <Select {...props} options={locationOptions} />;
  };