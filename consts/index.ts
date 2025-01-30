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

export const EMPTY_STRING = "";

export const SEVERITY_OF_INCIDENT_OPTIONS = [
  { label: "Selecter status", value: "" },
  {
    label: "Bijna incident: Geen gevolgen voor de cliënt / medewerker",
    value: "near_incident",
  },
  {
    label:
      "Minder ernstig: beinvloedt de cliënt / medewerker en/of vervolgprocessen",
    value: "less_serious",
  },
  {
    label:
      "Ernstig: tijdelijke gevolgen voor de cliënt / medewerker Zeer ernstig: blijvende gevolgen voor de client / medewerker",
    value: "serious",
  },
  {
    label:
      "Fataal: Overlijden van de client / medewerker als gevolg van het incident",
    value: "fatal",
  },
];

export const TYPES_INCIDENT_OPTIONS = [
  { label: "Selecter status", value: "" },
  { label: "gevaarlijke situatie (bijna incident)", value: "yes" },
  { label: "incident", value: "no" },
  { label: "calamiteit", value: "nxo" },
];

export const ORGANIZATIONAL_OPTIONS = [
  "Budget/management prioriteiten",
  "Cultuur / werkplek",
  "Formatie / bezetting",
  "Kennis / deskundigheid niet aanwezig",
  "Logistiek",
  "Onderbewetting / Onvoldoende ingewerkt / begeleid",
  "Overdracht",
  "Overleg",
  "Planning",
  "Protocol / afspraak niet aanwezig of onduidelijk",
  "Taken, bevoegdheden en verantwoordelijkheden",
];

export const TECHNICAL_OPTIONS = [
  "Accomodatie / terrein",
  "Alarmering",
  "Apparatuur",
  "Bediening / onjuist gebruik",
  "Gebouw-gebonden",
  "Handleidingen",
  "Hulpmiddelen",
  "ICT",
  "Instructie",
  "Materiaal defect",
  "Onderhoud",
  "Onduidelijke instructie",
  "Stolen / sleutels",
];
export const MESE_WORKER_OPTIONS = [
  "Afgeleid",
  "Conditie",
  "Deskundigheid",
  "Ervaring",
  "Fysieke belasting",
  "Bekwaamheid / bevoegdheid",
  "Ingewerkt zijn",
  "Oplettendheid / vergissen",
  "Protocol / instructie niet nageleefd",
  "Teamsfeer",
  "Veiligheidsbewustzijn",
  "Werkdruk",
  "Zorgvuldigheid",
  "Invalmedewerker niet goed op de hoogte",
  "Persoonlijke omstandigheden medewerker",
];

export const CLIENT_OPTIONS = [
  "Alcohol en drugs",
  "Conditie / fysieke toestand",
  "Culturele achtergrond",
  "Gedrag van cliënt",
  "Groepssamenstelling",
  "Juridische status",
  "Medicatie",
  "Onbekende risici?s",
  "Psychische toestand cliënt",
  " Therapietrouw / motivatie",
  "Familie van de cliënt",
  "Waarden en normen",
  "Ziektebeeld",
  "Taalproblematiek",
  "De wijwe waarop de zorg uitgevoerd moet worden is niet haalbaar",
  "Niet opvolgen huisregels",
];

export const CONSULTATION_NEEDED_OPTIONS = [
  { label: "Selecteer Type", value: "" },
  { label: "Nee", value: "no" },
  { label: "Nog niet duidelijk", value: "not_clear" },
  { label: "Ziekenhuisopname", value: "hospitalization" },
  { label: "Consult huisarts", value: "consult_gp" },
];

export const PSYCHOLOGICAL_DAMAGE_OPTIONS = [
  { label: "Selecteer Type", value: "" },
  { label: "Geen", value: "no" },
  { label: "Nog niet merkbaar", value: "not_noticeable_yet" },
  { label: "Sufheid", value: "drowsiness" },
  { label: "Onrust", value: "unrest" },
  { label: "anders, nl.", value: "other" },
];

export const INJURY_OPTIONS = [
  { label: "Selecteer Type", value: "" },
  { label: "Geen letsel", value: "no_injuries" },
  { label: "Nog niet merkbaar", value: "not_noticeable_yet" },
  { label: "Blauwe plek / zwelling", value: "bruising_swelling" },
  { label: "Huidletsel", value: "skin_injury" },
  { label: "Botbreuk", value: "broken_bones" },
  { label: "Benauwdheid", value: "shortness_of_breath" },
  { label: "Overleden", value: "death" },
  { label: "anders, nl.", value: "other" },
];

export const INFORM_WHO_OPTIONS = [
  "Met maatregel: jeugdbeschermer",
  "Met maatregel: jeugdreclasseerder",
  "Met maatregel: voogd",
  "Met maatregel: gezaghebbende ouders",
  "Met maatregel: ouders",
  "Met maatregel: mentor",
  "Met maatregel: PGB vertegenwoordiger",
  "Met maatregel: niemad (ZIN / 18+).",
];

export const REPORTER_INVOLVEMENT_OPTIONS = [
  { label: "Selecter status", value: "" },
  { label: "Direct betrokken", value: "directly_involved" },
  { label: "Getuige", value: "witness" },
  { label: "Achteraf aangetroffen", value: "found_afterwards" },
  { label: "Gealarmeerd", value: "alarmed" },
];

export const YES_NO_OPTIONS = [
  { label: "Selecter status", value: "" },
  { label: "Nee", value: "yes" },
  { label: "Ja", value: "no" },
];

export const RISK_OF_RECURRENCE_OPTIONS = [
  { label: "Selecter status", value: "" },
  {
    label:
      "Zeer laag: het zal niet vaker dan 1 x per 5 jaar gebeuren Laag: het zal mogelijk binnen enkele maanden weer gebeuren",
    value: "very_low",
  },
  {
    label: "Middel: het zal mogelijk binnen enkele weken weer gebeuren",
    value: "means",
  },
  {
    label: "Hoog: het zal waarschijnlijk binnen enkele dagen weer gebeuren",
    value: "high",
  },
  {
    label: "Zeer hoog: het zal waarschijnlijk binnen 24 uur weer gebeuren",
    value: "very_high",
  },
];

export const EMPLOYEE_ABSENTEEISM_OPTIONS = [
  { label: "Selecteer Bron", value: "" },
  { label: "Geen ziekteverzuim", value: "BRP" },
  { label: "Ziekteverzuim ‹ 3 dagen", value: "ID" },
  { label: "Ziekteverzuim minder dan een half jaar", value: "passport" },
  { label: "Ziekteverzuim minder dan een jaar", value: "policy_card" },
  {
    label: "Langdurig ziekteverzuim › meer dan een jaar",
    value: "government_agency_letter",
  },
];

export const SUCCESSION_OPTIONS = [
  "Besproken met betrokken medewerker(s)",
  "Besproken in teamvergadering",
  "Besproken met betrokken client",
  "Terugkoppeling gedaan naar melder",
  "Besproken met MT",
  "Besproken met overige betrokkenen, nl.:",
];
