import { z } from "zod";

export const createInvolvedEmployeeSchema = z.object({
    employee_id: z.string().min(1, "Medewerker is verplicht"),
    role: z.string().min(1, "Role is required"),
    start_date: z.coerce.date().refine(date => !isNaN(date.getTime()), {
        message: "Geboortedatum is vereist", // Invalid date format
    }),
    id:z.number().default(1).optional(),
});

export type CreateInvolvedEmployee = z.infer<typeof createInvolvedEmployeeSchema>;