import { Id } from "@/common/types/types";
import { z } from "zod";
import * as Yup from 'yup';

export const employeeOldSchema = Yup.object().shape({
    employee_number: Yup.string().required("Medewerkernummer is verplicht"),
    employment_number: Yup.string().required("Dienstnummer is verplicht"),
    is_subcontractor: Yup.boolean(),
    location_id: Yup.string().required("Locatie is verplicht"),
    role_id: Yup.string(),
    first_name: Yup.string().required("Voornaam is verplicht"),
    last_name: Yup.string().required("Achternaam is verplicht"),
    date_of_birth: Yup.string().required("Geboortedatum is verplicht"),
    gender: Yup.string().required("Geslacht is verplicht"),
    email: Yup.string().email("Ongeldig e-mailadres").required("E-mailadres is verplicht"),
    private_email_address: Yup.string(),
    authentication_phone_number: Yup.string(),
    work_phone_number: Yup.string(),
    private_phone_number: Yup.string(),
    home_telephone_number: Yup.string(),
    out_of_service: Yup.boolean().default(false),
});

// Definieer het schema
export const employeeSchema = z.object({
  employee_number: z.string().min(1, "Medewerkernummer is verplicht"),
  employment_number: z.string().min(1, "Dienstnummer is verplicht"),
  is_subcontractor: z.boolean(),
  location_id: z.string().min(1, "Locatie is verplicht"),
  role_id: z.string().min(1, "Rol is verplicht"),
  first_name: z.string().min(1, "Voornaam is verplicht"),
  last_name: z.string().min(1, "Achternaam is verplicht"),
  date_of_birth: z.coerce.date().refine(date => !isNaN(date.getTime()),{
      message: "Geboortedatum is verplicht",
    }),
  gender: z.string().min(1, "Geslacht is verplicht"),
  email: z
    .string()
    .min(1, "E-mailadres is verplicht")
    .email("Ongeldig e-mailadres"),
  private_email_address: z.string().optional(),
  authentication_phone_number: z.string().optional(),
  work_phone_number: z.string().optional(),
  private_phone_number: z.string().optional(),
  home_telephone_number: z.string().optional(),
  out_of_service: z.boolean().optional(),
});

// Type inferentie van het schema (optioneel, voor TypeScript)
export type CreateEmployee = z.infer<typeof employeeSchema>;
export type CreateEmployeeRequestBody = Omit<CreateEmployee,"role_id"|"location_id"|"date_of_birth"> & {
    role_id: number;
    location_id: number;
    date_of_birth: string;
    department: null;
    position: null;
    id?: Id;
}
export type UpdateEmployeeRequestBody = Omit<CreateEmployee,"role_id"|"location_id"|"date_of_birth"> & {
    role_id: number;
    location_id: number;
    date_of_birth: string;
    department: null;
    position: null;
    id: Id;
}

// Medewerker contract 

// Definieer geldige contract types
export const contractTypes = [
  'loondienst', 'ZZP'
] as const;

export const createEmployeeContractSchema = z.object({
  contract_start_date: z.string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Ongeldig startdatum formaat",
    })
    .transform((val) => new Date(val).toISOString()),
    
  contract_end_date: z.string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Ongeldig einddatum formaat",
    })
    .transform((val) => new Date(val).toISOString()),
    
  contract_type: z.enum(contractTypes, {
    errorMap: () => ({ message: "Selecteer een geldig contracttype" })
  }),

  contract_rate: z.number().optional(),
  
  contract_hours: z.number()
    .int()
    .nonnegative()
    .max(168, "Mag niet meer dan 168 uur per week zijn"),
    
});
export type CreateContractInput = z.infer<typeof createEmployeeContractSchema>;
export interface EmployeeContract {
  contract_end_date: string;
  contract_start_date: string;
  contract_type: 'loondienst' | 'ZZP';
  contract_hours: number;
  id: number;
  is_subcontractor: boolean;
  contract_rate: number;
}