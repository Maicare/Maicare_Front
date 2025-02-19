"use client";

import React, { FunctionComponent, useCallback } from "react";
import PencilSquare from "@/components/icons/PencilSquare";
import IconButton from "@/components/common/Buttons/IconButton";
import Panel from "@/components/common/Panel/Panel";
import { useParams } from "next/navigation";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";
import { useAppointment } from "@/hooks/client/use-appointment";
import Link from "next/link";
import { Download } from "lucide-react";

const defaultAppointment = {
  general_information: [] as string[],
  household_info: [] as string[],
  important_contacts: [] as string[],
  leave: [] as string[],
  organization_agreements: [] as string[],
  school_internship: [] as string[],
  travel: [] as string[],
  smoking_rules: [] as string[],
  treatment_agreements: [] as string[],
  work: [] as string[],
  youth_officer_agreements: [] as string[],
};

const EmergencyContactPage: FunctionComponent = () => {
  const params = useParams();
  const clientId = params?.clientId?.toString();


  const { appointments, downloadPDF } = useAppointment(clientId || '0');
  const appointmentData = appointments || defaultAppointment;

  const handleDownload = async () => {
    const url = await downloadPDF();
    console.log("Download URL", url);
    const link = document.createElement("a");
    link.href = url.toString();
    link.download = `appointment_${clientId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderSection = useCallback(
    (title: string, items: string[]) => (
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <tbody>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-300">
                    <td className="p-2">{item}</td>
                  </tr>
                ))
              ) : (
                <tr className="border-b border-gray-300 h-9">
                  <td className="p-2 text-gray-500"></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    ),
    []
  );

  if (!clientId) return <></>;

  return (
    <Panel
      title={`Afsprakenkaart Chrystal voor cliënt ${clientId}`}
      header={
        <div className="flex w-full justify-end gap-2">
          <IconButton
            className="bg-strokedark"
            onClick={() => {
              handleDownload();
            }}
          >
            <Download className="w-5 h-5" />
          </IconButton>
          <Link href={`/clients/${clientId}/appointment-card/edit`}>
            <IconButton>
              <PencilSquare className="w-5 h-5" />
            </IconButton>
          </Link>
        </div>
      }
    >
      <div className="p-6 gap-6">
        {renderSection("Algemeen", appointmentData.general_information)}
        {renderSection("Belangrijke contacten", appointmentData.important_contacts)}
        {renderSection("Huishouden", appointmentData.household_info)}
        {renderSection("Organisatie afspraken", appointmentData.organization_agreements)}
        {renderSection("Afspraken met betrekking tot behandeling", appointmentData.treatment_agreements)}
        {renderSection("Schoolstage", appointmentData.school_internship)}
        {renderSection("Reizen", appointmentData.travel)}
        {renderSection("Verlof", appointmentData.leave)}
        {renderSection("Rookbeleid", appointmentData.smoking_rules)}
        {renderSection("Werk", appointmentData.work)}
        {renderSection("Jeugdambtenaar Afspraken", appointmentData.youth_officer_agreements)}
      </div>
    </Panel>
  );
};

export default withAuth(
  withPermissions(EmergencyContactPage, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permission
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);