import { Id } from "@/common/types/types";
import { z } from "zod";
import * as Yup from 'yup';

export const employeeOldSchema = Yup.object().shape({
    // id: Yup.number(),
    employee_number: Yup.string().required("Medewerkernummer Vereist"),
    employment_number: Yup.string().required("Dienstnummer Vereist"),
    is_subcontractor: Yup.boolean(),
    location_id: Yup.string().required("ALLO"),
    role_id: Yup.string(),
    first_name: Yup.string().required("Geef alstublieft de voornaam op"),
    last_name: Yup.string().required("Geef alstublieft de achternaam op"),
    date_of_birth: Yup.string().required("Geef alstublieft de geboortedatum op"),
    gender: Yup.string().required("Geef alstublieft het geslacht op"),
    email: Yup.string().email().required("Geef alstublieft het e-mailadres op"),
    private_email_address: Yup.string(),
    authentication_phone_number: Yup.string(),
    work_phone_number: Yup.string(),
    private_phone_number: Yup.string(),
    home_telephone_number: Yup.string(),
    out_of_service: Yup.boolean().default(false),
});

// Define the schema
export const employeeSchema = z.object({
  employee_number: z.string().min(1, "Medewerkernummer is vereist"), // Required string
  employment_number: z.string().min(1, "Dienstnummer is vereist"), // Required string
  is_subcontractor: z.boolean(), // Required boolean
  location_id: z.string().min(1, "Locatie is vereist"), // Required string
  role_id: z.string().min(1, "Rol is vereist"), // Required string
  first_name: z.string().min(1, "Voornaam is vereist"), // Required string
  last_name: z.string().min(1, "Achternaam is vereist"), // Required string
  date_of_birth: z.coerce.date().refine(date => !isNaN(date.getTime()),{
      message: "Geboortedatum is vereist", // Invalid date format
    }),
  gender: z.string().min(1, "Geslacht is vereist"), // Required string
  email: z
    .string()
    .min(1, "E-mailadres is vereist") // Required string
    .email("Ongeldig e-mailadres"), // Email format validation
  private_email_address: z.string().min(1, "Privé e-mailadres is vereist"), // Required string
  authentication_phone_number: z.string().min(1, "Authenticatie telefoonnummer is vereist"), // Required string
  work_phone_number: z.string().min(1, "Werk telefoonnummer is vereist"), // Required string
  private_phone_number: z.string().min(1, "Privé telefoonnummer is vereist"), // Required string
  home_telephone_number: z.string().min(1, "Thuis telefoonnummer is vereist"), // Required string
  out_of_service: z.boolean(), // Required boolean
});

// Infer the type from the schema (optional, for TypeScript)
export type CreateEmployee = z.infer<typeof employeeSchema>;
export type CreateEmployeeRequestBody = Omit<CreateEmployee,"role_id"|"location_id"|"date_of_birth"> & {
    role_id:number;
    location_id:number;
    date_of_birth:string;
    department:null;
    position:null;
    id?:Id;
}
export type UpdateEmployeeRequestBody = Omit<CreateEmployee,"role_id"|"location_id"|"date_of_birth"> & {
    role_id:number;
    location_id:number;
    date_of_birth:string;
    department:null;
    position:null;
    id:Id;
}