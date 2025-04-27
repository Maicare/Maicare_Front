"use client";

import { PermissionsObjects } from "@/common/data/permission.data";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import EmployeeForm from "@/components/employee/EmployeeForm";
import React, { FunctionComponent } from "react";

const NewEmployeePage: FunctionComponent = () => {
  return (
    <>
      <Breadcrumb pageName="Medewerker Aanmaken" />
      <EmployeeForm />
    </>
  );
};

export default withAuth(
  withPermissions(NewEmployeePage, {
    redirectUrl: Routes.Common.Home,
    requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permisssion
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);
