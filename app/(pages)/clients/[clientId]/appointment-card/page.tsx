"use client";

import React, { FunctionComponent, useCallback } from "react";
import PencilSquare from "@/components/icons/PencilSquare";
import IconButton from "@/components/common/Buttons/IconButton";
import QuestionnaireDownloadButton from "@/common/components/QuestionnaireDownloadButton";
import Panel from "@/components/common/Panel/Panel";
import { useParams } from "next/navigation";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";

const appointment = {
  general: [
    { content: "Algemene informatie over de afspraak." },
    { content: "Datum: 2023-10-01" },
  ],
  important_contacts: [
    { content: "Contactpersoon: Jan de Vries" },
    { content: "Telefoon: 0612345678" },
  ],
  household: [{ content: "Huishoudensamenstelling: 4 personen" }],
  organization_agreements: [{ content: "Overeenkomst met Zorgorganisatie X." }],
  probation_service_agreements: [
    { content: "Reclasseringsafspraak voor cliënt." },
  ],
  appointments_regarding_treatment: [
    { content: "Behandelafspraak met Psycholoog Y." },
  ],
  school_stage: [{ content: "Leerjaar 3 van basisschool." }],
  travel: [{ content: "Reisafspraak naar zorginstelling Z." }],
  leave: [{ content: "Verlof opgenomen van 2023-10-15 tot 2023-10-20." }],
};

const EmergencyContactPage: FunctionComponent = () => {
  const params = useParams();
  const clientId = params?.clientId?.toString();

  const renderSection = useCallback(
    (title: string, items: { content: string }[]) => (
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <tbody>
              {items?.length > 0 ? (
                items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-300">
                    <td className="p-2">{item.content}</td>
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

  return (
    <Panel
      title={`Afsprakenkaart Chrystal voor cliënt ${clientId}`}
      header={
        <div className="flex w-full justify-end gap-2">
          <QuestionnaireDownloadButton />
          <IconButton>
            <PencilSquare className="w-5 h-5" />
          </IconButton>
        </div>
      }
    >
      <div className="p-6  gap-6">
        {renderSection("Algemeen", appointment?.general)}
        {renderSection(
          "Belangrijke contacten",
          appointment?.important_contacts
        )}
        {renderSection("Huishouden", appointment?.household)}
        {renderSection(
          "Organisatie afspraken",
          appointment?.organization_agreements
        )}
        {renderSection(
          "Reclassering afspraken",
          appointment?.probation_service_agreements
        )}
        {renderSection(
          "Afspraken met betrekking tot behandeling",
          appointment?.appointments_regarding_treatment
        )}
        {renderSection("Schoolfase", appointment?.school_stage)}
        {renderSection("Reizen", appointment?.travel)}
        {renderSection("Verlof", appointment?.leave)}
      </div>
    </Panel>
  );
};

export default withAuth(
  withPermissions(EmergencyContactPage, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permisssion
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);
