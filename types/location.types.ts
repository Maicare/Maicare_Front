import { Id } from "@/common/types/types";

export type Location = {
  id: Id;
  name: string;
  address: string;
  capacity: number;
};

export type CreateLocationReqDto = {
  name: string;
  address: string;
  capacity: number;
};
