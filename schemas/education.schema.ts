import { z } from "zod";

// Definieer het schema
export const educationSchema = z.object({
  institution_name: z.string().min(1, "Onderwijsinstelling is verplicht"),
  field_of_study: z.string().min(1, "Studierichting is verplicht"),
  degree: z.string().min(1, "Diploma is verplicht"),
  start_date: z.coerce.date().refine(date => !isNaN(date.getTime()), { 
    message: "Startdatum is ongeldig" 
  }),
  end_date: z.coerce.date().refine(date => !isNaN(date.getTime()), { 
    message: "Einddatum is ongeldig" 
  }),
  employee_id: z.number().default(0),
});

// Type inferentie van het schema (optioneel, voor TypeScript)
export type CreateEducation = z.infer<typeof educationSchema>;