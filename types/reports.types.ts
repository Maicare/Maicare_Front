import { SelectionOption } from "@/common/types/selection-option.types";
import { Id } from "@/common/types/types";

export type Report = {
    date: string,
    emotional_state: EmotionalState|"",
    employee_id: Id,
    report_text: string,
    title: string,
    type: ReportTypes|"",
    id?:Id
}
export enum ReportTypes {
    Morning = "morning_report",
    Evening = "evening_report",
    Night = "night_report",
    Shift = "shift_report",
    OneToOne = "one_to_one_report",
    Process = "process_report",
    Contact = "contact_journal",
    Other = "other"
}
export type ReportTypeKeys = keyof typeof ReportTypes;
export const DAILY_REPORT_TYPES_OPTIONS: SelectionOption[] = [
    { label: "Selecteer Rapport Type", value: "" },
    { label: "Ochtendrapport", value: "morning_report" },
    { label: "Avondrapport", value: "evening_report" },
    { label: "Nachtrapport", value: "night_report" },
    { label: "Tussenrapport", value: "shift_report" },
    { label: "1 op 1 Rapportage", value: "one_to_one_report" },
    { label: "Procesrapportage", value: "process_report" },
    { label: "Contact Journal", value: "contact_journal" },
    { label: "Overige", value: "other" },
];
export const REPORT_TYPE_RECORD = {
    morning_report: "Ochtendrapport",
    evening_report: "Avondrapport",
    night_report: "Nachtrapport",
    shift_report: "Tussenrapport",
    one_to_one_report: "1 op 1 Rapportage",
    process_report: "Procesrapportage",
    contact_journal: "Contact Journal",
    other: "Overige",
};
export const EMOTIONAL_STATE_OPTIONS = [
    { label: "Selecteer Emotionele Staat", value: "" },
    { label: "😃 Blij", value: "excited" },
    { label: "😊 Gelukkig", value: "happy" },
    { label: "😢 Verdrietig", value: "sad" },
    { label: "😐 Normaal", value: "normal" },
    { label: "😰 Angstig", value: "anxious" },
    { label: "😞 Depressief", value: "depressed" },
    { label: "😡 Boos", value: "angry" },
];
export enum EmotionalState {
    Excited = "excited",
    Happy = "happy",
    Sad = "sad",
    Normal = "normal",
    Anxious = "anxious",
    Depressed = "depressed",
    Angry = "angry",
};