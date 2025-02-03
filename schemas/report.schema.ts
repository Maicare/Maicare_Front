import { EmotionalState, Report, ReportTypes } from "@/types/reports.types";
import { wordCount } from "@/utils/words-splitter";
import * as Yup from "yup";
export const ReportSchema: Yup.ObjectSchema<Report> = Yup.object().shape({
    title: Yup.string().required("Gelieve"),
    report_text: Yup.string().required("Geef alstublieft een rapport").test("minWords", "Voer meer dan 50 woorden in om het rapport in te dienen.",wordCount),
    date: Yup.string().required("Geef alstublieft een datum"),
    id: Yup.number().optional(),
    employee_id: Yup.number().required("Geef alstublieft een werknemer"),
    type: Yup.string().oneOf(Object.values(ReportTypes)).required("Gelieve het type rapport op te geven."),
    emotional_state: Yup.string().oneOf(Object.values(EmotionalState)).required("Gelieve de emotionele toestand op te geven."),
});