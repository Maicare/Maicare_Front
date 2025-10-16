import { CreateReport as CreateReportOld, EmotionalState, ReportTypes } from "@/types/reports.types";
import { wordCount } from "@/utils/words-splitter";
import { z } from "zod";

import * as Yup from "yup";
export const ReportSchema: Yup.ObjectSchema<CreateReportOld> = Yup.object().shape({
    report_text: Yup.string().required("Rapport is verplicht").test("minWords", "Voer meer dan 50 woorden in om het rapport in te dienen.", wordCount),
    date: Yup.string().required("Datum is verplicht"),
    id: Yup.number().optional(),
    employee_id: Yup.number().required("Medewerker is verplicht"),
    type: Yup.string().oneOf(Object.values(ReportTypes)).required("Rapporttype is verplicht"),
    emotional_state: Yup.string().oneOf(Object.values(EmotionalState)).required("Emotionele toestand is verplicht"),
});

// Definieer eerst de enums/schema's voor je types
const EmotionalStateSchema = z.enum([
  "excited", 
  "happy",
  "sad",
  "normal",
  "anxious",
  "depressed",
  "angry",
  ""
]);

const ReportTypesSchema = z.enum([
  "morning_report",
  "evening_report",
  "night_report",
  "shift_report",
  "one_to_one_report",
  "process_report",
  "contact_journal",
  "other",
  ""
]);

const IdSchema = z.number().min(0, "ID is verplicht");

// Maak dan het hoofd schema
export const CreateReportSchema = z.object({
  date: z.coerce.date().refine(date => !isNaN(date.getTime()), {
    message: "Datum is verplicht",
  }),
    
  emotional_state: EmotionalStateSchema,
  
  employee_id: IdSchema,
  
  report_text: z.string()
    .min(1, "Rapporttekst is verplicht")
    .max(5000, "Rapporttekst is te lang (maximaal 5000 tekens)"),
    
  type: ReportTypesSchema,
  
  id: IdSchema.optional()
});

// Type geïnferreerd van het schema indien nodig
export type CreateReport = z.infer<typeof CreateReportSchema>;