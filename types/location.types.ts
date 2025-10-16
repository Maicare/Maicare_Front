import { Id } from "@/common/types/types";

export type Location = {
  id: Id;
  name: string;
  address: string;
  capacity: number;
  organisation_id: string;
};

export type CreateLocationReqDto = {
  name: string;
  address: string;
  capacity: number;
};
