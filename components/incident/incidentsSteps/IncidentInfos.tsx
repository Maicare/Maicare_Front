import React from "react";
import {
  RISK_OF_RECURRENCE_OPTIONS,
  SEVERITY_OF_INCIDENT_OPTIONS,
  TYPES_INCIDENT_OPTIONS,
} from "@/consts";
import * as Yup from "yup";
import Panel from "@/components/common/Panel/Panel";
import SelectControlled from "@/common/components/SelectControlled";
import TextareaControlled from "@/components/common/FormFields/TextareaControlled";
import ControlledCheckboxItem from "@/common/components/ControlledCheckboxItem";

export const IncidentInfosInitial = {
  incident_type: "",
  passing_away: false,
  self_harm: false,
  violence: false,
  fire_water_damage: false,
  accident: false,
  client_absence: false,
  medicines: false,
  organization: false,
  use_prohibited_substances: false,
  other_notifications: false,
  incident_explanation: "",
  incident_prevent_steps: "",
  incident_taken_measures: "",
  severity_of_incident: "",
  recurrence_risk: "",
};
export const IncidentInfosShema = {
  incident_type: Yup.string().required("Moet dit veld invullen"),
  passing_away: Yup.boolean().required("Moet dit veld invullen"),
  self_harm: Yup.boolean().required("Moet dit veld invullen"),
  violence: Yup.boolean().required("Moet dit veld invullen"),
  fire_water_damage: Yup.boolean().required("Moet dit veld invullen"),
  accident: Yup.boolean().required("Moet dit veld invullen"),
  client_absence: Yup.boolean().required("Moet dit veld invullen"),
  medicines: Yup.boolean().required("Moet dit veld invullen"),
  organization: Yup.boolean().required("Moet dit veld invullen"),
  use_prohibited_substances: Yup.boolean().required("Moet dit veld invullen"),
  other_notifications: Yup.boolean().required("Moet dit veld invullen"),
  recurrence_risk: Yup.string().required("Moet dit veld invullen"),
};

export default function IncidentInfos() {
  return (
    <Panel title={"2. Infromatie over het incident"}>
      <div className="mb-4.5 mt-4.5 flex flex-col gap-6 px-6.5">
        <SelectControlled
          label={"Typ incident"}
          name="incident_type"
          id="incident_type"
          required
          options={TYPES_INCIDENT_OPTIONS}
        />
        <div className="grid grid-cols-2 gap-4">
          <ControlledCheckboxItem
            label={"Overlijden"}
            name="passing_away"
            required
          />
          <ControlledCheckboxItem
            label={"Zelfbeschadiging"}
            name="self_harm"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ControlledCheckboxItem
            label={"Agressie/geweld"}
            name="violence"
            required
          />
          <ControlledCheckboxItem
            label={"Brand- en waterschade"}
            name="fire_water_damage"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ControlledCheckboxItem
            label={"Ongevallen"}
            name="accident"
            required
          />
          <ControlledCheckboxItem
            label={"Afwezigheid client"}
            name="client_absence"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ControlledCheckboxItem
            label={"Medicijnen"}
            name="medicines"
            required
          />
          <ControlledCheckboxItem
            label={"Organisatie"}
            name="organization"
            required
          />
          <ControlledCheckboxItem
            label={"Gebruik verboden middelen"}
            name="use_prohibited_substances"
            required
          />
          <ControlledCheckboxItem
            label={"Overige meldingen"}
            name="other_notifications"
            required
          />
        </div>
      </div>
      <div className="px-6.5">
        <label className="font-bold">Ernst van incident en maatregelen</label>
        <SelectControlled
          className="my-4"
          label={"ernst incident"}
          name="severity_of_incident"
          id="severity_of_incident"
          required
          options={SEVERITY_OF_INCIDENT_OPTIONS}
        />
        <TextareaControlled
          className="mb-4"
          rows={2}
          name={"incident_explanation"}
          label={"Toelichting op het incident"}
        />
        <SelectControlled
          className="mb-4"
          label={"Is er risico op herhaling?"}
          name="recurrence_risk"
          id="recurrence_risk"
          required
          options={RISK_OF_RECURRENCE_OPTIONS}
        />

        <TextareaControlled
          className="mb-4"
          rows={2}
          name={"incident_prevent_steps"}
          label={"Welke stappen zijin ondernomen om het incident te voorkomen"}
        />

        <TextareaControlled
          className="mb-4"
          rows={2}
          name={"incident_taken_measures"}
          label={
            "Welke maatregelen zijn genomen na het plaatsvinden van het incident"
          }
        />
      </div>
    </Panel>
  );
}
