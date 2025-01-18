import { Id } from "@/common/types/types";

export type OpClientType =
  | "main_provider"
  | "local_authority"
  | "particular_party"
  | "healthcare_institution";

export type ContactType = {
  name?: string;
  email?: string;
  phone_number?: string;
};

export type Contact = {
  id: Id;
  types: OpClientType | "";
  name: string;
  address: string;
  postal_code: string;
  place: string;
  land: string;
  contacts: ContactType[];
  KVKnumber: string;
  BTWnumber: string;
  phone_number: string;
  client_number: string;
};
