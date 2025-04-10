"use client";

import React, { FunctionComponent } from "react";
// import { useLatestReports } from "@/utils/reports/getLatestReports";
import { shortDateTimeFormat } from "@/utils/timeFormatting";
import { Any } from "@/common/types/types";
import { useReport } from "@/hooks/report/use-report";
import Loader from "@/components/common/loader";
import { Report } from "@/types/reports.types";

type PropsType = {
  clientId: number;
};

const ClientReportsSummary: FunctionComponent<PropsType> = ({ clientId }) => {

  const { reports, isLoading, error } = useReport({
    clientId: clientId,
    autoFetch: true,
    page: 1,
  });

  if (isLoading) return <Loader />;

  if (!reports) return <div>Geen gegevens opgehaald.</div>;

  if (reports.results.length === 0) return <div>Nog geen rapporten</div>;

  return (
    <ul className="flex flex-col gap-2">
      {reports.results.map((report: Report, i) => (
        <ReportsItem key={i} reports={report} />
      ))}
    </ul>
  );
};

export default ClientReportsSummary;

type ReportsItemProps = {
  reports: Report;
};

const ReportsItem: FunctionComponent<ReportsItemProps> = ({ reports }) => {

  return (
    <li className="grid grid-cols-3 px-4 py-2 cursor-pointer hover:bg-gray-3 dark:hover:bg-slate-700 rounded-2xl">
      <div className="font-medium text-gray-600 dark:text-slate-300">
        {shortDateTimeFormat(reports.date)}
      </div>
      <div className="col-span-2 text-gray-600 dark:text-slate-300 truncate">
        {reports.report_text}
      </div>
    </li>
  );
};
