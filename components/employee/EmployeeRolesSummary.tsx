"use client";

import React, { FunctionComponent } from "react";
import { useRouter } from "next/navigation";
import { dateFormat } from "@/utils/timeFormatting";
import DetailCell from "../common/DetailCell";
import Loader from "../common/loader";

type Props = {
  employeeId: number;
};

const EmployeeRolesSummary: FunctionComponent<Props> = ({ employeeId }) => {
  // const { data, isLoading } = useListRoleAssignments(employeeId);
  const router = useRouter();
  if (false) return <Loader />;
  const data = [
    {
      group_name: "Developer" as "Developer"| "Team Lead",
      start_date: "2020-01-01",
      end_date: "2022-12-31",
    },
    {
      group_name: "Team Lead" as "Developer"| "Team Lead",
      start_date: "2023-01-01",
      end_date: null, // Still active
    }
  ];
  
  const ORGANIGRAM_TRANSLATE = {
    Developer: "Ontwikkelaar",
    "Team Lead": "Team Leider",
    // Add more translations if needed
  };
  
  if (data?.length === 0) return <div>Geen rollen gevonden</div>;
  if (!data) return null;
  return (
    <ul className="flex flex-col gap-2">
      {data?.map((role,index) => {
        return (
          <li
            onClick={() => router.push(`/employees/${employeeId}/teams`)}
            key={index}
            className="grid grid-cols-2 hover:bg-gray-3 dark:hover:bg-slate-700 p-4 cursor-pointer rounded-xl"
          >
            <DetailCell
              ignoreIfEmpty={true}
              label={"Rol"}
              value={
                ORGANIGRAM_TRANSLATE[role.group_name] ?? role.group_name ?? "Niet gespecificeerd"
              }
            />

            <DetailCell
              ignoreIfEmpty={true}
              label={"Periode"}
              value={
                <>
                  {role.start_date ? (
                    <>
                      Van <strong>{dateFormat(role.start_date)}</strong>
                    </>
                  ) : (
                    <>
                      <strong>Altijd</strong> vanaf
                    </>
                  )}
                  {" - "}
                  {role.end_date ? (
                    <>
                      Tot <strong>{dateFormat(role.end_date)}</strong>
                    </>
                  ) : (
                    <>
                      voor <strong>onbepaalde</strong> tijd
                    </>
                  )}
                </>
              }
            />
          </li>
        );
      })}
    </ul>
  );
};

export default EmployeeRolesSummary;
