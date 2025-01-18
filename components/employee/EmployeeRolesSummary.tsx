"use client";

import React, { FunctionComponent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DetailCell from "../common/DetailCell";
import Loader from "../common/loader";
import { useRole } from "@/hooks/role/use-role";
import { Role } from "@/types/role.types";

type Props = {
  employeeId: number;
};

const EmployeeRolesSummary: FunctionComponent<Props> = ({ employeeId }) => {
  const {getUserRole} = useRole({autoFetch:false});
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<Role|null>(null);
  const router = useRouter();
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
  }, [employeeId,getUserRole]);
  if (isLoading) return <Loader />;
  if (!role) return <div>Geen rollen gevonden</div>;
  
  return (
    <ul className="flex flex-col gap-2">
      <li
            onClick={() => router.push(`/employees/${employeeId}/teams`)}
            className="grid grid-cols-2 hover:bg-gray-3 dark:hover:bg-slate-700 p-4 cursor-pointer rounded-xl"
          >
            <DetailCell
              ignoreIfEmpty={true}
              label={"Rol"}
              value={
                role.name ?? "Niet gespecificeerd"
              }
            />
          </li>
    </ul>
  );
};

export default EmployeeRolesSummary;
