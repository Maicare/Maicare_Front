"use client";

import React, { FunctionComponent } from "react";
import { useRouter } from "next/navigation";
import Loader from "../common/loader";
import DetailCell from "../common/DetailCell";
import { dateFormat } from "@/utils/timeFormatting";
import { useCertificate } from "@/hooks/certificate/use-certificate";

type Props = {
  employeeId: number;
};

const EmployeeCertificationsSummary: FunctionComponent<Props> = ({ employeeId }) => {
  const {certificates,isLoading} = useCertificate({employeeId:employeeId.toString()});
  const router = useRouter();

  if (isLoading) return <Loader />;

  if (!certificates) return <div>Geen certificaten gevonden</div>;
  return (
    <ul className="flex flex-col gap-2">
      {certificates?.map((certificate) => {
        return (
          <li
            key={certificate.id}
            onClick={() => router.push(`/employees/${employeeId}/certificates`)}
            className="grid grid-cols-3 hover:bg-gray-3 p-4 dark:hover:bg-slate-700 cursor-pointer rounded-xl"
          >
            <DetailCell ignoreIfEmpty={true} label={"Titel"} value={certificate.name} />

            <DetailCell
              ignoreIfEmpty={true}
              label={"Datum Uitgegeven"}
              value={dateFormat(certificate.date_issued)}
            />
            <DetailCell
              ignoreIfEmpty={true}
              label={"Uitgegeven Door"}
              value={certificate.issued_by}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default EmployeeCertificationsSummary;
