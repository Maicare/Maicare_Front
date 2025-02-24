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
  phonenumber: yup.string().required("Telefoonnummer is verplicht"),
  gender: yup.string().required("Geslacht is verplicht"),
  place_of_birth: yup.string().required("Geboorteplaats is verplicht"),
  representative_first_name: yup.string().required("voornaam is verplicht"),
  representative_last_name: yup.string().required("achternaam is verplicht"),
  representative_email: yup.string().email("Ongeldig e-mailadres").required("e-mail is verplicht"),
  representative_address: yup.string().required("adres is verplicht"),
  representative_phone_number: yup.string().required("telefoonnummer is verplicht"),
  representative_relationship: yup.string().required("relatie is verplicht"),
})