import { ALLERGY_TYPE_ARRAY, DIAGNOSIS_SEVERITY_ARRAY } from "@/consts";
import * as yup from "yup";




const AddressSchema = yup.object({
  belongs_to: yup.string().required('Belongs to is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  zip_code: yup.string().required('Zip code is required'),
  phone_number: yup.string().required('Phone number is required'),
});

export const CreateClientSchema = yup.object({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  organisation: yup.string().required("Organisation is required"),
  location_id: yup.number().required("Location is required"),
  legal_measure: yup.string().required("Legal measure is required"),
  birthplace: yup.string().required("Birthplace is required"),
  departement: yup.string().required("Department is required"),
  gender: yup.string().required("Gender is required"),
  filenumber: yup.string().required("File number is required"),
  phone_number: yup.string().required("Phone number is required"),
  bsn: yup.string().required("BSN is required"),
  source: yup.string().required("Source is required"),
  date_of_birth: yup.string().required("Date of birth is required"),
  addresses: yup.array().of(
    yup.object({
      belongs_to: yup.string().optional(),
      address: yup.string().optional(),
      city: yup.string().optional(),
      zip_code: yup.string().optional(),
      phone_number: yup.string().optional(),
    })
  ).required("Addresses are required"),
  infix: yup.string().optional(),
  added_identity_documents: yup.array().of(yup.string()).optional(),
  removed_identity_documents: yup.array().of(yup.string()).optional(),
  departure_reason: yup.string().optional(),
  departure_report: yup.string().optional(),
  sender_id: yup.number().required()
});

export const ClientTerminationform = yup.object().shape({
  departure_report: yup.string().required("Geef alstublieft het afsluitende rapport op"),
  departure_reason: yup.string().required("Geef alstublieft de reden van vertrek op"),
});

export const ClientUpdateStatus = yup.object().shape({
  status: yup.string().required("Status is required"),
});

export const ClientEmergencyContactForm = yup.object().shape({
  first_name: yup.string().required("Geef alstublieft een voornaam op"),
  last_name: yup.string().required("Geef alstublieft een achternaam op"),
  email: yup.string().required("Geef alstublieft een e-mailadres op"),
  phone_number: yup.string().required("Geef alstublieft een telefoonnummer op"),
  relationship: yup.string().required("Geef alstublieft een relatie op"),
  relation_status: yup.string().required("Geef alstublieft een afstand op"),
  address: yup.string().required("Geef alstublieft een adres op"),
  medical_reports: yup.boolean(),
  goals_reports: yup.boolean(),
  incidents_reports: yup.boolean(),
});

export const ClientInvolvedEmployeeForm = yup.object().shape({
  employee_id: yup.number().required("Employee is required"),
  role: yup.string().required("Role is required"),
  start_date: yup.string().required("Start date is required")
});

export const DiagnosisFormSchema = yup.object().shape({
  id: yup.number(),
  title: yup.string().required("Geef alstublieft een samenvatting van de diagnose"),
  description: yup.string().required("Geef alstublieft de conditie van de patiënt"),
  diagnosis_code: yup.string()
    .max(10, "Diagnosecode mag niet langer zijn dan 10 tekens")
    .required("Geef alstublieft de diagnosecode"),
  severity: yup.string()
    .oneOf(DIAGNOSIS_SEVERITY_ARRAY, "Selecteer een geldige ernst")
    .required("Geef alstublieft de ernst van de diagnose"),
  status: yup.string().required("Geef alstublieft de status van de diagnose"),
  notes: yup.string().required("Geef alstublieft opmerkingen voor de diagnose")
})

export const AllergyFormSchema = yup.object().shape({
  allergy_id: yup.string()
    .oneOf(ALLERGY_TYPE_ARRAY, "Selecteer een geldig allergietype")
    .required("Geef alstublieft een allergietype op"),
  severity: yup.string()
    .oneOf(DIAGNOSIS_SEVERITY_ARRAY, "Selecteer een geldige ernst")
    .required("Geef alstublieft de ernst van de allergie op"),
  reaction: yup.string().required("Geef alstublieft de reactie op de allergie op"),
  notes: yup.string().required("Geef alstublieft notities voor de allergie op"),
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
  current_school: yup.string().required("Huidige School is verplicht"),
  diagnoses: yup.string().required("Diagnoses zijn verplicht"),
  guidance_goals: yup.string().required("Begeleidingsdoelen zijn verplicht"),
  id_number: yup.string().required("Identificatienummer is verplicht"),
  id_type: yup.string().required("ID Type is verplicht"),
  indication_start_date: yup.string().required("Indicatie startdatum is verplicht"),
  indication_end_date: yup.string().required("Indicatie einddatum is verplicht"),
  law_type: yup.string().required("Rechtstype is verplicht"),
  living_situation: yup.string().required("Woonsituatie is verplicht"),
  registration_reason: yup.string().required("Registratiereason is verplicht"),
  registration_type: yup.string().required("Registratie type is verplicht"),
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