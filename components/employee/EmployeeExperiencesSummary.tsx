"use client";

import React, { FunctionComponent } from "react";

import { useRouter } from "next/navigation";
import Loader from "../common/loader";
import DetailCell from "../common/DetailCell";
import { useExperience } from "@/hooks/experience/use-experience";
import { useLocalizedPath } from "@/hooks/common/useLocalizedPath";

type Props = {
  employeeId: number;
};

const EmployeeExperiencesSummary: FunctionComponent<Props> = ({ employeeId }) => {
  const { experiences,isLoading } = useExperience({ autoFetch:false,employeeId:employeeId.toString() });
  const router = useRouter();
    const { currentLocale } = useLocalizedPath();

  
  if (isLoading) return <Loader />;

  if (!experiences || experiences.length === 0) return <div>Geen ervaringen gevonden</div>;
  console.log({experiences})
  return (
    <ul className="flex flex-col gap-2">
      {experiences.map((experience) => {
        return (
          <li
            key={experience.id}
            onClick={() => router.push(`/${currentLocale}/employees/${employeeId}/experiences`)}
            className="grid grid-cols-3 hover:bg-gray-3 dark:hover:bg-slate-700 p-4 cursor-pointer rounded-xl"
          >
            <DetailCell
              ignoreIfEmpty={true}
              label={"Functietitel"}
              value={experience.job_title || "Niet gespecificeerd"}
            />

            <DetailCell
              ignoreIfEmpty={true}
              label={"Bedrijfsnaam"}
              value={experience.company_name || "Niet gespecificeerd"}
            />

            <DetailCell
              ignoreIfEmpty={true}
              label={"Periode"}
              value={
                experience?.start_date || experience?.end_date
                  ? experience?.start_date + " - " + experience?.end_date
                  : "Niet gespecificeerd"
              }
            />
          </li>
        );
      })}
    </ul>
  );
};

export default EmployeeExperiencesSummary;
