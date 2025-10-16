import { z } from "zod";

// Medicatie schema
const createMedicationSchema = z.object({
    administered_by_id: z.string().min(1, "Toediener is verplicht"),
    dosage: z.string().min(1, "Dosering is verplicht"),
    end_date: z.coerce.date().refine(date => !isNaN(date.getTime()), {
        message: "Einddatum is verplicht",
    }),
    is_critical: z.boolean(),
    name: z.string().min(1, "Naam is verplicht"),
    notes: z.string(),
    self_administered: z.boolean(),
    start_date: z.coerce.date().refine(date => !isNaN(date.getTime()), {
        message: "Startdatum is verplicht",
    }),
});

// Hoofd schema
export const createDiagnosisSchema = z.object({
    description: z.string().min(1, "Beschrijving is verplicht"),
    diagnosing_clinician: z.string().min(1, "Diagnosticerend clinicus is verplicht"),
    diagnosis_code: z.string()
        .max(10, "Diagnosecode mag niet langer zijn dan 10 tekens")
        .min(1, "Diagnosecode is verplicht"),
    medications: z.array(createMedicationSchema),
    notes: z.string(),
    severity: z.string().min(1, "Ernst is verplicht"),
    status: z.string().min(1, "Status is verplicht"),
    title: z.string().min(1, "Titel is verplicht"),
    id: z.number().optional(),
});

// TypeScript type
export type CreateDiagnosis = z.infer<typeof createDiagnosisSchema>;
export type CreateMedication = z.infer<typeof createMedicationSchema>;