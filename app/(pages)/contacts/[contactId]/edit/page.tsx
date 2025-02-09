"use client";

import React from "react";
import { useParams } from "next/navigation";
import ContactForm from "@/components/contacts/ContactForm";
import Panel from "@/components/common/Panel/Panel";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";

const Page: React.FC = () => {
  const params = useParams();
  const contactIdParam = params?.contactId;
  const contactId = contactIdParam ? parseInt(contactIdParam as string, 10) : 0;

  return (
    <>
      <Breadcrumb pageName={"Bijwerken Opdrachtgevers"} />
      <div className="">
        <Panel title={"Bijwerken Opdrachtgevers"}>
          <ContactForm
            contactId={contactId}
            // onSuccess={() => {
            //   router.replace("/contacts");
            // }}
          />
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
