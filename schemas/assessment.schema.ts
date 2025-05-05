import { z } from "zod";

export const createAssessmentSchema = z.object({
    maturity_matrix_id: z.string({
        required_error: "Geef alstublieft een domein",
        invalid_type_error: "Domein moet een nummer zijn"
    }),

    initial_level: z.string({
        required_error: "Geef alstublieft een niveau",
        invalid_type_error: "Niveau moet een nummer zijn"
    }),

    start_date: z.coerce.date().refine(date => !isNaN(date.getTime()), {
        message: "Geboortedatum is vereist", // Invalid date format
    }),

    end_date: z.coerce.date().refine(date => !isNaN(date.getTime()), {
        message: "Geboortedatum is vereist", // Invalid date format
    }),
});

export type CreateAssessment = z.infer<typeof createAssessmentSchema>;