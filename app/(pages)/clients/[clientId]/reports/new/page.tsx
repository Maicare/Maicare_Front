"use client";
import React, { FunctionComponent } from "react";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import { useParams } from "next/navigation";
import ReportsForm from "@/components/clients/reports/ReportsForm";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";

const NewReports: FunctionComponent = () => {
  const { clientId } = useParams();
  if (!clientId || Array.isArray(clientId)) {
    return null;
  }
  return (
    <>
      <Breadcrumb pageName="Nieuwe Rapporten" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          {/* <!-- Reports Form --> */}
          <div className="bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-slate-800  dark:text-white">
                Creëer Nieuwe Rapporten
              </h3>
            </div>
            <ReportsForm mode={"new"} clientId={+clientId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(
  withPermissions(NewReports, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permisssion
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);
