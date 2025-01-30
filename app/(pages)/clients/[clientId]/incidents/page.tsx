"use client";
import Link from "next/link";

import React, { FunctionComponent, useMemo } from "react";

import {
  EMPTY_STRING,
  SEVERITY_OF_INCIDENT_OPTIONS,
  TYPES_INCIDENT_OPTIONS,
} from "@/consts";

// import QuestionnaireDownloadButton from "@/components/QuestionnaireDownloadButton";

import { fullDateFormat } from "@/utils/timeFormatting";
import { useModal } from "@/components/providers/ModalProvider";
import { getDangerActionConfirmationModal } from "@/components/common/Modals/DangerActionConfirmation";
import LinkButton from "@/components/common/Buttons/LinkButton";
import PaginatedTable from "@/components/common/PaginatedTable/PaginatedTable";
import Panel from "@/components/common/Panel/Panel";
import { ColumnDef } from "@tanstack/table-core";
import PencilSquare from "@/components/icons/PencilSquare";
import DeleteIcon from "@/components/icons/DeleteIcon";
import { Loader } from "lucide-react";
import IconButton from "@/components/common/Buttons/IconButton";
import { Incident } from "@/types/incident.types";
import { useIncident } from "@/hooks/incident/use-incident";
import { useParams } from "next/navigation";

const IncidentsPage: FunctionComponent = () => {
  const params = useParams();
  const clientIdParam = params?.clientId;
  const clientId = clientIdParam as string;

  const {
    incidents: data,
    page,
    setPage,
    error,
    isLoading,
    isFetching,
  } = useIncident(parseInt(clientId));
  // const { mutate: deleteIncident } = useDeleteIncident(parseInt(clientId));

  interface IncidentOption {
    value: string | number;
    label: string;
  }

  const getSelectedLabels = (
    options: IncidentOption[],
    value: string | number
  ): string => {
    const option = options.find((obj) => obj.value === value);
    return option ? option.label : EMPTY_STRING;
  };

  const { open } = useModal(
    getDangerActionConfirmationModal({
      msg: "Weet u zeker dat u dit incident wilt verwijderen?",
      title: "Incident verwijderen",
    })
  );

  const columnDef = useMemo<ColumnDef<Incident>[]>(() => {
    return [
      {
        header: "Naam betrokken",
        cell: (info) =>
          `${info.row.original.employee_last_name} ${info.row.original.employee_first_name}`,
      },
      {
        accessorKey: "incident_date",
        header: "Datum ontstaan",
      },
      {
        accessorKey: "runtime_incident",
        header: "Runtime incident ",
      },
      {
        accessorKey: "incident_type",
        header: "Type incident ",
        cell: (info) =>
          getSelectedLabels(
            TYPES_INCIDENT_OPTIONS,
            info.getValue() as string | number
          ),
      },
      {
        accessorKey: "severity_of_incident",
        header: "ernst incident",
        cell: (info) =>
          getSelectedLabels(
            SEVERITY_OF_INCIDENT_OPTIONS,
            info.getValue() as string | number
          ),
      },
      {
        accessorKey: "created",
        header: "gemaakt bij",
        cell: (info) => fullDateFormat(info.getValue() as string),
      },
      {
        accessorKey: "action",
        header: "Actions",
        cell: (info) => {
          return (
            <div className="flex gap-3">
              <Link href={`/clients/${clientId}/incidents/${info.row.id}/edit`}>
                <IconButton>
                  <PencilSquare className="w-5 h-5" />
                </IconButton>
              </Link>
              {/*<QuestionnaireDownloadButton
                type="incident_report"
                questId={+info.row.id}
              />*/}
              <IconButton
                className="bg-red-600"
                onClick={() =>
                  open({
                    // onConfirm: () => {
                    //   deleteIncident(parseInt(info.row.id));
                    // },
                  })
                }
              >
                <DeleteIcon className="w-5 h-5" />
              </IconButton>
            </div>
          );
        },
      },
    ];
  }, []);

  return (
    <Panel
      title={"Incidenten"}
      sideActions={
        <LinkButton
          text="Nieuw incident toevoegen"
          href={"./incidents/add"}
          className="ml-auto"
        />
      }
    >
      {isLoading && <Loader />}
      {data && (
        <PaginatedTable
          data={data}
          columns={columnDef}
          page={page ?? 1}
          isFetching={isFetching}
          onPageChange={(page) => setPage(page)}
        />
      )}
      <div className="flex flex-wrap justify-between items-center p-4"></div>
      {error && (
        <p role="alert" className="text-red-600">
          Sorry, er is een fout opgetreden waardoor we dit niet konden laden.
        </p>
      )}
    </Panel>
  );
};

export default IncidentsPage;
