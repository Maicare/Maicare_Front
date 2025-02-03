import React from "react";

import {
  CONSULTATION_NEEDED_OPTIONS,
  INJURY_OPTIONS,
  PSYCHOLOGICAL_DAMAGE_OPTIONS,
} from "@/consts";
import * as Yup from "yup";
import Panel from "@/components/common/Panel/Panel";
import InputControl from "@/common/components/InputControl";
import SelectControlled from "@/common/components/SelectControlled";

export const ClientConsequencesInitial = {
  physical_injury_desc: "",
  psychological_damage: "",
  physical_injury: "",
  psychological_damage_desc: "",
  needed_consultation: "",
};
export const ClientConsequencesShema = {
  physical_injury_desc: Yup.string().required("shouldnt be empty "),
  physical_injury: Yup.string().required("shouldnt be empty"),
  psychological_damage: Yup.string().required("shouldnt be empty"),
  psychological_damage_desc: Yup.string().required("shouldnt be empty"),
  needed_consultation: Yup.string().required("shouldnt be empty"),
};

export default function ClientConsequences() {
  return (
    <Panel title={"4. Gevolgen"}>
      <div className="mb-4.5 mt-4.5 flex flex-col gap-6 px-6.5">
        <label className="font-bold">Gevolgen cliënt</label>
        <SelectControlled
          label={"Lichamelijjk letsel"}
          name="physical_injury"
          id="physical_injury"
          className="w-full"
          required
          options={INJURY_OPTIONS}
        />
        <InputControl
          className={"w-full"}
          name={"physical_injury_desc"}
          label={""}
          required
          type={"text"}
        />
        <SelectControlled
          label={"Psychische schade"}
          name="psychological_damage"
          id="psychological_damage"
          className="w-full"
          required={true}
          options={PSYCHOLOGICAL_DAMAGE_OPTIONS}
        />
        <InputControl
          className={"w-full"}
          name={"psychological_damage_desc"}
          label={""}
          required
          type={"text"}
        />
        <SelectControlled
          label={"Consult nodig"}
          name="needed_consultation"
          id="needed_consultation"
          className="w-full"
          required
          options={CONSULTATION_NEEDED_OPTIONS}
        />
      </div>
    </Panel>
  );
}
