import { z } from "zod";

export const CreateMedicationSchema = z.object({
    administered_by_id: z.string().min(1, "Toediener is verplicht"),
    dosage: z.string().min(1, "Dosering is verplicht"),
    end_date: z.coerce.date().refine(date => !isNaN(date.getTime()), {
        message: "Einddatum is verplicht",
    }),
    is_critical: z.boolean().default(false),
    name: z.string().min(1, "Medicatienaam is verplicht"),
    notes: z.string().optional(),
    self_administered: z.boolean().default(false),
    start_date: z.coerce.date().refine(date => !isNaN(date.getTime()), {
        message: "Startdatum is verplicht",
    }),
});

export type CreateMedication = z.infer<typeof CreateMedicationSchema>;