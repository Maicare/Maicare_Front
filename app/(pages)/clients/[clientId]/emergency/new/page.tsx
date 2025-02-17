"use client";

import { PermissionsObjects } from "@/common/data/permission.data";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import EmergencyContactForm from "@/components/client-network/EmergencyContactForm";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import { useParams } from "next/navigation";
import React, { FunctionComponent } from "react";

const NewEmergencyContact: FunctionComponent = () => {
  const params = useParams();
  const clientId = params?.clientId?.toString();

  return (
    <>
      <Breadcrumb pageName="Nieuw Noodcontact" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-slate-800  dark:text-white">
                Creëer een Nieuw Noodcontact
              </h3>
            </div>
            <EmergencyContactForm clientId={clientId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(
  withPermissions(NewEmergencyContact, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permisssion
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);
