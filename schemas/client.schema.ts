import { ALLERGY_TYPE_ARRAY, DIAGNOSIS_SEVERITY_ARRAY } from "@/consts";
import * as yup from "yup";

const AddressSchema = yup.object({
  belongs_to: yup.string().required('Bijbehorend veld is verplicht'),
  address: yup.string().required('Adres is verplicht'),
  city: yup.string().required('Stad is verplicht'),
  zip_code: yup.string().required('Postcode is verplicht'),
  phone_number: yup.string().required('Telefoonnummer is verplicht'),
});

export const CreateClientSchema = yup.object({
  first_name: yup.string().required("Voornaam is verplicht"),
  last_name: yup.string().required("Achternaam is verplicht"),
  email: yup.string().email("Ongeldig e-mailadres").required("E-mailadres is verplicht"),
  organisation: yup.string().required("Organisatie is verplicht"),
  location_id: yup.number().required("Locatie is verplicht"),
  legal_measure: yup.string().required("Maatregel is verplicht"),
  birthplace: yup.string().required("Geboorteplaats is verplicht"),
  departement: yup.string().required("Afdeling is verplicht"),
  gender: yup.string().required("Geslacht is verplicht"),
  filenumber: yup.string().required("Dossienummer is verplicht"),
  phone_number: yup.string().required("Telefoonnummer is verplicht"),
  bsn: yup.string().required("BSN is verplicht"),
  source: yup.string().required("Bron is verplicht"),
  date_of_birth: yup.string().required("Geboortedatum is verplicht"),
  addresses: yup.array().of(
    yup.object({
      belongs_to: yup.string().optional(),
      address: yup.string().optional(),
      city: yup.string().optional(),
      zip_code: yup.string().optional(),
      phone_number: yup.string().optional(),
    })
  ).required("Adressen zijn verplicht"),
  infix: yup.string().optional(),
  added_identity_documents: yup.array().of(yup.string()).optional(),
  removed_identity_documents: yup.array().of(yup.string()).optional(),
  departure_reason: yup.string().optional(),
  departure_report: yup.string().optional(),
  sender_id: yup.number().required("Verzender is verplicht")
});

export const ClientTerminationform = yup.object().shape({
  departure_report: yup.string().required("Geef het afsluitende rapport op"),
  departure_reason: yup.string().required("Geef de reden van vertrek op"),
});

export const ClientUpdateStatus = yup.object().shape({
  status: yup.string().required("Status is verplicht"),
});

export const ClientEmergencyContactForm = yup.object().shape({
  first_name: yup.string().required("Geef een voornaam op"),
  last_name: yup.string().required("Geef een achternaam op"),
  email: yup.string().required("Geef een e-mailadres op"),
  phone_number: yup.string().required("Geef een telefoonnummer op"),
  relationship: yup.string().required("Geef een relatie op"),
  relation_status: yup.string().required("Geef een afstand op"),
  address: yup.string().required("Geef een adres op"),
  medical_reports: yup.boolean(),
  goals_reports: yup.boolean(),
  incidents_reports: yup.boolean(),
});

export const ClientInvolvedEmployeeForm = yup.object().shape({
  employee_id: yup.number().required("Medewerker is verplicht"),
  role: yup.string().required("Rol is verplicht"),
  start_date: yup.string().required("Startdatum is verplicht")
});

export const DiagnosisFormSchema = yup.object().shape({
  id: yup.number(),
  title: yup.string().required("Geef een samenvatting van de diagnose"),
  description: yup.string().required("Geef de conditie van de patiënt"),
  diagnosis_code: yup.string()
    .max(10, "Diagnosecode mag niet langer zijn dan 10 tekens")
    .required("Geef de diagnosecode"),
  severity: yup.string()
    .oneOf(DIAGNOSIS_SEVERITY_ARRAY, "Selecteer een geldige ernst")
    .required("Geef de ernst van de diagnose"),
  status: yup.string().required("Geef de status van de diagnose"),
  notes: yup.string().required("Geef opmerkingen voor de diagnose")
})

export const AllergyFormSchema = yup.object().shape({
  allergy_id: yup.string()
    .oneOf(ALLERGY_TYPE_ARRAY, "Selecteer een geldig allergietype")
    .required("Geef een allergietype op"),
  severity: yup.string()
    .oneOf(DIAGNOSIS_SEVERITY_ARRAY, "Selecteer een geldige ernst")
    .required("Geef de ernst van de allergie op"),
  reaction: yup.string().required("Geef de reactie op de allergie op"),
  notes: yup.string().required("Geef notities voor de allergie op"),
})

export const IntakeFormSchema = yup.object().shape({
  first_name: yup.string().required("Voornaam is verplicht"),
  last_name: yup.string().required("Achternaam is verplicht"),
  date_of_birth: yup.string().required("Geboortedatum is verplicht"),
  gender: yup.string().required("Geslacht is verplicht"),
  address: yup.string().required("Adres is verplicht"),
  city: yup.string().required("Stad is verplicht"),
  postal_code: yup.string().required("Postcode is verplicht"),
  phone_number: yup.string().required("Telefoonnummer is verplicht"),
  email: yup.string().email("Ongeldig e-mailadres").required("E-mailadres is verplicht"),
  bsn: yup.string().required("BSN is verplicht"),
  current_school: yup.string().required("Huidige school is verplicht"),
  diagnoses: yup.string().required("Diagnoses zijn verplicht"),
  guidance_goals: yup.string().required("Begeleidingsdoelen zijn verplicht"),
  id_number: yup.string().required("Identificatienummer is verplicht"),
  id_type: yup.string().required("ID-type is verplicht"),
  indication_start_date: yup.string().required("Indicatie startdatum is verplicht"),
  indication_end_date: yup.string().required("Indicatie einddatum is verplicht"),
  law_type: yup.string().required("Wettype is verplicht"),
  living_situation: yup.string().required("Woonsituatie is verplicht"),
  registration_reason: yup.string().required("Registratiereden is verplicht"),
  registration_type: yup.string().required("Registratietype is verplicht"),
  added_identity_documents: yup.array().of(yup.string()).nullable(),
  main_provider_contact: yup.string().required("Hoofdleverancier contact is verplicht"),
  main_provider_name: yup.string().required("Hoofdleverancier naam is verplicht"),
  medication_details: yup.string().required("Medicatiegegevens zijn verplicht"),
  mentor_email: yup.string().email("Ongeldig e-mailadres").required("Mentor e-mailadres is verplicht"),
  mentor_name: yup.string().required("Mentor naam is verplicht"),
  mentor_phone: yup.string().required("Mentor telefoonnummer is verplicht"),
  nationality: yup.string().required("Nationaliteit is verplicht"),
  other_law_specification: yup.string().required("Overige rechtspecificatie is verplicht"),
  other_living_situation: yup.string().required("Overige woonsituatie is verplicht"),
  other_risks: yup.string().required("Overige risico's zijn verplicht"),
  previous_care: yup.string().required("Eerdere zorg is verplicht"),
  referrer_email: yup.string().email("Ongeldig e-mailadres").required("Verwijzer e-mailadres is verplicht"),
  referrer_function: yup.string().required("Functie verwijzer is verplicht"),
  referrer_name: yup.string().required("Naam verwijzer is verplicht"),
  referrer_organization: yup.string().required("Organisatie verwijzer is verplicht"),
  referrer_phone: yup.string().required("Telefoonnummer verwijzer is verplicht"),
  addiction_issues: yup.boolean().required(),
  client_signature: yup.boolean().required(),
  judicial_involvement: yup.boolean().required(),
  has_valid_indication: yup.boolean().required(),
  parental_authority: yup.boolean().required(),
  referrer_signature: yup.boolean().required(),
  risk_aggression: yup.boolean().required(),
  risk_drug_dealing: yup.boolean().required(),
  risk_running_away: yup.boolean().required(),
  risk_self_harm: yup.boolean().required(),
  risk_suicidality: yup.boolean().required(),
  risk_weapon_possession: yup.boolean().required(),
  sharing_permission: yup.boolean().required(),
  truth_declaration: yup.boolean().required(),
  uses_medication: yup.boolean().required(),
  signature_date: yup.string().required("Datum ondertekening is verplicht"),
  signed_by: yup.string().required("Ondertekend door is verplicht"),
  guardian_details: yup.array().of(
    yup.object().shape({
      first_name: yup.string().required("Voornaam voogd is verplicht"),
      last_name: yup.string().required("Achternaam voogd is verplicht"),
      address: yup.string().required("Adres voogd is verplicht"),
      email: yup.string().email("Ongeldig e-mailadres").required("E-mailadres voogd is verplicht"),
      phone_number: yup.string().required("Telefoonnummer voogd is verplicht"),
    })
  ).min(1, "Minimaal één voogd is verplicht"),
  guardian_signature: yup.boolean().required(),
})