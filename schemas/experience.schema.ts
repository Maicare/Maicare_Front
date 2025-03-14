import { z } from "zod";

export const experienceSchema = z.object({
    job_title: z.string().min(1, "Functietitel is vereist"),
    company_name: z.string().min(1, "Bedrijfsnaam is vereist"),
    start_date: z.coerce.date().refine(date => !isNaN(date.getTime()), { message: "Startdatum is ongeldig" }),
    end_date: z.coerce.date().refine(date => !isNaN(date.getTime()), { message: "Einddatum is ongeldig" }),
    description: z.string().min(1, "Beschrijving is vereist"),
    employee_id: z.number().default(0),
});
export type CreateExperience = z.infer<typeof experienceSchema>;
