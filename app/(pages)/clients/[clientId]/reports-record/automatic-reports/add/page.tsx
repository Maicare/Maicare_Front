"use client";

import React from "react";
import { useParams } from "next/navigation";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import NewAutomaticReports from "@/components/automaticReport/AutomaticReportForm";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";

const Page = () => {
  const { clientId } = useParams();
  return <NewAutomaticReports clientId={parseInt(clientId as string, 10)} />;
};

export default withAuth(
  withPermissions(Page, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permisssion
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);
