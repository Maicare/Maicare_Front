import { Id } from "@/common/types/types";

export type Episode = {
  id?: Id;
  date: string;
  state_description: string;
  intensity: number;
  client: number;
  created?: string;
};
