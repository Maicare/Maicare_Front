import { Id } from "@/common/types/types";
import { DIAGNOSIS_SEVERITY_ARRAY } from "@/consts";

export type DiagnosisSeverity = (typeof DIAGNOSIS_SEVERITY_ARRAY)[number];

export type Diagnosis = {
  id?: Id;
  client: number;
  title: string;
  diagnosis_code: string;
  severity: DiagnosisSeverity;
  status: string;
  diagnosing_clinician: string;
  notes: string;
  description: string;
  date_of_diagnosis?: string;
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
