"use client";

import EmployeeForm from "@/components/employee/EmployeeForm";
import React from "react";
import { useParams } from "next/navigation";
import Loader from "@/components/common/loader";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";

const UpdateEmployee: React.FC = () => {
  const params = useParams();
  const employeeIdParam = params?.employeeId;
  const employeeId = employeeIdParam
    ? parseInt(employeeIdParam as string, 10)
    : null;

  if (!employeeId) {
    return <Loader />;
  }

  return (
    <>
      <Breadcrumb pageName="Medewerker Bijwerken" />
      <EmployeeForm employeeId={employeeId} />
    </>
  );
};

export default withAuth(
  withPermissions(UpdateEmployee, {
    redirectUrl: Routes.Common.Home,
    requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permisssion
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);
