import { Id } from "@/common/types/types";

export type OpClientType =
  | "main_provider"
  | "local_authority"
  | "particular_party"
  | "healthcare_institution";

export const OP_CLIENT_TYPE = [
  "main_provider", // hoofdaanbieder
  "local_authority", // Gemeente
  "particular_party", // particuliere partij
  "healthcare_institution", // Zorginstelling
] as const;

export const OpClientTypeRecord: Record<OpClientType, string> = {
  main_provider: "Hoofdaanbieder",
  local_authority: "Gemeente",
  particular_party: "Particuliere partij",
  healthcare_institution: "Zorginstelling",
};

export type ContactType = {
  name?: string;
  email?: string;
  phone_number?: string;
};

export type Contact = {
  id?: Id;
  types: OpClientType | "";
  name: string;
  address: string;
  postal_code: string;
  place: string;
  land: string;
  contacts: ContactType[];
  KVKnumber?: string;
  BTWnumber?: string;
  kvknumber?: string;
  btwnumber?: string;
  phone_number: string;
  client_number: string;
};
