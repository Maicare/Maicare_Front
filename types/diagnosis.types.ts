import { Id } from "@/common/types/types";
import { DIAGNOSIS_SEVERITY_ARRAY } from "@/consts";

export type DiagnosisSeverity = (typeof DIAGNOSIS_SEVERITY_ARRAY)[number];

export type Diagnosis = {
  id?: Id;
  client_id: number;
  title: string;
  diagnosis_code: string;
  severity: DiagnosisSeverity;
  status: string;
  diagnosing_clinician: string;
  notes: string;
  description: string;
  date_of_diagnosis?: string;
  created_at?: string;
  medications: Medication[];
};
export type Medication = {
  id: Id;
  administered_by_id: Id;
  dosage: string;
  end_date: string;
  is_critical: boolean;
  name: string;
  notes: string;
  self_administered: boolean;
  start_date: string;
};

export type DiagnosisForm = {
  id: Id;
  title: string;
  description: string;
  diagnosis_code: string;
  severity: string;
  status: string;
  notes: string;
};
