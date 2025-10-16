import { z } from "zod";

export const experienceSchema = z.object({
    job_title: z.string().min(1, "Functietitel is verplicht"),
    company_name: z.string().min(1, "Bedrijfsnaam is verplicht"),
    start_date: z.coerce.date().refine(date => !isNaN(date.getTime()), { message: "Startdatum is ongeldig" }),
    end_date: z.coerce.date().refine(date => !isNaN(date.getTime()), { message: "Einddatum is ongeldig" }),
    description: z.string().min(1, "Beschrijving is verplicht"),
    employee_id: z.number().default(0),
});
export type CreateExperience = z.infer<typeof experienceSchema>;