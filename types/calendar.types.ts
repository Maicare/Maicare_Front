export interface CalendarAppointment {
  client_ids: number[];
  description: string;
  end_time: Date;
  location: string;
  participant_employee_ids: number[];
  recurrence_end_date: Date;
  recurrence_interval: number;
  recurrence_type: string;
  start_time: Date;
}