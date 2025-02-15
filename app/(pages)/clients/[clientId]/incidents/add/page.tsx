"use client";

import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import React, { FunctionComponent } from "react";
import IncidentForm from "@/components/incident/IncidentFormNew";
import { useParams } from "next/navigation";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";

const NewIncidentsPage: FunctionComponent = () => {
  const params = useParams();
  const clientIdParam = params?.clientId;
  const clientId = parseInt(clientIdParam as string);
  return (
    <>
      <Breadcrumb pageName="New Incident" />
      <div className="grid grid-cols-1 gap-9">
        <IncidentForm mode={"new"} clientId={clientId} />
      </div>
    </>
  );
};

export default withAuth(
  withPermissions(NewIncidentsPage, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permisssion
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);
