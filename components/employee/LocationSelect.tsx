import Select, { SelectProps } from "@/common/components/Select";
import { SelectionOption } from "@/common/components/UncontrolledCheckboxGroup";
import { useLocation } from "@/hooks/location/use-location";
import { FunctionComponent, useEffect, useMemo } from "react";

export const LocationSelect: FunctionComponent<Omit<SelectProps, "options">> = (props) => {
  const { locations } = useLocation({autoFetch: true});
  
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

  // Set default value to first location when locations are loaded
  useEffect(() => {
    if (locations && locations.length > 0 && !props.value) {
      const firstLocationId = locations[0].id + "";
      // Trigger onChange with the first location's ID
      const syntheticEvent = {
        target: { value: firstLocationId },
        currentTarget: { value: firstLocationId }
      } as React.ChangeEvent<HTMLSelectElement>;
      props.onChange?.(syntheticEvent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations, props.value, props.onChange]);

  return <Select {...props} options={locationOptions} />;
};