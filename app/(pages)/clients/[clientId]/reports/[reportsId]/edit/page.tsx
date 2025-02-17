"use client";
import { PermissionsObjects } from "@/common/data/permission.data";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import ReportsForm from "@/components/clients/reports/ReportsForm";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import Loader from "@/components/common/loader";
import { useReport } from "@/hooks/report/use-report";
import { Report } from "@/types/reports.types";
import { useParams } from "next/navigation";
import React, { FunctionComponent, useEffect, useState } from "react";

const EditReports: FunctionComponent = () => {
  const { clientId, reportsId } = useParams();
  const [report, setReport] = useState<Report | undefined>(undefined);
  const { readOne } = useReport({
    autoFetch: false,
    clientId: +(clientId as string) || 0,
  });

  useEffect(() => {
    if (reportsId) {
      readOne(+reportsId).then((response) => {
        setReport({ ...response, date: response.date.slice(0, 16) });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportsId]);
  if (
    !clientId ||
    Array.isArray(clientId) ||
    !reportsId ||
    Array.isArray(reportsId)
  ) {
    return null;
  }
  if (!report) {
    return <Loader />;
  }
  return (
    <>
      <Breadcrumb pageName="Bijwerken verslag" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          {/* <!-- Reports Form --> */}
          <div className="bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-slate-800  dark:text-white">
                Bijwerken verslag
              </h3>
            </div>
            <ReportsForm
              mode={"edit"}
              reportId={+reportsId}
              clientId={+clientId}
              report={report}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(
  withPermissions(EditReports, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permisssion
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);
