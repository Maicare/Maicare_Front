import React from "react";

import { EMPLOYEE_ABSENTEEISM_OPTIONS, SUCCESSION_OPTIONS } from "@/consts";
import * as Yup from "yup";
import Panel from "@/components/common/Panel/Panel";
import { MultiCheckBoxInputField } from "@/components/common/MultiCheckBoxInputField/MultiCheckBoxInputField";
import CheckBoxInputFieldThin from "@/components/common/CheckBoxInputThin/CheckBoxInputThin";
import InputControl from "@/common/components/InputControl";
import TextareaControlled from "@/components/common/FormFields/TextareaControlled";
import SelectControlled from "@/common/components/SelectControlled";

export const SuccessionInitital = {
  succession: [],
  succession_desc: "",
  other: false,
  other_desc: "",
  additional_appointments: "",
  employee_absenteeism: "",
};
export const SuccessionShema = {
  succession_desc: Yup.string().required("moet dit veld invullen"),
  other_desc: Yup.string().required("moet dit veld invullen"),
  employee_absenteeism: Yup.string().required("moet dit veld invullen"),
};

export default function Succession() {
  return (
    <Panel title={"5. Opvolging"}>
      <div className="mb-4.5 mt-4.5 flex flex-col gap-6 px-6.5">
        <div className="flex flex-col ">
          <MultiCheckBoxInputField
            label="Opvolging"
            options={SUCCESSION_OPTIONS}
            name="succession"
          />
          <InputControl
            className={"w-full"}
            name={"succession_desc"}
            required
            label=""
            type={"text"}
          />
          <CheckBoxInputFieldThin
            label={"overige, nL."}
            className="my-3"
            name={"other"}
            id={"other"}
          />
          <InputControl
            className={"w-full"}
            name={"other_desc"}
            label=""
            required
            type={"text"}
          />
          <TextareaControlled
            className="mb-4 col-span-2"
            rows={2}
            name={"additional_appointments"}
            label={"Aanvullende afspraken"}
          />
          <SelectControlled
            label={"Ziekteverzuim medewerker antwoord wissen"}
            name="employee_absenteeism"
            id="employee_absenteeism"
            className="w-full"
            required
            options={EMPLOYEE_ABSENTEEISM_OPTIONS}
          />
        </div>
      </div>
    </Panel>
  );
}
