"use client";

import React, { FunctionComponent } from "react";

import { useRouter } from "next/navigation";
import Loader from "../common/loader";
import DetailCell from "../common/DetailCell";

type Props = {
  employeeId: number;
};

const EmployeeExperiencesSummary: FunctionComponent<Props> = ({ employeeId }) => {
  // const { data, isLoading } = useListExperiences(employeeId);
  const router = useRouter();
  const data = {
    results: [
      {
        id: 1,
        job_title: "Software Engineer",
        company_name: "Tech Solutions Inc.",
        start_date: "2018-01-01",
        end_date: "2020-12-31",
      },
      {
        id: 2,
        job_title: "Senior Developer",
        company_name: "Innovatech Ltd.",
        start_date: "2021-01-01",
        end_date: "2023-06-30",
      },
      {
        id: 3,
        job_title: null,
        company_name: "Freelance",
        start_date: null,
        end_date: null,
      },
    ],
  };
  
  if (false) return <Loader />;

  if (data.results?.length === 0) return <div>Geen ervaringen gevonden</div>;
  return (
    <ul className="flex flex-col gap-2">
      {data.results?.map((education) => {
        return (
          <li
            key={education.id}
            onClick={() => router.push(`/employees/${employeeId}/experiences`)}
            className="grid grid-cols-3 hover:bg-gray-3 dark:hover:bg-slate-700 p-4 cursor-pointer rounded-xl"
          >
            <DetailCell
              ignoreIfEmpty={true}
              label={"Functietitel"}
              value={education.job_title || "Niet gespecificeerd"}
            />

            <DetailCell
              ignoreIfEmpty={true}
              label={"Bedrijfsnaam"}
              value={education.company_name || "Niet gespecificeerd"}
            />

            <DetailCell
              ignoreIfEmpty={true}
              label={"Periode"}
              value={
                education?.start_date || education?.end_date
                  ? education?.start_date + " - " + education?.end_date
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
