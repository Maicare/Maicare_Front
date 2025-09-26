"use client";
import React from "react";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import ClientDetails from "@/components/clients/ClientDetails";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";

const Page: React.FC = () => {
  const params = useParams();
  const clientIdParam = params?.clientId;
  const clientId = clientIdParam ? parseInt(clientIdParam as string, 10) : 0;

  return (
    <>
      <Breadcrumb pageName="Cliëntgegevens" />
      <ClientDetails clientId={clientId} />
    </>
  );
};

export default withAuth(
  withPermissions(Page, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permisssion
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);
