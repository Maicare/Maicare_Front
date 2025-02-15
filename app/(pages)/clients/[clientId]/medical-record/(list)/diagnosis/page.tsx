"use client";

import React, { FunctionComponent, useMemo } from "react";
import { ColumnDef } from "@tanstack/table-core";
import { fullDateFormat } from "@/utils/timeFormatting";
// import TrashIcon from "@/components/icons/TrashIcon";
// import CheckIcon from "@/components/icons/CheckIcon";
// import { useModal } from "@/components/providers/ModalProvider";
import Link from "next/link";
import PencilSquare from "@/components/icons/PencilSquare";
import { useDiagnosis } from "@/hooks/diagnosis/use-diagnosis";
import { Diagnosis, DiagnosisSeverity } from "@/types/diagnosis.types";
import Severity from "@/components/common/Severity/Severity";
import PaginatedTable from "@/components/common/PaginatedTable/PaginatedTable";
import LinkButton from "@/components/common/Buttons/LinkButton";
import Loader from "@/components/common/loader";
// import { getDangerActionConfirmationModal } from "@/components/common/Modals/DangerActionConfirmation";
import DetailCell from "@/components/common/DetailCell";
import IconButton from "@/components/common/Buttons/IconButton";
import { useParams } from "next/navigation";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";

const DiagnosisPage: FunctionComponent = () => {
  const params = useParams();
  const clientIdParam = params?.clientId;
  const clientId = clientIdParam as string;

  const {
    setPage,
    page,
    isFetching,
    isLoading,
    error,
    diagnosis: data,
  } = useDiagnosis(parseInt(clientId));

  const columnDef = useMemo<ColumnDef<Diagnosis>[]>(() => {
    return [
      {
        accessorKey: "title",
        header: () => "Samenvatting",
      },
      {
        accessorKey: "description",
        header: () => "Diagnose",
      },
      {
        accessorKey: "diagnosis_code",
        header: () => "Diagnosecode",
      },
      {
        accessorKey: "severity",
        header: () => "Ernst",
        cell: (info) => (
          <div className="flex justify-center w-full">
            <Severity severity={info.getValue() as DiagnosisSeverity} />
          </div>
        ),
      },
      {
        accessorKey: "date_of_diagnosis",
        header: () => "Datum van diagnose",
        cell: (info) => fullDateFormat(info.getValue() as string),
      },
    ];
  }, []);

  if (!clientId) {
    return null;
  }

  return (
    <>
      <div className="flex flex-wrap items-center p-4">
        <LinkButton
          text={"Diagnose Toevoegen"}
          href={"../diagnosis/new"}
          className="ml-auto"
        />
      </div>
      {isLoading && <Loader />}
      {data && (
        <PaginatedTable
          data={data}
          columns={columnDef}
          renderRowDetails={({ original }) => (
            <RowDetails data={original} clientId={parseInt(clientId)} />
          )}
          page={page ?? 1}
          isFetching={isFetching}
          onPageChange={(page) => setPage(page)}
        />
      )}
      <div className="flex flex-wrap items-center justify-between p-4"></div>
      {error && (
        <p role="alert" className="text-red-600">
          Sorry, een fout heeft ons verhinderd de diagnoselijst te laden.
        </p>
      )}
    </>
  );
};

export default withAuth(
  withPermissions(DiagnosisPage, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permisssion
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);

type RowDetailsProps = {
  data: Diagnosis;
  clientId: number;
};

const RowDetails: FunctionComponent<RowDetailsProps> = ({ data, clientId }) => {
  // const {
  //   mutate: deleteDiagnosis,
  //   isLoading: isDeleting,
  //   isSuccess: isDeleted,
  // } = useDeleteDiagnosis(data.client);

  // const { open } = useModal(
  //   getDangerActionConfirmationModal({
  //     msg: "Weet je zeker dat je deze diagnose wilt verwijderen?",
  //     title: "Diagnose Verwijderen",
  //   })
  // );

  return (
    <div className={"grid grid-cols-3 gap-2"}>
      <DetailCell label={"Samenvatting"} value={data.title} />
      <DetailCell label={"Diagnosecode"} value={data.diagnosis_code} />
      <DetailCell label={"Diagnose"} value={data.description} />
      <DetailCell
        label={"Ernst"}
        value={
          <div className="mt-2">
            <Severity severity={data.severity} />
          </div>
        }
      />
      <DetailCell label={"Status"} value={data.status} />
      <DetailCell
        label={"Diagnose van een arts"}
        value={data.diagnosing_clinician}
      />
      <DetailCell
        className={"col-span-3"}
        label={"Notities"}
        value={data.notes}
      />
      <div className="flex gap-4">
        {/* <IconButton
          buttonType="Danger"
          onClick={() => {
            open({
              onConfirm: () => {
                deleteDiagnosis(data.id);
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
        </IconButton> */}
        <Link href={`/clients/${clientId}/diagnosis/${data.id}/edit`}>
          <IconButton>
            <PencilSquare className="w-5 h-5" />
          </IconButton>
        </Link>
      </div>
    </div>
  );
};
