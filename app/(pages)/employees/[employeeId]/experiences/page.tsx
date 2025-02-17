"use client";

import Loader from "@/components/common/loader";
import EmployeeBackground from "@/components/employee/EmployeeBackground";
import { useExperience } from "@/hooks/experience/use-experience";
import { useParams } from "next/navigation";
import React, { FunctionComponent } from "react";
import ExperienceForm from "@/components/employee/experiences/ExperienceForm";
import ExperiencesList from "@/components/employee/experiences/ExperiencesList";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";

const ExperiencesPage: FunctionComponent = () => {
  const params = useParams();
  const { employeeId } = params;
  const { experiences, isLoading, mutate } = useExperience({
    autoFetch: true,
    employeeId: employeeId as string,
  });

  if (!employeeId) {
    return null;
  }

  if (isLoading) {
    return <Loader />;
  }
  if (!experiences) {
    return null;
  }
  return (
    <EmployeeBackground
      title={"Ervaringen"}
      addButtonText={"+ Ervaring Toevoegen"}
      cancelText={"Toevoegen Ervaring Annuleren"}
      errorText={"Een fout trad op tijdens het ophalen van ervaringen."}
      employeeId={+employeeId}
      query={experiences}
      ListComponent={ExperiencesList}
      FormComponent={ExperienceForm}
      isLoading={isLoading}
      mutate={() => mutate()}
    />
  );
};

export default withAuth(
  withPermissions(ExperiencesPage, {
    redirectUrl: Routes.Common.Home,
    requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permisssion
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);
