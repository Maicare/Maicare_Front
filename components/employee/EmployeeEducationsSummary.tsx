"use client";

import React, { FunctionComponent, useEffect, useState } from "react";
// import { useListEducations } from "@/utils/educations/listEducations";

import { useRouter } from "next/navigation";
import { dateFormat } from "@/utils/timeFormatting";
import DetailCell from "../common/DetailCell";
import { Education } from "@/types/education.types";
import Loader from "../common/loader";
import { useEmployee } from "@/hooks/employee/use-employee";

type Props = {
  employeeId: number;
};

const EmployeeEducationsSummary: FunctionComponent<Props> = ({ employeeId }) => {
  const { readEmployeeEducation } = useEmployee({autoFetch:false});
  const [isLoading,setIsLoading] = useState(true);
  const [educations,setEducations] = useState<Education[]>([]);
  const router = useRouter();
  useEffect(() => {
    const fetchEducation = async () => {
      const data = await readEmployeeEducation(employeeId);
      setEducations(data);
      setIsLoading(false);
    };
    fetchEducation();
  },[employeeId,readEmployeeEducation]);

  if (isLoading) return <Loader />;

  if (educations.length === 0) return <div>Geen opleidingen gevonden</div>;

  return (
    <ul className="flex flex-col gap-2">
      {educations.map((education) => {
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
