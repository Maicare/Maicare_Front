import { SelectionOption } from "@/common/types/selection-option.types";

export const BUTTON_CLASS_NAMES = {
  Primary: "bg-primary text-white",
  Secondary: "bg-secondary text-white",
  Danger: "bg-danger text-white",
  Success: "bg-success text-white",
  Outline: "bg-transparent border border-primary text-primary",
  //type error fix for Button.tsx
  Dark: "bg-dark text-white",
  Light: "bg-light text-dark",
  Gray: "bg-gray text-white",
  Warning: "bg-warning text-white",
  Info: "bg-info text-white",
};

export const GENDER_OPTIONS: SelectionOption[] = [
  {
    label: "Man",
    value: "male",
  },
  {
    label: "Vrouw",
    value: "female",
  },
  {
    label: "Niet gespecificeerd",
    value: "not_specified",
  },
];

// TODO: this is assumed to be 10, it should come from the backend
export const PAGE_SIZE = 10;

export const DIAGNOSIS_SEVERITY_ARRAY = ["Mild", "Moderate", "Severe"] as const;

export const ALLERGY_TYPE_ARRAY = [
  "Voedsel",
  "Medicijn",
  "Insect",
  "Latex",
  "Schimmel",
  "Huisdier",
  "Pollen",
  "Overig",
] as const;

export const EMPLOYEE_ASSIGNMENT_RECORD = {
  care_nurse: "Verzorging / Verpleging",
  first_responsible: "Eerst Verantwoordelijke",
  mentor: "Mentor",
  personal_coach: "Persoonlijke Coach",
  care_coordinator: "Zorgcoördinator",
  outpatient_counselor: "Ambulant Begeleider",
  "co-mentor": "Co-Mentor",
  program_counselor: "Trajectbegeleider",
};

export const DOCUMENT_LABELS = {
  registration_form: "Registratieformulier",
  intake_form: "Intakeformulier",
  consent_form: "Toestemmingsformulier",
  risk_assessment: "Risicoanalyse",
  self_reliance_matrix: "Zelfredzaamheidsmatrix",
  force_inventory: "Force Inventaris",
  care_plan: "Zorgplan",
  signaling_plan: "Signaleringsplan",
  cooperation_agreement: "Samenwerkingsovereenkomst",
  other: "Overige",
};

export const DOCUMENT_LABEL_OPTIONS = [
  { label: "Selecteer Document", value: "" },
  { label: "Registratieformulier", value: "registration_form" },
  { label: "Intakeformulier", value: "intake_form" },
  { label: "Toestemmingsformulier", value: "consent_form" },
  { label: "Risicoanalyse", value: "risk_assessment" },
  { label: "Zelfredzaamheidsmatrix", value: "self_reliance_matrix" },
  { label: "Force Inventaris", value: "force_inventory" },
  { label: "Zorgplan", value: "care_plan" },
  { label: "Signaleringsplan", value: "signaling_plan" },
  { label: "Samenwerkingsovereenkomst", value: "cooperation_agreement" },
  { label: "Overige", value: "other" },
];

export const STATUS_OPTIONS: SelectionOption[] = [
  { value: "On Waiting List", label: "Wachtlijst" },
  { value: "In Care", label: "In Zorg" },
  { value: "Out Of Care", label: "Uit Zorg" },
];

export const STATUS_RECORD = {
  "On Waiting List": "Wachtlijst",
  "In Care": "In Zorg",
  "Out Of Care": "Uit Zorg",
};
