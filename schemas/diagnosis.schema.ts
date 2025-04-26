import { z } from "zod";

// Medication schema
const createMedicationSchema = z.object({
    administered_by_id: z.string(),
    dosage: z.string(),
    end_date: z.coerce.date().refine(date => !isNaN(date.getTime()), {
        message: "Geboortedatum is vereist", // Invalid date format
    }),
    is_critical: z.boolean(),
    name: z.string(),
    notes: z.string(),
    self_administered: z.boolean(),
    start_date: z.coerce.date().refine(date => !isNaN(date.getTime()), {
        message: "Geboortedatum is vereist", // Invalid date format
    }),
});

// Main schema
export const createDiagnosisSchema = z.object({
    description: z.string(),
    diagnosing_clinician: z.string(),
    diagnosis_code: z.string().max(10),
    medications: z.array(createMedicationSchema),
    notes: z.string(),
    severity: z.string(),
    status: z.string(),
    title: z.string(),
    id: z.number().optional(),
});

// TypeScript type
export type CreateDiagnosis = z.infer<typeof createDiagnosisSchema>;
export type CreateMedication = z.infer<typeof createMedicationSchema>;
