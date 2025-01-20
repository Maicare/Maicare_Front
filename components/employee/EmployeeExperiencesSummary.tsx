"use client";

import React, { FunctionComponent, useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import Loader from "../common/loader";
import DetailCell from "../common/DetailCell";
import { useEmployee } from "@/hooks/employee/use-employee";
import { Experience } from "@/types/experience.types";

type Props = {
  employeeId: number;
};

const EmployeeExperiencesSummary: FunctionComponent<Props> = ({ employeeId }) => {
  const { readEmployeeExperiences } = useEmployee({ autoFetch:false });
  const [isLoading, setIsLoading] = useState(true);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const router = useRouter();
  useEffect(() => {
      const fetchEducation = async () => {
        try {
          const data = await readEmployeeExperiences(employeeId);
          setExperiences(data);
          setIsLoading(false);
        } catch (error) {
          console.error(error);
        }
      };
      fetchEducation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employeeId]);
  
  if (isLoading) return <Loader />;

  if (experiences.length === 0) return <div>Geen ervaringen gevonden</div>;
  return (
    <ul className="flex flex-col gap-2">
      {experiences.map((experience) => {
        return (
          <li
            key={experience.id}
            onClick={() => router.push(`/employees/${employeeId}/experiences`)}
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
