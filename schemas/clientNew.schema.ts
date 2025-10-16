import { Id } from "@/common/types/types";
import { z } from "zod";

// Schema voor het geneste adres object
const AddressSchema = z.object({
  belongs_to: z.string().min(1, "Bijbehorend veld is verplicht"),
  address: z.string().min(1, "Adres is verplicht"),
  city: z.string().min(1, "Stad is verplicht"),
  zip_code: z.string().min(1, "Postcode is verplicht"),
  phone_number: z.string().min(1, "Telefoonnummer is verplicht"),
  house_number: z.string().min(1, "Huisnummer is verplicht"),
});

// Hoofdschema voor het aanmaken van een cliënt
export const CreateClientSchema = z.object({
  first_name: z.string().min(1, "Voornaam is verplicht"),
  last_name: z.string().min(1, "Achternaam is verplicht"),
  email: z.string().email("Ongeldig e-mailadres").min(1, "E-mail is verplicht"),
  organisation_id: z.string().min(1, "Organisatie is verplicht"),
  location_id: z.string().min(1, "Locatie is verplicht"),
  legal_measure: z.string().min(1, "Juridische maatregel is verplicht"),
  birthplace: z.string().min(1, "Geboorteplaats is verplicht"),
  departement: z.string().min(1, "Afdeling is verplicht"),
  gender: z.string().min(1, "Geslacht is verplicht"),
  filenumber: z.string().min(1, "Dossiernummer is verplicht"),
  phone_number: z.string().min(1, "Telefoonnummer is verplicht"),
  bsn: z.string().min(1, "BSN is verplicht"),
  source: z.string().min(1, "Bron is verplicht"),
  date_of_birth: z.coerce.date().refine(date => !isNaN(date.getTime()),{
    message: "Geboortedatum is verplicht",
  }),
  addresses: z.array(AddressSchema).min(1, "Minstens één adres is verplicht"),
  infix: z.string().optional(),
  added_identity_documents: z.array(z.string()).optional(),
  removed_identity_documents: z.array(z.string()).optional(),
  departure_reason: z.string().optional(),
  departure_report: z.string().optional(),
  sender_id: z.string().min(1, "Afzender ID is verplicht"),
  employee_id: z.string().min(1, "Medewerker ID is verplicht"),
  work_additional_notes: z.string().optional(),
  work_current_employer: z.string().optional(),
  work_current_position: z.string().optional(),
  work_currently_employed: z.boolean().optional(),
  work_employer_email: z.string().optional(),
  work_employer_phone: z.string().optional(),
  work_start_date: z.coerce.date().refine(date => !isNaN(date.getTime()),{
    message: "Startdatum werk is verplicht",
  }).optional(),
  education_additional_notes: z.string().optional(),
  education_currently_enrolled: z.boolean().optional(),
  education_institution: z.string().optional(),
  education_level: z.enum(["primary", "secondary", "higher","none"]).optional(),
  education_mentor_email: z.string().optional(),
  education_mentor_name: z.string().optional(),
  education_mentor_phone: z.string().optional(),
  living_situation: z.enum(["home", "foster_care", "youth_care_institution", "other"]).optional(),
  living_situation_notes: z.string().optional(),
});

// Type inferentie voor het schema
export type CreateClientInput = z.infer<typeof CreateClientSchema>;
export type UpdateClientRequestBody = Omit<CreateClientInput,"sender_id"|"location_id"|"date_of_birth"|"employee_id"> & {
    sender_id: number;
    employee_id: number;
    location_id: number;
    date_of_birth: string;
    id: Id;
}