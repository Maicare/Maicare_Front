import { Id } from "@/common/types/types";
import { ALLERGY_TYPE_ARRAY, DIAGNOSIS_SEVERITY_ARRAY } from "@/consts";

export type AllergyType = (typeof ALLERGY_TYPE_ARRAY)[number];

export type DiagnosisSeverity = (typeof DIAGNOSIS_SEVERITY_ARRAY)[number];

export type Allergy = {
  id?: Id;
  allergy_type: AllergyType;
  severity: DiagnosisSeverity;
  allergy_type_id?: string;
  reaction: string;
  notes: string;
  client: number;
};

export type AllergyForm = {
  id?: Id;
  allergy_id: string;
  severity: string;
  reaction: string;
  notes: string;
};
