"use client";

import IconButton from "@/components/common/Buttons/IconButton";
import LinkButton from "@/components/common/Buttons/LinkButton";
import { getDangerActionConfirmationModal } from "@/components/common/Modals/DangerActionConfirmation";
import PaginatedTable from "@/components/common/PaginatedTable/PaginatedTable";
import Panel from "@/components/common/Panel/Panel";
import PencilSquare from "@/components/icons/PencilSquare";
import TrashIcon from "@/components/icons/TrashIcon";
import { useModal } from "@/components/providers/ModalProvider";
import { useEmergencyContact } from "@/hooks/client-network/use-emergency-contact";
import Link from "next/link";
import React, { FunctionComponent } from "react";
import { useParams } from "next/navigation";
import { Any } from "@/common/types/types";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";

const EmergencyContactPage: FunctionComponent = () => {
  const params = useParams();
  const clientId = params?.clientId?.toString();

  const { emergencyContacts, isLoading, page, setPage, isFetching, deleteOne } =
    useEmergencyContact({ clientId });

  const { open } = useModal(
    getDangerActionConfirmationModal({
      msg: "Weet je zeker dat je deze noodsituatie wilt verwijderen?",
      title: "Noodsituatie Verwijderen",
    })
  );

  const columnDef = [
    {
      accessorKey: "first_name",
      header: () => "Voornaam",
      cell: (info: { getValue: () => Any }) =>
        info.getValue() || "Niet Beschikbaar",
    },
    {
      accessorKey: "last_name",
      header: () => "Achternaam",
      cell: (info: { getValue: () => Any }) =>
        info.getValue() || "Niet Beschikbaar",
    },
    {
      accessorKey: "email",
      header: () => "E-mailadres",
      cell: (info: { getValue: () => Any }) =>
        info.getValue() || "Niet Beschikbaar",
    },
    {
      accessorKey: "phone_number",
      header: () => "Telefoonnummer",
      cell: (info: { getValue: () => Any }) =>
        info.getValue() || "Niet Beschikbaar",
    },
    {
      accessorKey: "relationship",
      header: () => "Relatie",
      cell: (info: { getValue: () => Any }) =>
        info.getValue() || "Niet Beschikbaar",
    },
    {
      accessorKey: "relation_status",
      header: () => "Afstand",
      cell: (info: { getValue: () => Any }) =>
        info.getValue() || "Niet Beschikbaar",
    },
    {
      accessorKey: "is_verified",
      header: () => "Wordt geverifieerd",
      cell: (info: { getValue: () => Any }) =>
        info.getValue() == false ? (
          <p className="text-warning font-semibold">niet geverifieerd</p>
        ) : (
          <p className="text-success font-semibold">Geverifieerd</p>
        ),
    },
    {
      accessorKey: "address",
      header: () => "Adres",
      cell: (info: { getValue: () => Any }) =>
        info.getValue() || "Niet Beschikbaar",
    },
    {
      accessorKey: "id",
      header: () => "",
      cell: (info: { getValue: () => Any }) => (
        <div className="flex justify-center gap-4">
          <IconButton
            buttonType="Danger"
            onClick={() => {
              open({
                onConfirm: () => {
                  deleteOne(info.getValue());
                },
              });
            }}
          >
            <TrashIcon className="w-5 h-5" />
          </IconButton>

          <Link
            href={`/clients/${clientId}/emergency/${
              info.getValue() as number
            }/edit`}
          >
            <IconButton>
              <PencilSquare className="w-5 h-5" />
            </IconButton>
          </Link>
        </div>
      ),
    },
  ];

  if (isLoading)
    return (
      <Panel
        title={"Lijst met Noodcontacten"}
        sideActions={
          <LinkButton
            text={"Nieuw noodcontact toevoegen"}
            href={`/clients/${clientId}/emergency/new`}
          />
        }
      >
        <div className="p-4 sm:p-6 xl:p-7.5">Loading...</div>
      </Panel>
    );

  return (
    <Panel
      title={"Lijst met Noodcontacten"}
      sideActions={
        <LinkButton
          text={"Nieuw noodcontact toevoegen"}
          href={`/clients/${clientId}/emergency/new`}
        />
      }
    >
      {/* {isLoading && <div className="p-4 sm:p-6 xl:p-7.5">Loading...</div>} */}
      {emergencyContacts && (
        <PaginatedTable
          data={emergencyContacts}
          onPageChange={(page) => setPage(page)}
          columns={columnDef}
          page={page ?? 1}
          isFetching={isFetching}
        />
      )}
      {!emergencyContacts && (
        <p role="alert" className="text-red-600">
          Er is een fout opgetreden.
        </p>
      )}
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
