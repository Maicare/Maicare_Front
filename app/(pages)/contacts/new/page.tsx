"use client";

import React, { FunctionComponent } from "react";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import ContactForm from "@/components/contacts/ContactForm";
import Panel from "@/components/common/Panel/Panel";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";

const Page: FunctionComponent = () => {
  return (
    <>
      <Breadcrumb pageName={"Nieuw Opdrachtgevers"} />
      <div className="">
        <Panel title={"Creëer een Nieuw Opdrachtgevers"}>
          <ContactForm />
        </Panel>
      </div>
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
