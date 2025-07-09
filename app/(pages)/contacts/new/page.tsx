"use client";

import React, { FunctionComponent } from "react";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";
import UpsertContactForm from "../_components/upsert-contact-form";
import { useRouter } from "next/navigation";

const Page: FunctionComponent = () => {
      const router = useRouter();
      const onSuccess = (id:number) => {
          router.push(`/contacts/${id}`)
      }
      const onCancel = () => {
          router.back();
      }
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-semibold">Opdrachtgevers Aanmaken</h1>
        <p>Dashboard / <span className="font-medium text-indigo-500 hover:cursor-pointer">Opdrachtgevers Aanmaken</span></p>
      </div>
      <UpsertContactForm
        mode="create"
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </div>
  );
};

export default withAuth(
  withPermissions(Page, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permisssion
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);
