"use client";
import { PermissionsObjects } from "@/common/data/permission.data";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import ClientsForm from "@/components/clients/ClientsForm";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import React, { FunctionComponent } from "react";

const NewClients: FunctionComponent = () => {
  return (
    <>
      <Breadcrumb pageName="Nieuwe Cliënt Toevoegen" />
      <ClientsForm mode={"new"} />
    </>
  );
};

export default withAuth(withPermissions(NewClients, { redirectUrl: Routes.Common.NotFound, requiredPermissions: PermissionsObjects.ViewEmployee }), { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login });
