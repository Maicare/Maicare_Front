import { Id } from "@/common/types/types";

export type Location = {
  id: Id;
  name: string;
  address: string;
  capacity: number;
  occupied: number;
  available: number;
  created_at: string;
  updated_at: string;
  organisation_id: string;
};

export type CreateLocationReqDto = {
  name: string;
  address: string;
  capacity: number;
};
