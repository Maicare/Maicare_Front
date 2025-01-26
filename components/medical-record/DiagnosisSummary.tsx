"use client";

import React, { FunctionComponent } from "react";
import { Loader } from "lucide-react";
import Severity from "../common/Severity/Severity";
import { useDiagnosis } from "@/hooks/diagnosis/use-diagnosis";
import { Diagnosis } from "@/types/diagnosis.types";

type Props = {
  clientId: number;
  count?: number;
};

const DiagnosisSummary: FunctionComponent<Props> = ({ clientId, count }) => {
  const {
    diagnosis: data,
    isLoading,
    error,
  } = useDiagnosis(clientId, {
    page: 1,
    page_size: count || 5,
  });
  if (isLoading) return <Loader />;

  if (error)
    return (
      <div className="text-red-600">
        Een fout heeft ons verhinderd gegevens te laden.
      </div>
    );

  if (!data) return <div>Geen gegevens opgehaald.</div>;

  if (data.results?.length === 0) return <div>Geen diagnose gevonden</div>;

  return (
    <ul className="flex flex-col gap-2">
      {data.results?.map((diagnosis) => {
        return <DiagnosisItem key={diagnosis.id} diagnosis={diagnosis} />;
      })}
    </ul>
  );
};

export default DiagnosisSummary;

type DiagnosisItemProps = {
  diagnosis: Diagnosis;
};

const DiagnosisItem: FunctionComponent<DiagnosisItemProps> = ({
  diagnosis,
}) => {
  return (
    <li className="grid grid-cols-3 px-4 py-4 cursor-pointer hover:bg-gray-3 dark:hover:bg-slate-700 rounded-2xl">
      <div>{diagnosis.title}</div>
      <div className="flex items-center justify-center">
        <Severity severity={diagnosis.severity} />
      </div>
      <div>{diagnosis.diagnosis_code}</div>
    </li>
  );
};
