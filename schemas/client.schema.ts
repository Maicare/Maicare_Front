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
  sender_id: yup.number().optional().default(1)
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