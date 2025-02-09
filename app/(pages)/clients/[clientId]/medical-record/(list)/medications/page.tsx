"use client";

import React, { FunctionComponent, useMemo } from "react";
import { ColumnDef, Row } from "@tanstack/table-core";
// import { useModal } from "@/components/providers/ModalProvider";
import Link from "next/link";
import PencilSquare from "@/components/icons/PencilSquare";
import { fullDateFormat } from "@/utils/timeFormatting";
import styles from "./styles.module.scss";
import WarningIcon from "@/components/icons/WarningIcon";
import { useMedication } from "@/hooks/medication/use-medication";
import { Medication } from "@/types/medication.types";
import StatusBadge from "@/components/common/StatusBadge/StatusBadge";
import LinkButton from "@/components/common/Buttons/LinkButton";
import { Loader } from "lucide-react";
import PaginatedTable from "@/components/common/PaginatedTable/PaginatedTable";
// import { getDangerActionConfirmationModal } from "@/components/common/Modals/DangerActionConfirmation";
import DetailCell from "@/components/common/DetailCell";
import IconButton from "@/components/common/Buttons/IconButton";
import { useParams } from "next/navigation";

const MedicationsPage: FunctionComponent = () => {
  const params = useParams();
  const clientIdParam = params?.clientId;
  const clientId = clientIdParam as string;

  const {
    medications: data,
    setPage,
    page,
    isLoading,
    isFetching,
    error,
  } = useMedication(parseInt(clientId));

  const columnDef = useMemo<ColumnDef<Medication>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Naam",
        cell: (info) => (
          <div>
            <div>{info.getValue() as string}</div>
            <div className="flex items-center gap-x-4 gap-y-2 flex-wrap">
              {info.row.original.is_critical && (
                <StatusBadge text={"Kritisch medicijn"} type={"Danger"} />
              )}
              {info.row.original.unset_medications &&
                info.row.original.unset_medications > 0 && (
                  <StatusBadge text={"Medicijn onvolledig"} type={"Warning"} />
                )}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "dosage",
        header: "Dosering",
      },
      {
        accessorKey: "administered_by_name",
        header: "Beheerd door",
        cell: (info) => (info.getValue() as string) || "iedereen",
      },
      {
        accessorKey: "start_date",
        header: "Startdatum",
        cell: (info) => fullDateFormat(info.getValue() as string),
      },
      {
        accessorKey: "end_date",
        header: "Einddatum",
        cell: (info) => fullDateFormat(info.getValue() as string),
      },
      {
        accessorKey: "self_administered",
        header: "Zelf toegediend ?",
        cell: (info) => (
          <div className="flex justify-center">
            <input
              className="w-[20px] h-[20px] cursor-pointer"
              type="checkbox"
              checked={info.getValue() as boolean}
            />
          </div>
        ),
      },
    ];
  }, []);

  if (!clientId) {
    return null;
  }

  return (
    <>
      <div className="flex flex-wrap items-center p-4">
        <div className="font-bold text-c_red flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center rounded bg-c_red text-white">
            <WarningIcon />
          </div>
          <div>Kritische medicijnen zijn rood gemarkeerd</div>
        </div>
        <LinkButton
          text={"Voeg een Medicatie toe"}
          href={"../medications/new"}
          className="ml-auto"
        />
      </div>
      {isLoading && <Loader />}
      {data && (
        <PaginatedTable
          className={styles.table}
          data={data}
          columns={columnDef}
          page={page ?? 1}
          isFetching={isFetching}
          onPageChange={(page) => setPage(page)}
          renderRowDetails={({ original }) => (
            <RowDetails clientId={parseInt(clientId)} data={original} />
          )}
          rowClassName={(row) => {
            return (row as Row<Medication>).original.is_critical ? styles.critical : "";
          }}
        />
      )}
      {error && (
        <p role="alert" className="text-red-600">
          Sorry, een fout heeft ons verhinderd de medicatielijst te laden.
        </p>
      )}
    </>
  );
};

export default MedicationsPage;

type RowDetailsProps = {
  data: Medication;
  clientId: number;
};

const RowDetails: FunctionComponent<RowDetailsProps> = ({ data, clientId }) => {
  // const {
  //   mutate: deleteMedication,
  //   isLoading: isDeleting,
  //   isSuccess: isDeleted,
  // } = useDeleteMedication(clientId);

  // const { open } = useModal(
  //   getDangerActionConfirmationModal({
  //     msg: "Weet je zeker dat je deze medicatie wilt verwijderen?",
  //     title: "Medicatie Verwijderen",
  //   })
  // );

  return (
    <div className={"grid grid-cols-3 gap-2"}>
      <DetailCell label={"Naam"} value={data.name} />
      <DetailCell label={"Dosering"} value={data.dosage} />
      <DetailCell label={"Startdatum"} value={data.start_date} />
      <DetailCell label={"Einddatum"} value={data.end_date} />
      <DetailCell
        className={"col-span-3"}
        label={"Notities"}
        value={data.notes}
      />
      <div className="flex gap-4 items-center col-span-3">
        <LinkButton
          href={`/clients/${clientId}/medications/${data.id}/records`}
          text={"Beheer Medicatie Records"}
        />
        {/* <div>
          <IconButton
            buttonType="Danger"
            onClick={() => {
              open({
                onConfirm: () => {
                  deleteMedication(data.id);
                },
              });
            }}
            disabled={isDeleted}
            isLoading={isDeleting}
          >
            {isDeleted ? (
              <CheckIcon className="w-5 h-5" />
            ) : (
              <TrashIcon className="w-5 h-5" />
            )}
          </IconButton>
        </div> */}
        <Link href={`/clients/${clientId}/medications/${data.id}/edit`}>
          <IconButton>
            <PencilSquare className="w-5 h-5" />
          </IconButton>
        </Link>
      </div>
    </div>
  );
};
