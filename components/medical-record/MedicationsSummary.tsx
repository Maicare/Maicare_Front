"use client";

import React, { FunctionComponent } from "react";
import { dateFormat } from "@/utils/timeFormatting";
import { Loader } from "lucide-react";
import { Medication } from "@/types/medication.types";
import { useMedication } from "@/hooks/medication/use-medication";

type Props = {
  clientId: number;
  count?: number;
};

const MedicationsSummary: FunctionComponent<Props> = ({ clientId, count }) => {
  const {
    medications: data,
    isLoading,
    error,
  } = useMedication(clientId, {
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
  if (data.results?.length === 0)
    return <div>Geen medicatie geregistreerd voor cliënt</div>;
  return (
    <ul className="flex flex-col gap-2">
      {data.results?.map((medication) => {
        return <MedicationItem key={medication.id} medication={medication} />;
      })}
    </ul>
  );
};

export default MedicationsSummary;

type MedicationItemProps = {
  medication: Medication;
};

const MedicationItem: FunctionComponent<MedicationItemProps> = ({
  medication,
}) => {
  return (
    <li className="grid grid-cols-3 px-4 py-2 cursor-pointer hover:bg-gray-3 dark:hover:bg-slate-700 rounded-2xl">
      <div>
        <div>
          <strong className="text-sm inline-block w-13">Van: </strong>{" "}
          <span className="inline-block">
            {dateFormat(medication.start_date)}
          </span>
        </div>{" "}
        <div>
          <strong className="text-sm inline-block w-13">tot: </strong>
          <span className="inline-block">
            {dateFormat(medication.end_date)}
          </span>
        </div>
      </div>
      <div>{medication.name}</div>
      <div>{medication.dosage}</div>
    </li>
  );
};
