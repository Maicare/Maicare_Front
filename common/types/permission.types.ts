import { Id } from "./types";

export enum ROLE {
  ADMIN = 'admin',
  USER = 'user',
}

export interface Permission {
  id:Id;
  name: string;
  resource: string;
  method: string;
}
export interface PermissionName {
  entity: string;
  action: string;
  entityId?: Id;
}

export type PermissionCheck =
  | Permission
  | {
      and?: PermissionCheck[];
      or?: PermissionCheck[];
      not?: PermissionCheck;
    };
