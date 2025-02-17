"use client";

import React, { FunctionComponent, useMemo } from "react";
import { ColumnDef, Row } from "@tanstack/table-core";
import { fullDateTimeFormat } from "@/utils/timeFormatting";
// import { useModal } from "@/components/providers/ModalProvider";
import Link from "next/link";
import PencilSquare from "@/components/icons/PencilSquare";
import { Episode } from "@/types/episode.types";
import { useEpisode } from "@/hooks/episode/use-episode";
import Severity from "@/components/common/Severity/Severity";
import { convertIntensityToSeverity } from "@/utils/convertIntensityToSeverity";
import LinkButton from "@/components/common/Buttons/LinkButton";
import Loader from "@/components/common/loader";
import PaginatedTable from "@/components/common/PaginatedTable/PaginatedTable";
// import { getDangerActionConfirmationModal } from "@/components/common/Modals/DangerActionConfirmation";
import DetailCell from "@/components/common/DetailCell";
import IconButton from "@/components/common/Buttons/IconButton";
import { useParams } from "next/navigation";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";

const EpisodesPage: FunctionComponent = () => {
  const params = useParams();
  const clientIdParam = params?.clientId;
  const clientId = clientIdParam as string;

  const {
    episodes: data,
    page,
    setPage,
    error,
    isLoading,
    isFetching,
  } = useEpisode(parseInt(clientId));

  const columnDef = useMemo<ColumnDef<Episode>[]>(() => {
    return [
      {
        accessorKey: "date",
        header: "Geregistreerde Datum",
        cell: (info) => fullDateTimeFormat(info.getValue() as string),
      },
      {
        accessorKey: "intensity",
        header: "Intensiteit",
        cell: (info) => (
          <div className="flex justify-center w-full">
            <Severity
              severity={convertIntensityToSeverity(info.getValue() as number)}
            />
          </div>
        ),
      },
      {
        accessorKey: "state_description",
        header: "Beschrijving van de Toestand",
      },
    ];
  }, []);

  if (!clientId) {
    return null;
  }

  const renderRowDetails = ({ original }: Row<Episode>) => {
    return <RowDetails data={original} clientId={parseInt(clientId)} />;
  };

  return (
    <>
      <div className="flex flex-wrap items-center p-4">
        <LinkButton
          text={"Registreer Nieuwe Episode"}
          href={"../episodes/new"}
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
      {error && (
        <p role="alert" className="text-red-600">
          Sorry, een fout heeft ons verhinderd de episodelijst te laden.
        </p>
      )}
    </>
  );
};

export default withAuth(
  withPermissions(EpisodesPage, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permisssion
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);

type RowDetailsProps = {
  data: Episode;
  clientId: number;
};

const RowDetails: FunctionComponent<RowDetailsProps> = ({ data, clientId }) => {
  // const {
  //   mutate: deleteEpisode,
  //   isLoading: isDeleting,
  //   isSuccess: isDeleted,
  // } = useDeleteEpisode(data.client);

  // const { open } = useModal(
  //   getDangerActionConfirmationModal({
  //     msg: "Weet je zeker dat je deze episode wilt verwijderen?",
  //     title: "Episode Verwijderen",
  //   })
  // );

  return (
    <div className={"grid grid-cols-2 gap-2"}>
      <DetailCell
        label={"Geregistreerde Datum"}
        value={fullDateTimeFormat(data.date)}
      />
      <DetailCell
        label={"Intensiteit"}
        value={
          <div className="mt-2">
            <Severity severity={convertIntensityToSeverity(data.intensity)} />
          </div>
        }
      />
      <DetailCell
        className={"col-span-2"}
        label={"Beschrijving van de Toestand"}
        value={data.state_description}
      />
      <div className="flex gap-4">
        {/* <IconButton
          buttonType="Danger"
          onClick={() => {
            open({
              onConfirm: () => {
                deleteEpisode(data.id);
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
        <Link href={`/clients/${clientId}/episodes/${data.id}/edit`}>
          <IconButton>
            <PencilSquare className="w-5 h-5" />
          </IconButton>
        </Link>
      </div>
    </div>
  );
};
