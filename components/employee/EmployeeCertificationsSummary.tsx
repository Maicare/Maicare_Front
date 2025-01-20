"use client";

import React, { FunctionComponent, useEffect, useState } from "react";
// import { useListCertificates } from "@/utils/certificates/listCertificates";

import { useRouter } from "next/navigation";
import Loader from "../common/loader";
import DetailCell from "../common/DetailCell";
import { dateFormat } from "@/utils/timeFormatting";
import { useEmployee } from "@/hooks/employee/use-employee";
import { Certification } from "@/types/certification.types";

type Props = {
  employeeId: number;
};

const EmployeeCertificationsSummary: FunctionComponent<Props> = ({ employeeId }) => {
  const {readEmployeeCertificates} = useEmployee({autoFetch:false});
  const [isLoading, setIsLoading] = useState(true);
    const [certifications, setCertifications] = useState<Certification[]>([]);
  const router = useRouter();
    useEffect(() => {
        const fetchCertifications = async () => {
          try {
            const data = await readEmployeeCertificates(employeeId);
            setCertifications(data);
            setIsLoading(false);
          } catch (error) {
            console.error(error);
          }
        };
        fetchCertifications();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [employeeId]);

  if (isLoading) return <Loader />;

  if (certifications?.length === 0) return <div>Geen certificaten gevonden</div>;
  return (
    <ul className="flex flex-col gap-2">
      {certifications?.map((certificate) => {
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
