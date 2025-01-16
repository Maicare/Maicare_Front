"use client";

import React, { FunctionComponent } from "react";
// import { useListCertificates } from "@/utils/certificates/listCertificates";

import { useRouter } from "next/navigation";
import Loader from "../common/loader";
import DetailCell from "../common/DetailCell";
import { dateFormat } from "@/utils/timeFormatting";

type Props = {
  employeeId: number;
};

const EmployeeCertificationsSummary: FunctionComponent<Props> = ({ employeeId }) => {
  // const { data, isLoading } = useListCertificates(employeeId);
  const router = useRouter();
  if (false) return <Loader />;
  const data = {
    results: [
      {
        id: 1,
        name: "Certificaat Veiligheid",
        date_issued: "2023-05-15",
        issued_by: "Veiligheidsinstituut Nederland",
      },
      {
        id: 2,
        name: "ISO 9001",
        date_issued: "2022-11-20",
        issued_by: "Kwaliteitscertificaten BV",
      },
      {
        id: 3,
        name: "EHBO Certificaat",
        date_issued: "2021-03-10",
        issued_by: "Rode Kruis Nederland",
      },
    ],
  };

  if (data.results?.length === 0) return <div>Geen certificaten gevonden</div>;
  return (
    <ul className="flex flex-col gap-2">
      {data.results?.map((certificate) => {
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
