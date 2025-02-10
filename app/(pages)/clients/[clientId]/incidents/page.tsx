"use client";
import Link from "next/link";

import React, { FunctionComponent, useCallback, useMemo, useState } from "react";

import {
  EMPTY_STRING,
  SEVERITY_OF_INCIDENT_OPTIONS,
} from "@/consts";

import { fullDateFormat } from "@/utils/timeFormatting";
import { useModal } from "@/components/providers/ModalProvider";
import { getDangerActionConfirmationModal } from "@/components/common/Modals/DangerActionConfirmation";
import LinkButton from "@/components/common/Buttons/LinkButton";
import PaginatedTable from "@/components/common/PaginatedTable/PaginatedTable";
import Panel from "@/components/common/Panel/Panel";
import { ColumnDef, Row } from "@tanstack/table-core";
import PencilSquare from "@/components/icons/PencilSquare";
import DeleteIcon from "@/components/icons/DeleteIcon";
import { CheckCircleIcon, ViewIcon, XCircleIcon } from "lucide-react";
import IconButton from "@/components/common/Buttons/IconButton";
import { Incident } from "@/types/incident.types";
import { useIncident } from "@/hooks/incident/use-incident";
import { useParams } from "next/navigation";
import { getWarningActionConfirmationModal } from "@/components/common/Modals/WarningActionConfirmation";
import Loader from "@/components/common/loader";

const IncidentsPage: FunctionComponent = () => {
  const params = useParams();
  const clientIdParam = params?.clientId;
  const clientId = parseInt(clientIdParam as string);

  const {
    incidents: data,
    page,
    setPage,
    error,
    isLoading,
    isFetching,
    generatePdf,
    confirmOne
  } = useIncident({ clientId: clientId, autoFetch: true });
  const [incident, setIncident] = useState<Incident | null>(null);

  interface IncidentOption {
    value: string | number;
    label: string;
  }

  const getSelectedLabels = useCallback(
    (options: IncidentOption[], value: string | number): string => {
      const option = options.find((obj) => obj.value === value);
      return option ? option.label : EMPTY_STRING;
    },
    []
  );

  const { open } = useModal(
    getDangerActionConfirmationModal({
      msg: "Weet u zeker dat u dit incident wilt verwijderen?",
      title: "Incident verwijderen",
    })
  );
  const ModalMessage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    return (
      <div className="flex flex-col gap-4 justify-center">
        <p>Door dit incident te bevestigen, wordt de hier gegenereerde pdf per e-mail verzonden. Weet je het zeker?</p>
        <IconButton
          className="bg-blue-600 rounded-md p-2 flex items-center gap-2"
          onClick={async () => {
            try {
              setLoading(true);
              const res = await generatePdf(incident?.id as number, { displaySuccess: true });
              window.open(res.file_url, "_blank");
            } catch (error) {
              console.error(error);
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          isLoading={loading}
        >
          <ViewIcon className="w-5 h-5" />
          <span>View PDF</span>
        </IconButton>
      </div>
    );
  }
  const { open: openPdf } = useModal(
    getWarningActionConfirmationModal({
      msg: ModalMessage,
      title: "Bevestig dit incident",
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
        cell: (info) => fullDateFormat(info.getValue() as string),
      },
      {
        accessorKey: "runtime_incident",
        header: "Runtime incident ",
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
        accessorKey: "is_confirmed",
        header: "Bevestigd",
        cell: (info) => {
          if (info.getValue() === false) {
            return (
              <XCircleIcon className="text-red-500 w-8 h-8" />
            )
          }
          return (
            <CheckCircleIcon className="text-green-500 w-8 h-8" />
          )
        }
      },
      {
        accessorKey: "action",
        header: "Actions",
        cell: (info) => {
          const incident = info.row.original;
          return (
            <div className="flex gap-3">
              <Link href={`/clients/${clientId}/incidents/${info.row.id}/edit`}>
                <IconButton>
                  <PencilSquare className="w-5 h-5" />
                </IconButton>
              </Link>
              <IconButton
                className="bg-red-600"
                onClick={() =>{
                  setIncident(incident);
                  open({
                    // onConfirm: () => {
                    //   deleteIncident(parseInt(info.row.id));
                    // },
                  })}
                }
              >
                <DeleteIcon className="w-5 h-5" />
              </IconButton>
              {
                !info.row.original.is_confirmed &&
                <IconButton
                className="bg-green-600"
                onClick={() =>
                  openPdf({
                    onConfirm: async() => {
                      try {
                        await confirmOne(parseInt(info.row.id), { displaySuccess: true,displayProgress:true });
                      } catch (error) {
                        console.error(error);
                      }
                    },
                  })
                }
              >
                <CheckCircleIcon className="w-5 h-5" />
              </IconButton>}
            </div>
          );
        },
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId, getSelectedLabels, open]);

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
          rowClassName={(row) => (!(row as Row<Incident>).original.is_confirmed ? "bg-red-100 hover:!bg-red-200" : "")}

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
