"use client";

import { PermissionsObjects } from "@/common/data/permission.data";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import Loader from "@/components/common/loader";
import EducationForm from "@/components/employee/educations/EducationForm";
import EducationsList from "@/components/employee/educations/EducationsList";
import EmployeeBackground from "@/components/employee/EmployeeBackground";
import { useEducation } from "@/hooks/education/use-education";
import { useParams } from "next/navigation";
import React, { FunctionComponent } from "react";

const EducationsPage: FunctionComponent = () => {
  const params = useParams();
  const { employeeId } = params;
  const { educations, isLoading, mutate } = useEducation({
    autoFetch: true,
    employeeId: employeeId as string,
  });

  if (!employeeId) {
    return null;
  }

  if (isLoading) {
    return <Loader />;
  }
  if (!educations) {
    return null;
  }
  return (
    <EmployeeBackground
      title={"Opleidingen"}
      addButtonText={"+ Opleiding Toevoegen"}
      cancelText={"Toevoegen Opleiding Annuleren"}
      errorText={"Een fout trad op tijdens het ophalen van opleidingen."}
      employeeId={+employeeId}
      query={educations}
      ListComponent={EducationsList}
      FormComponent={EducationForm}
      isLoading={isLoading}
      mutate={() => mutate()}
    />
  );
};

export default withAuth(
  withPermissions(EducationsPage, {
    redirectUrl: Routes.Common.Home,
    requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permisssion
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);
