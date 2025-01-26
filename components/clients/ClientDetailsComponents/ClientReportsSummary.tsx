"use client";

import { useRouter } from "next/navigation";

import React, { FunctionComponent } from "react";
// import { useLatestReports } from "@/utils/reports/getLatestReports";
import { shortDateTimeFormat } from "@/utils/timeFormatting";

type ReportsListItem = {
  id: number;
  date: string;
  created: string;
  report_text: string;
  emotional_state: string;
  client: number;
  title: string;
  author: string;
  full_name: string;
  profile_picture: string;
  type: any;
};


const mockReports: ReportsListItem[] = [
  {
    id: 1,
    date: "2023-10-01T14:30:00Z",
    created: "2023-10-01T14:30:00Z",
    report_text: "Eerste voortgangsrapport: cliënt heeft goede vooruitgang geboekt.",
    emotional_state: "Positive",
    client: 123,
    title: "Voortgangsrapport",
    author: "john.doe",
    full_name: "John Doe",
    profile_picture: "https://example.com/profile/john-doe.jpg",
    type: "progress",
  },
  {
    id: 2,
    date: "2023-10-05T09:15:00Z",
    created: "2023-10-05T09:15:00Z",
    report_text: "Cliënt heeft moeite met het volgen van het behandelplan.",
    emotional_state: "Neutral",
    client: 123,
    title: "Evaluatierapport",
    author: "jane.smith",
    full_name: "Jane Smith",
    profile_picture: "https://example.com/profile/jane-smith.jpg",
    type: "evaluation",
  },
  {
    id: 3,
    date: "2023-10-10T16:45:00Z",
    created: "2023-10-10T16:45:00Z",
    report_text: "Cliënt heeft positieve feedback gegeven over de behandeling.",
    emotional_state: "Positive",
    client: 123,
    title: "Feedbackrapport",
    author: "john.doe",
    full_name: "John Doe",
    profile_picture: "https://example.com/profile/john-doe.jpg",
    type: "feedback",
  },
  {
    id: 4,
    date: "2023-10-15T11:00:00Z",
    created: "2023-10-15T11:00:00Z",
    report_text: "Cliënt heeft nieuwe doelen gesteld voor de komende maand.",
    emotional_state: "Positive",
    client: 123,
    title: "Doelenrapport",
    author: "jane.smith",
    full_name: "Jane Smith",
    profile_picture: "https://example.com/profile/jane-smith.jpg",
    type: "goals",
  },
  {
    id: 5,
    date: "2023-10-20T13:20:00Z",
    created: "2023-10-20T13:20:00Z",
    report_text: "Cliënt heeft deelgenomen aan een groepsactiviteit met goede resultaten.",
    emotional_state: "Positive",
    client: 123,
    title: "Activiteitenrapport",
    author: "john.doe",
    full_name: "John Doe",
    profile_picture: "https://example.com/profile/john-doe.jpg",
    type: "activity",
  },
];



type Props = {

};


const ClientReportsSummary: FunctionComponent<Props> = () => {
  // const { data, isLoading, isError } = useLatestReports(clientId, 5);

  if (!mockReports) return <div>Geen gegevens opgehaald.</div>;

  if (mockReports.length === 0) return <div>Nog geen rapporten</div>;

  return (
    <ul className="flex flex-col gap-2">
      {mockReports.map((report, i) => (
        <ReportsItem key={i} reports={report} />
      ))}
    </ul>
  );
};

export default ClientReportsSummary;

type ReportsItemProps = {
  reports: ReportsListItem;
};

const ReportsItem: FunctionComponent<ReportsItemProps> = ({ reports }) => {
  const router = useRouter();

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
