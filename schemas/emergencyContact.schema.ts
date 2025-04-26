import { z } from "zod";

export const createEmergencyContactSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().min(1, "Phone number is required"),
  relationship: z.string().min(1, "Relationship is required"),
  relation_status: z.string().min(1, "Relation status is required"),
  address: z.string().min(1, "Address is required"),
  medical_reports: z.boolean(),
  goals_reports: z.boolean(),
  incidents_reports: z.boolean(),
  id: z.number().default(1).optional(),
});

export type CreateEmergencyContact = z.infer<typeof createEmergencyContactSchema>;