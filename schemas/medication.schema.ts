import { z } from "zod";

export const CreateMedicationSchema = z.object({
    administered_by_id: z.string(),
    dosage: z.string().min(1, "Dosage is required"),
    end_date: z.coerce.date().refine(date => !isNaN(date.getTime()), {
        message: "Geboortedatum is vereist", // Invalid date format
    }),
    is_critical: z.boolean().default(false),
    name: z.string().min(1, "Medication name is required"),
    notes: z.string().optional(),
    self_administered: z.boolean().default(false),
    start_date: z.coerce.date().refine(date => !isNaN(date.getTime()), {
        message: "Geboortedatum is vereist", // Invalid date format
    }),
});

export type CreateMedication = z.infer<typeof CreateMedicationSchema>;