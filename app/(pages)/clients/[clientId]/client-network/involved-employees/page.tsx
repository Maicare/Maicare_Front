"use client";

import { Any } from "@/common/types/types";
import IconButton from "@/components/common/Buttons/IconButton";
import LinkButton from "@/components/common/Buttons/LinkButton";
import { getDangerActionConfirmationModal } from "@/components/common/Modals/DangerActionConfirmation";
import PaginatedTable from "@/components/common/PaginatedTable/PaginatedTable";
import Panel from "@/components/common/Panel/Panel";
import PencilSquare from "@/components/icons/PencilSquare";
import { useModal } from "@/components/providers/ModalProvider";
import { useInvolvedEmployee } from "@/hooks/client-network/use-involved-employee";
import dayjs from "dayjs";
import { CheckIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { FunctionComponent, useMemo } from "react";


const InvolvedEmployeesPage: FunctionComponent = () => {

  const params = useParams();
  const clientId = params?.clientId?.toString();

  const { involvedEmployees, isLoading, setPage, isFetching, page, deleteOne } = useInvolvedEmployee({ clientId: clientId });

  const { open } = useModal(
    getDangerActionConfirmationModal({
      msg: "Weet je zeker dat je deze betrokken medewerker wilt verwijderen?",
      title: "Betrokkenheid Verwijderen",
    })
  );

  const columnDef = useMemo(() => {
    return [
      {
        accessorKey: "employee_name",
        header: () => "Medewerker",
        cell: (info: { getValue: () => Any }) => info.getValue() || "Niet Beschikbaar",
      },
      {
        accessorKey: "role",
        header: () => "Relatie",
        cell: (info: { getValue: () => Any }) => info.getValue() || "Niet Beschikbaar",
      },
      {
        accessorKey: "start_date",
        header: () => "Startdatum",
        cell: (info: { getValue: () => Any }) => dayjs(info.getValue()).format("DD MMM, YYYY") || "Niet Beschikbaar",
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
                    deleteOne(info.getValue())
                  },
                });
              }}
              disabled={false}
              isLoading={false}
            >
              {false ? <CheckIcon className="w-5 h-5" /> : <TrashIcon className="w-5 h-5" />}
            </IconButton>
            <Link
              href={`/clients/${clientId}/involved-employees/${info.getValue() as number}/edit`}
            >
              <IconButton>
                <PencilSquare className="w-5 h-5" />
              </IconButton>
            </Link>
          </div>
        ),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

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
    )
  return (
    <Panel
      title={"Betrokken Medewerkerslijst"}
      sideActions={
        <LinkButton
          text="Medewerker toevoegen"
          href={`/clients/${clientId}/involved-employees/new`}
        />
      }
    >
      {/* {isLoading && <div className="p-4 sm:p-6 xl:p-7.5">Loading...</div>} */}
      {involvedEmployees &&
        <PaginatedTable
          data={involvedEmployees}
          onPageChange={(page) => setPage(page)}
          columns={columnDef}
          page={page ?? 1}
          isFetching={isFetching}
        />
      }
      {/* {isError && (
        <p role="alert" className="text-red-600">
          Er is een fout opgetreden.
        </p>
      )} */}
    </Panel>
  );
};

export default InvolvedEmployeesPage;
