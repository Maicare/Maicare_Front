import { Id } from "@/common/types/types";

export interface CalendarAppointment {
  description: string;
  start_time: Date;
  end_time: Date;
  location: string;
  client_ids: Id[];
  participant_employee_ids: Id[];
  recurrence_type: RecurrenceType;
  recurrence_interval: number;
  recurrence_end_date: Date;
  color?: string
  is_confirmed: boolean;
  clients_details: [
    {
      client_id: Id;
    }
  ]
  participants_details: [{
    employee_id: Id;
  }]
}

export enum RecurrenceType {
  NONE = "NONE",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
}