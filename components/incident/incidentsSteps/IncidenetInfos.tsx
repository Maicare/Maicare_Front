import React from "react";
import {
  YES_NO_OPTIONS,
  RISK_OF_RECURRENCE_OPTIONS,
  SEVERITY_OF_INCIDENT_OPTIONS,
  TYPES_INCIDENT_OPTIONS,
} from "@/consts";
import * as Yup from "yup";
import Panel from "@/components/common/Panel/Panel";
import SelectControlled from "@/common/components/SelectControlled";
import TextareaControlled from "@/components/common/FormFields/TextareaControlled";

export const IncidentInfosInitial = {
  incident_type: "",
  passing_away: "",
  self_harm: "",
  violence: "",
  fire_water_damage: "",
  accident: "",
  client_absence: "",
  medicines: "",
  organization: "",
  use_prohibited_substances: "",
  other_notifications: "",
  incident_explanation: "",
  incident_prevent_steps: "",
  incident_taken_measures: "",
  severity_of_incident: "",
  recurrence_risk: "",
};
export const IncidentInfosShema = {
  incident_type: Yup.string().required("moet dit veld invullen"),
  passing_away: Yup.string().required("moet dit veld invullen"),
  self_harm: Yup.string().required("moet dit veld invullen"),
  violence: Yup.string().required("moet dit veld invullen"),
  fire_water_damage: Yup.string().required("moet dit veld invullen"),
  accident: Yup.string().required("moet dit veld invullen"),
  client_absence: Yup.string().required("moet dit veld invullen"),
  medicines: Yup.string().required("moet dit veld invullen"),
  organization: Yup.string().required("moet dit veld invullen"),
  use_prohibited_substances: Yup.string().required("moet dit veld invullen"),
  other_notifications: Yup.string().required("moet dit veld invullen"),
  recurrence_risk: Yup.string().required("moet dit veld invullen"),
};

export default function IncidentInfos() {
  return (
    <Panel title={"2. Infromatie over het incident"}>
      <div className="mb-4.5 mt-4.5 flex flex-col gap-6 px-6.5">
        <SelectControlled
          label={"Type incident"}
          name="incident_type"
          id="incident_type"
          required
          options={TYPES_INCIDENT_OPTIONS}
        />
        <div className="grid grid-cols-2 gap-4">
          <SelectControlled
            label={"Overlijden"}
            name="passing_away"
            id="passing_away"
            required
            options={YES_NO_OPTIONS}
          />
          <SelectControlled
            label={"Zelfbeschadiging"}
            name="self_harm"
            id="self_harm"
            required
            options={YES_NO_OPTIONS}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SelectControlled
            label={"Agressie/geweld"}
            name="violence"
            id="violence"
            required
            options={YES_NO_OPTIONS}
          />
          <SelectControlled
            label={"Brand- en waterschade"}
            name="fire_water_damage"
            id="fire_water_damage"
            required
            options={YES_NO_OPTIONS}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <SelectControlled
            label={"Ongevallen"}
            name="accident"
            id="accident"
            required
            options={YES_NO_OPTIONS}
          />
          <SelectControlled
            label={"Afwezigheid client"}
            name="client_absence"
            id="client_absence"
            required
            options={YES_NO_OPTIONS}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <SelectControlled
            label={"Medicijnen"}
            name="medicines"
            id="medicines"
            required
            options={YES_NO_OPTIONS}
          />
          <SelectControlled
            label={"Organisatie"}
            name="organization"
            id="organization"
            required
            options={YES_NO_OPTIONS}
          />
          <SelectControlled
            className="my-4"
            label={"Gebruik verboden middelen"}
            name="use_prohibited_substances"
            id="use_prohibited_substances"
            required
            options={YES_NO_OPTIONS}
          />
          <SelectControlled
            className="my-4"
            label={"Overige meldingen"}
            name="other_notifications"
            id="other_notifications"
            required
            options={YES_NO_OPTIONS}
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
