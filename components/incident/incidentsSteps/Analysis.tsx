import React from "react";
import * as Yup from "yup";
import {
  CLIENT_OPTIONS,
  MESE_WORKER_OPTIONS,
  ORGANIZATIONAL_OPTIONS,
  TECHNICAL_OPTIONS,
} from "@/consts";
import Panel from "@/components/common/Panel/Panel";
import { MultiCheckBoxInputField } from "@/components/common/MultiCheckBoxInputField/MultiCheckBoxInputField";
import InputControl from "@/common/components/InputControl";
import TextareaControlled from "@/components/common/FormFields/TextareaControlled";

export const AnalysisInitial = {
  other_cause: "",
  technical: [],
  organizational: [],
  mese_worker: [],
  client_options: [],
  cause_explanation: "",
};

export const AnalysisShema = {
  other_cause: Yup.string().required("Selecteer minstens één betrokken kind."),
};

export default function Analysis() {
  return (
    <Panel title={"3. Mogelijke oorzaak en toelichting"}>
      <div className="mb-4.5 mt-4.5 grid grid-cols-2 gap-6 px-6.5">
        <div className="flex flex-col ">
          <MultiCheckBoxInputField
            label="Technisch"
            options={TECHNICAL_OPTIONS}
            name="technical"
          />
        </div>
        <div className="flex flex-col ">
          <MultiCheckBoxInputField
            label="Organisatorish"
            options={ORGANIZATIONAL_OPTIONS}
            name="organizational"
          />
        </div>
        <div className="flex flex-col ">
          <MultiCheckBoxInputField
            label="Mesewerker"
            options={MESE_WORKER_OPTIONS}
            name="mese_worker"
          />
        </div>
        <div className="flex flex-col ">
          <MultiCheckBoxInputField
            label="Cliënt"
            options={CLIENT_OPTIONS}
            name="client_options"
          />
        </div>
        <InputControl
          className={"col-span-2"}
          name={"other_cause"}
          required
          label={"Overig"}
          type={"text"}
        />
        <TextareaControlled
          className="mb-4 col-span-2"
          rows={2}
          name={"cause_explanation"}
          label={"Toelichting op de oorzaak/oorzaken"}
        />
      </div>
    </Panel>
  );
}
