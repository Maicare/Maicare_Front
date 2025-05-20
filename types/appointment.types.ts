import { Id } from "@/common/types/types";

export type Appointment = {
  client_id?: number,
  created_at?: string,
  general_information: string[],
  household_info: string[],
  id?: number,
  important_contacts: string[],
  leave: string[],
  organization_agreements: string[],
  school_internship: string[],
  travel: string[],
  smoking_rules: string[],
  treatment_agreements: string[],
  updated_at?: string,
  work: string[],
  youth_officer_agreements: string[]
};

export enum RecurrenceType {
  NONE = "NONE",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
}

export type AppointmentPayload = {
  client_ids: Id[];
  participant_employee_ids: Id[];
  description: string;
  location: string;
  start_time: string;
  end_time: string;
  recurrence_type: RecurrenceType;
  recurrence_interval: number;
  recurrence_end_date?: string | null;
};
