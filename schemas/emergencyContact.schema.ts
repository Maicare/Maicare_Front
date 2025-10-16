import { z } from "zod";

export const createEmergencyContactSchema = z.object({
  first_name: z.string().min(1, "Voornaam is verplicht"),
  last_name: z.string().min(1, "Achternaam is verplicht"),
  email: z.string().email("Ongeldig e-mailadres"),
  phone_number: z.string().min(1, "Telefoonnummer is verplicht"),
  relationship: z.string().min(1, "Relatie is verplicht"),
  relation_status: z.string().min(1, "Relatiestatus is verplicht"),
  address: z.string().min(1, "Adres is verplicht"),
  medical_reports: z.boolean(),
  goals_reports: z.boolean(),
  incidents_reports: z.boolean(),
  id: z.number().default(1).optional(),
});

export type CreateEmergencyContact = z.infer<typeof createEmergencyContactSchema>;