import { Id } from "@/common/types/types";

export type Medication = {
  id?: Id;
  unset_medications?: number;
  administered_by_id?: number;
  administered_by_name?: string;

  name: string;
  dosage: string;
  start_date: string;
  end_date: string;
  self_administered: boolean;
  slots: DateTimes;
  notes: string;
  client: number;
  administered_by: number | null;
  is_critical: boolean;
};
