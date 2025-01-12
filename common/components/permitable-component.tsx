import { FunctionComponent, PropsWithChildren } from "react";
import { Permission } from "../types/permission.types";
import usePermissions from "../hooks/use-permissions";

export const PermitableComponent: FunctionComponent<
  PropsWithChildren<{
    permission: Permission;
  }>
> = ({ children, permission }) => {
  const {can,transformToPermissionName} = usePermissions();
  return can(transformToPermissionName(permission)) && children;
};