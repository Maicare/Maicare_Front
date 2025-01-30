import React, { useEffect, useState } from "react";

import { INFORM_WHO_OPTIONS, REPORTER_INVOLVEMENT_OPTIONS } from "@/consts";
import * as Yup from "yup";
import { useLocation } from "@/hooks/location/use-location";
import Panel from "@/components/common/Panel/Panel";
import { MultiCheckBoxInputField } from "@/components/common/MultiCheckBoxInputField/MultiCheckBoxInputField";
import InputControl from "@/common/components/InputControl";
import SelectControlled from "@/common/components/SelectControlled";

export const GeneralInfosInitial = {
  employee_first_name: "",
  employee_last_name: "",
  employee_position: "",
  location_id: 0,
  reporter_involvement: "",
  runtime_incident: "",
  incident_date: "",
  inform_who: [],
};

export const GeneralInfosShema = {
  employee_first_name: Yup.string().required("shouldn t be empty"),
  employee_last_name: Yup.string().required("shouldn t be empty"),
  employee_position: Yup.string().required("shouldn t be empty"),
  location_id: Yup.number().required("shouldn t be empty"),
  reporter_involvement: Yup.string().required("shouldn t be empty"),
  runtime_incident: Yup.string().required("shouldn t be empty"),
  incident_date: Yup.string().required("shouldn t be empty"),
};

export default function GeneralInfos() {
  const { locations: locationLists, isLoading } = useLocation();
  const [locationOptions, setlocationOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    if (!isLoading && locationLists) {
      const _options = [{ label: "Selecter locatie", value: "" }];
      locationLists.map((location) =>
        _options.push({
          label: `${location.name} - ${location.address}`,
          value: `${location.id}`,
        })
      );
      setlocationOptions(_options);
    }
  }, [isLoading]);

  return (
    <Panel title={"1. Algemene informatie"}>
      <div className="mb-4.5 mt-4.5 flex flex-col gap-6 px-6.5">
        <InputControl
          className={"w-full"}
          name={"employee_first_name"}
          required
          label={"Voornaam betrokken medewerker(s)"}
          type={"text"}
        />
        <InputControl
          className={"w-full"}
          name={"employee_last_name"}
          required
          label={"achternaam betrokken medewerker(s)"}
          type={"text"}
        />
        <InputControl
          className={"w-full"}
          name={"employee_position"}
          required
          label={"functie betrokken medewerker(s)"}
          type={"text"}
        />
        <SelectControlled
          label={"Locatie zorgorganistie"}
          name="location_id"
          id={"location_id"}
          className="w-full"
          required
          options={locationOptions}
        />
        <SelectControlled
          label={"Betrokenheid melder"}
          name="reporter_involvement"
          id="reporter_involvement"
          className="w-full"
          required
          options={REPORTER_INVOLVEMENT_OPTIONS}
        />
        <div className="flex flex-col ">
          <MultiCheckBoxInputField
            label="Wie moet geinformeerd worden?"
            options={INFORM_WHO_OPTIONS}
            name="inform_who"
          />
        </div>
        <InputControl
          className={"w-full"}
          name={"incident_date"}
          required
          label={"Datum ontstaan incident"}
          type={"date"}
        />
        <InputControl
          className={"w-full"}
          name={"runtime_incident"}
          required
          label={"Runtime incident"}
          type={"text"}
        />
      </div>
    </Panel>
  );
}
