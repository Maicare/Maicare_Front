import { Id } from "@/common/types/types";

export interface CalendarSchedule {
  id: number;
  start_datetime: string;
  end_datetime: string;
  employee_id: Id;
  employee_first_name: string;
  employee_last_name: string;
  location_id: Id;
  location_name: string;
  created_at: string;
  updated_at: string;
}
