import { z } from "zod";

// Define the schema
export const educationSchema = z.object({
  institution_name: z.string().min(1, "Uitgever is vereist"), // Required string
  field_of_study: z.string().min(1, "Uitgever is vereist"), // Required string
  degree: z.string().min(1, "Uitgever is vereist"), // Required string
  start_date: z.coerce.date().refine(date => !isNaN(date.getTime()), { message: "Startdatum is ongeldig" }),
  end_date: z.coerce.date().refine(date => !isNaN(date.getTime()), { message: "Einddatum is ongeldig" }),
  employee_id: z.number().default(0), // Required number
});

// Infer the type from the schema (optional, for TypeScript)
export type CreateEducation = z.infer<typeof educationSchema>;