"use client";
import { PermitableComponent } from '@/common/components/permitable-component';
import { PermissionsObjects } from '@/common/data/permission.data';
import withAuth, { AUTH_MODE } from '@/common/hocs/with-auth';
import withPermissions from '@/common/hocs/with-permissions';
import Routes from '@/common/routes';
import LinkButton from '@/components/common/Buttons/LinkButton';
import Loader from '@/components/common/loader';
import Panel from '@/components/common/Panel/Panel';
import Table from '@/components/common/Table/Table';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import ProfilePicture from '@/components/common/profilePicture/profile-picture';
import { getAge } from '@/utils/get-age';
import { mappingGender } from '@/common/data/gender.data';
import Pagination from '@/components/common/Pagination/Pagination';
import LargeErrorMessage from '@/components/common/Alerts/LargeErrorMessage';
import { useClient } from '@/hooks/client/use-client';
import { Client } from '@/types/client.types';
import styles from "./styles.module.css";
export const STATUS_RECORD:Record<string,string> = {
    "On Waiting List": "Wachtlijst",
    "In Care": "In Zorg",
    "Out Of Care": "Uit Zorg",
  };
const PAGE_SIZE = 10;

const ClientsPage = () => {
    const router = useRouter();

    const { clients, error, isLoading, page, setPage } = useClient({});

    const handleRowClick = (client: Client) => {
        router.push(`/clients/${client.id}`);
    };

    const columnDef = useMemo<ColumnDef<Client>[]>(() => {
        return [
          {
            id: "profilePicture",
            // Profile
            header: () => <div className="text-center">Profiel</div>,
            cell: (info) => (
              <div className="flex items-center justify-center">
                <ProfilePicture
                  profilePicture={info.row.original.profile_picture}
                  width={48}
                  height={48}
                />
              </div>
            ),
          },
          {
            id: "full_name",
            header: () => "Volledige Naam",
            accessorFn: (client) => `${client.first_name} ${client.last_name}`,
          },
          {
            accessorKey: "date_of_birth",
            header: () => "Leeftijd",
            cell: (info) =>
              info.getValue() ? getAge(info.getValue() as string) : "Niet gespecificeerd",
          },
          {
            accessorKey: "gender",
            header: () => "Geslacht",
            cell: (info) => mappingGender[info.getValue() as string] || "Niet gespecificeerd",
          },
          {
            accessorKey: "status",
            header: () => "Status",
            cell: (info) => STATUS_RECORD[info.getValue() as string] || "N/A",
          },
          {
            accessorKey: "document_info",
            header: () => "Documenten",
            cell: (_info) => {
            //   let missing_documents = info.getValue() ["not_uploaded_document_labels"]?.length;
              const missing_documents = 0;
              return missing_documents > 0 ? (
                <span className="text-red-600">{missing_documents} missende documenten</span>
              ) : (
                <span className="text-green">✅ voltooid</span>
              );
            },
          },
        ];
      }, []);

    const pagination = clients ? (
        <div className="p-4 sm:p-6 xl:p-7.5 flex items-center justify-between">
            <Pagination
                page={page}
                disabled={isLoading || error || clients.results.length === 0}
                onClick={setPage}
                totalPages={Math.ceil(clients.count / PAGE_SIZE)}
            />
            {isLoading && <div className="text-sm">Fetching page {page}...</div>}
        </div>
    ) : (
        <></>
    );

    return (
        <div>
            <Panel
                title={"Clients List"}
                header={
                    <div className="flex grow justify-between flex-wrap gap-4">
                        
                        <PermitableComponent permission={PermissionsObjects.CreateEmployee}>
                            <LinkButton text={"Nieuwe Medewerker Toevoegen"} href={`/clients/new`} />
                        </PermitableComponent>
                    </div>
                }
            >

                {isLoading && <Loader />}
                {pagination}

                {clients && (
                    <Table
                        onRowClick={handleRowClick}
                        data={clients.results}
                        columns={columnDef}
                        className={styles.table}
                    />
                )}

                {clients && clients.results.length === 0 && (
                    <LargeErrorMessage
                        firstLine={"Oops!"}
                        secondLine={
                            "Het lijkt erop dat er geen medewerkers zijn die aan uw zoekcriteria voldoen."
                        }
                    />
                )}
                {/* {error && (
                    <LargeErrorMessage
                        firstLine={"Oops!"}
                        secondLine={"Een fout heeft ons verhinderd de medewerkerslijst op te halen."}
                    />
                )} */}

                {pagination}

            </Panel>
        </div>
    )
}

export default withAuth(withPermissions(ClientsPage, { redirectUrl: Routes.Common.NotFound, requiredPermissions: PermissionsObjects.ViewEmployee }), { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login });
