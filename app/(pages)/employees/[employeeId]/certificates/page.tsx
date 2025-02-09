"use client";

import { PermissionsObjects } from "@/common/data/permission.data";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import CertificationForm from "@/components/employee/certificates/CertificateForm";
import CertificatesList from "@/components/employee/certificates/CertificatesList";
import EmployeeBackground from "@/components/employee/EmployeeBackground";
import { useCertificate } from "@/hooks/certificate/use-certificate";
import { useParams } from "next/navigation";
import React, { FunctionComponent } from "react";

const CertificatesPage: FunctionComponent = () => {
  const params = useParams();
  const { employeeId } = params;
  const { certificates, isLoading, mutate } = useCertificate({
    autoFetch: true,
    employeeId: employeeId as string,
  });

  const refetch = async () => {
    await mutate();
  };

  return (
    <EmployeeBackground
      title={"Certificaten"}
      addButtonText={"+ Certificaat Toevoegen"}
      cancelText={"Toevoegen Certificaat Annuleren"}
      errorText={"Een fout trad op tijdens het ophalen van certificaten."}
      employeeId={Number(employeeId as string)}
      query={certificates}
      ListComponent={CertificatesList}
      FormComponent={CertificationForm}
      isLoading={isLoading}
      mutate={refetch}
    />
  );
};

export default withAuth(
  withPermissions(CertificatesPage, {
    redirectUrl: Routes.Common.Home,
    requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permisssion
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);
