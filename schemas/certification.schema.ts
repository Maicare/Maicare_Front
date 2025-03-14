import { z } from "zod";

// Define the schema
export const certificateSchema = z.object({
  name: z.string().min(1, "Titel is vereist"), // Required string
  issued_by: z.string().min(1, "Uitgever is vereist"), // Required string
  date_issued: z.coerce.date().refine(date => !isNaN(date.getTime()), { message: "Datum van uitgifte is vereist" }),
  employee_id: z.number().min(1, "Datum van uitgifte is vereist"), // Required number
});

// Infer the type from the schema (optional, for TypeScript)
export type CreateCertificate = z.infer<typeof certificateSchema>;