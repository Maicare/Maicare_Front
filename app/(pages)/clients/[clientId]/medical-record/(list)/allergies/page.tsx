"use client";

import React, { FunctionComponent, useMemo } from "react";
import { ColumnDef, Row } from "@tanstack/table-core";
// import { useModal } from "@/components/providers/ModalProvider";

import Link from "next/link";
import PencilSquare from "@/components/icons/PencilSquare";
import { useAllergy } from "@/hooks/allergy/use-allergy";
import Severity from "@/components/common/Severity/Severity";
import { Allergy, DiagnosisSeverity } from "@/types/allergy.types";
import Loader from "@/components/common/loader";
import PaginatedTable from "@/components/common/PaginatedTable/PaginatedTable";
import LinkButton from "@/components/common/Buttons/LinkButton";
import DetailCell from "@/components/common/DetailCell";
import IconButton from "@/components/common/Buttons/IconButton";
// import { getDangerActionConfirmationModal } from "@/components/common/Modals/DangerActionConfirmation";
import { useParams } from "next/navigation";

const AllergiesPage: FunctionComponent = () => {
  const params = useParams();
  const clientIdParam = params?.clientId;
  const clientId = clientIdParam as string;

  const {
    allergies: data,
    setPage,
    page,
    error,
    isLoading,
    isFetching,
  } = useAllergy(parseInt(clientId));

  const columnDef = useMemo<ColumnDef<Allergy>[]>(() => {
    return [
      {
        accessorKey: "allergy_type",
        header: "Type Allergie",
      },
      {
        accessorKey: "reaction",
        header: "Reactie",
      },
      {
        accessorKey: "severity",
        header: "Ernst",
        cell: (info) => (
          <div className="flex justify-center w-full">
            <Severity severity={info.getValue() as DiagnosisSeverity} />
          </div>
        ),
      },
    ];
  }, []);

  if (!clientId) {
    return null;
  }

  const renderRowDetails = ({ original }: Row<Allergy>) => {
    return <RowDetails clientId={parseInt(clientId)} data={original} />;
  };

  return (
    <>
      <div className="flex flex-wrap items-center p-4">
        <LinkButton
          text={"Registreer Nieuwe Allergie"}
          href={"../allergies/new"}
          className="ml-auto"
        />
      </div>
      {isLoading && <Loader />}
      {data && (
        <PaginatedTable
          data={data}
          columns={columnDef}
          page={page ?? 1}
          isFetching={isFetching}
          onPageChange={(page) => setPage(page)}
          renderRowDetails={renderRowDetails}
        />
      )}
      <div className="flex flex-wrap justify-between items-center p-4"></div>
      {error && (
        <p role="alert" className="text-red-600">
          Sorry, een fout heeft ons verhinderd de allergielijst te laden.
        </p>
      )}
    </>
  );
};

export default AllergiesPage;

type RowDetailsProps = {
  data: Allergy;
  clientId: number;
};

const RowDetails: FunctionComponent<RowDetailsProps> = ({ data, clientId }) => {
  // const {
  //   mutate: deleteAllergy,
  //   isLoading: isDeleting,
  //   isSuccess: isDeleted,
  // } = useDeleteAllergy(data.client);

  // const { open } = useModal(
  //   getDangerActionConfirmationModal({
  //     msg: "Weet je zeker dat je deze allergie wilt verwijderen?",
  //     title: "Allergie Verwijderen",
  //   })
  // );

  return (
    <div className={"grid grid-cols-3 gap-2"}>
      <DetailCell label={"Type Allergie"} value={data.allergy_type} />
      <DetailCell label={"Reactie"} value={data.reaction} />
      <DetailCell
        label={"Ernst"}
        value={
          <div className="mt-2">
            <Severity severity={data.severity} />
          </div>
        }
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
                deleteAllergy(data.id);
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
        <Link href={`/clients/${clientId}/allergies/${data.id}/edit`}>
          <IconButton>
            <PencilSquare className="w-5 h-5" />
          </IconButton>
        </Link>
      </div>
    </div>
  );
};
