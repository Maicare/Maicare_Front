"use client";
import { PermissionsObjects } from "@/common/data/permission.data";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import ClientsForm from "@/components/clients/ClientsForm";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import { useParams } from "next/navigation";
import React, { FunctionComponent } from "react";

const EditClients: FunctionComponent = () => {
  const params = useParams();
  const clientId = params?.clientId?.toString();


  if (!clientId)
    return <></>

  return (
    <>
      <Breadcrumb pageName="Nieuwe Cliënt Toevoegen" />
      <ClientsForm mode={"edit"} clientId={clientId} />
    </>
  );
};

export default withAuth(withPermissions(EditClients, { redirectUrl: Routes.Common.NotFound, requiredPermissions: PermissionsObjects.ViewEmployee }), { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login });
