"use client";

import React, { FunctionComponent } from "react";
// import { useListEducations } from "@/utils/educations/listEducations";

import { useRouter } from "next/navigation";
import { dateFormat } from "@/utils/timeFormatting";
import DetailCell from "../common/DetailCell";

type Props = {
  employeeId: number;
};

const EmployeeEducationsSummary: FunctionComponent<Props> = ({ employeeId }) => {
  // const { data, isLoading } = useListEducations(employeeId);
  const router = useRouter();
  // if (isLoading) return <Loader />;
  const data = {
    results: [
      {
        id: 1,
        start_date: "2015-09-01",
        end_date: "2019-06-30",
        institution_name: "University of Amsterdam",
        degree: "Bachelor of Science",
        field_of_study: "Computer Science",
      },
      {
        id: 2,
        start_date: "2020-09-01",
        end_date: "2022-06-30",
        institution_name: "Delft University of Technology",
        degree: "Master of Science",
        field_of_study: "Artificial Intelligence",
      },
      {
        id: 3,
        start_date: null,
        end_date: null,
        institution_name: "Coursera",
        degree: "Certificate",
        field_of_study: "Data Science",
      },
    ],
  };
  if (data.results?.length === 0) return <div>Geen opleidingen gevonden</div>;
  return (
    <ul className="flex flex-col gap-2">
      {data.results?.map((education) => {
        return (
          <li
            key={education.id}
            onClick={() => router.push(`/employees/${employeeId}/educations`)}
            className="grid grid-cols-3 hover:bg-gray-3 p-2 cursor-pointer rounded-xl"
          >
            <DetailCell
              ignoreIfEmpty={true}
              label={"Periode"}
              value={
                education?.start_date || education?.end_date
                  ? dateFormat(education?.start_date) + " - " + dateFormat(education?.end_date)
                  : "Niet gespecificeerd"
              }
            />

            <DetailCell
              ignoreIfEmpty={true}
              label={"Naam Instituut"}
              value={education.institution_name || "Niet gespecificeerd"}
            />

            <DetailCell
              ignoreIfEmpty={true}
              label={"Diploma"}
              value={
                education?.degree || education?.field_of_study
                  ? education?.degree + " | " + education?.field_of_study
                  : "Niet gespecificeerd"
              }
            />
          </li>
        );
      })}
    </ul>
  );
};

export default EmployeeEducationsSummary;
