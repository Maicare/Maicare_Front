import { CreateReport as CreateReportOld, EmotionalState, ReportTypes } from "@/types/reports.types";
import { wordCount } from "@/utils/words-splitter";
import { z } from "zod";

import * as Yup from "yup";
export const ReportSchema: Yup.ObjectSchema<CreateReportOld> = Yup.object().shape({
    report_text: Yup.string().required("Geef alstublieft een rapport").test("minWords", "Voer meer dan 50 woorden in om het rapport in te dienen.",wordCount),
    date: Yup.string().required("Geef alstublieft een datum"),
    id: Yup.number().optional(),
    employee_id: Yup.number().required("Geef alstublieft een werknemer"),
    type: Yup.string().oneOf(Object.values(ReportTypes)).required("Gelieve het type rapport op te geven."),
    emotional_state: Yup.string().oneOf(Object.values(EmotionalState)).required("Gelieve de emotionele toestand op te geven."),
});


// First, define the enums/schemas for your types
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

const IdSchema = z.number().min(0, "ID is required");

// Then create the main schema
export const CreateReportSchema = z.object({
  date: z.coerce.date().refine(date => !isNaN(date.getTime()), {
    message: "Geboortedatum is vereist", // Invalid date format
}),
    
  emotional_state: EmotionalStateSchema,
  
  employee_id: IdSchema,
  
  report_text: z.string()
    .min(1, "Report text is required")
    .max(5000, "Report text too long (max 5000 characters)"),
    
  type: ReportTypesSchema,
  
  id: IdSchema.optional()
});

// Infer the type from the schema if needed
export type CreateReport = z.infer<typeof CreateReportSchema>;