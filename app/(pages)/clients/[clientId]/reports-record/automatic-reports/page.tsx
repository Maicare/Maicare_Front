"use client";

import React, { FunctionComponent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAutomaticReport } from "@/hooks/automatic-report/use-automatic-report";
import { AutomaticReportItem } from "@/types/automatic-report.types";
import LinkButton from "@/components/common/Buttons/LinkButton";
import Button from "@/components/common/Buttons/Button";
import Loader from "@/components/common/loader";
import { fullDateFormat } from "@/utils/timeFormatting";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";
import LargeErrorMessage from "@/components/common/Alerts/LargeErrorMessage";

const AutomaticReportsPage: FunctionComponent = () => {
  const { clientId } = useParams();
  const [currentClientId, setCurrentClientId] = useState<number | null>(null);
  const { automaticReports, isLoading, error, page, setPage } =
    useAutomaticReport({ clientId: currentClientId || 0 });

  useEffect(() => {
    if (clientId && typeof clientId === "string") {
      setCurrentClientId(parseInt(clientId, 10));
    }
  }, [clientId]);

  if (!currentClientId) {
    return <div>Invalid Client ID</div>;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center p-4">
        <LinkButton
          text="Nieuwe Automatische Rapporten Toevoegen"
          href={`/clients/${clientId}/reports-record/automatic-reports/add`}
          className="ml-auto"
        />
      </div>

      {automaticReports?.results &&
        automaticReports.results.length === 0 &&
        !isLoading && (
          <LargeErrorMessage
            firstLine={"Oops!"}
            secondLine={"Er zijn geen rapporten beschikbaar"}
          />
        )}

      <div className="grid grid-cols-1 gap-6 p-4">
        {automaticReports?.results?.map((report: AutomaticReportItem) => (
          <div
            key={report.id}
            className="bg-white border border-stroke dark:border-strokedark rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-black dark:text-white">
                Automatic Report #{report.id}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {fullDateFormat(report.created_at)}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Start Date:
                </span>
                <span>{fullDateFormat(report.start_date)}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  End Date:
                </span>
                <span>{fullDateFormat(report.end_date)}</span>
              </div>
              <div className="mt-4">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Report Text:
                </span>
                <p className="mt-2 text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {report.report_text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-6 mb-6">
        {automaticReports?.previous && (
          <Button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-6"
          >
            Vorige
          </Button>
        )}

        {automaticReports &&
          [
            ...Array(
              Math.ceil(automaticReports.count / automaticReports.page_size)
            ),
          ].map((_, index) => (
            <Button
              key={index + 1}
              onClick={() => setPage(index + 1)}
              className={`px-4 ${
                page === index + 1
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-black"
              }`}
            >
              {index + 1}
            </Button>
          ))}

        {automaticReports?.next && (
          <Button onClick={() => setPage(page + 1)} className="px-6">
            Volgende
          </Button>
        )}
      </div>
    </div>
  );
};

export default withAuth(
  withPermissions(AutomaticReportsPage, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permisssion
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);
