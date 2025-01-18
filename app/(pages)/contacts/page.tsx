"use client";

import React, { FunctionComponent } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Panel from "@/components/common/Panel/Panel";
import LinkButton from "@/components/common/Buttons/LinkButton";
import ContactsList from "@/components/contacts/ContactsList";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";

const Page: FunctionComponent = () => {
  return (
    <>
      <Breadcrumb pageName={"Opdrachtgevers"} />
      <Panel
        title={"Opdrachtgevers"}
        sideActions={
          <LinkButton href={"/contacts/new"} text={"Nieuw Opdrachtgever"} />
        }
      >
        <ContactsList />
      </Panel>
    </>
  );
};

export default withAuth(
  withPermissions(Page, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewEmployee,
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);
