"use client";

import React, { FunctionComponent, useCallback, useEffect, useState } from "react";
import DetailCell from "../common/DetailCell";
import Loader from "../common/loader";
import { useRole } from "@/hooks/role/use-role";
import { Role } from "@/types/role.types";
import RoleSelectModal from "../common/Modals/RoleSelectModal";
import { useModal } from "../providers/ModalProvider";
import EditIcon from "../icons/EditIcon";

type Props = {
  employeeId: number;
};

const EmployeeRolesSummary: FunctionComponent<Props> = ({ employeeId }) => {
  const {getUserRole} = useRole({autoFetch:false});
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<Role|null>(null);
  const { open } = useModal(RoleSelectModal);
  const selectRole = useCallback(() => {
    console.log("clicked")
    open({
      initialData:role?.id,
    });
  },[role,open]);
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const data = await getUserRole();
        setRole(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);
  if (isLoading) return <Loader />;
  if (!role) return <div>Geen rollen gevonden</div>;

  return (
    <ul className="flex flex-col gap-2">
      <li
            onClick={selectRole}
            className="hover:bg-gray-3 dark:hover:bg-slate-700 p-4 cursor-pointer rounded-xl flex items-center justify-between w-full"
          >
            <DetailCell
              ignoreIfEmpty={true}
              label={"Rol"}
              value={
                role.name ?? "Niet gespecificeerd"
              }
            />
            <EditIcon />
          </li>
    </ul>
  );
};

export default EmployeeRolesSummary;
