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
import { useEmployee } from '@/hooks/employee/use-employee';
import { EmployeeList, EmployeesSearchParams } from '@/types/employee.types';
import { useRouter } from 'next/navigation';
import styles from "./styles.module.css";
import { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import ProfilePicture from '@/components/common/profilePicture/profile-picture';
import { getAge } from '@/utils/get-age';
import { mappingGender } from '@/common/data/gender.data';
import Pagination from '@/components/common/Pagination/Pagination';
import EmployeeFilters from '@/components/employee/EmployeeFilters';
import { useDebounce } from '@/hooks/common/useDebounce';
import LargeErrorMessage from '@/components/common/Alerts/LargeErrorMessage';

const PAGE_SIZE = 10;

const EmployeesPage = () => {
    const router = useRouter();

    const [filters, setFilters] = useState<EmployeesSearchParams>({
        page: 1,
        page_size: PAGE_SIZE,
    });

    const deboucedFilters = useDebounce(filters, 500);

    const { employees, error, isLoading, page, setPage } = useEmployee(deboucedFilters);

    const handleRowClick = (employee: EmployeeList) => {
        router.push(`/employees/${employee.id}`);
    };

    const columnDef = useMemo<ColumnDef<EmployeeList>[]>(() => {
        return [
            {
                id: "profilePicture",
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
                header: () => "Volledige naam",
                accessorFn: (employee) => `${employee.first_name} ${employee.last_name}`,
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
                cell: (info) => mappingGender[(info.getValue() as string).toLowerCase()] || "Niet gespecificeerd",
            },
            {
                accessorKey: "work_phone_number",
                header: () => "Telefoonnummer",
                cell: (info) => info.getValue() || "Niet gespecificeerd",
            },
            {
                accessorKey: "email_address",
                header: () => "E-mailadres",
                cell: (info) => info.getValue() || "Niet gespecificeerd",
            },
        ];
    }, []);

    const pagination = employees ? (
        <div className="p-4 sm:p-6 xl:p-7.5 flex items-center justify-between">
            <Pagination
                page={page}
                disabled={isLoading||error||employees.results.length===0}
                onClick={setPage}
                totalPages={Math.ceil(employees.count / PAGE_SIZE)}
            />
            {isLoading && <div className="text-sm">Fetching page {page}...</div>}
        </div>
    ) : (
        <></>
    );

    return (
        <div>
            <Panel
                title={"Employees List"}
                header={
                    <div className="flex grow justify-between flex-wrap gap-4">
                        <EmployeeFilters
                            onFiltersChange={(values) => {
                                setFilters((vs) => ({ ...vs, ...values }));
                            }}
                        />
                        <PermitableComponent permission={PermissionsObjects.CreateEmployee}>
                            <LinkButton text={"Nieuwe Medewerker Toevoegen"} href={`/employees/new`} />
                        </PermitableComponent>
                    </div>
                }
            >

                {isLoading && <Loader />}
                {pagination}

                {employees && (
                    <Table
                        onRowClick={handleRowClick}
                        data={employees.results}
                        columns={columnDef}
                        className={styles.table}
                    />
                )}

                {employees && employees.results.length === 0 && (
                    <LargeErrorMessage
                        firstLine={"Oops!"}
                        secondLine={
                            "Het lijkt erop dat er geen medewerkers zijn die aan uw zoekcriteria voldoen."
                        }
                    />
                )}
                {error && (
                    <LargeErrorMessage
                        firstLine={"Oops!"}
                        secondLine={"Een fout heeft ons verhinderd de medewerkerslijst op te halen."}
                    />
                )}

                {pagination}

            </Panel>
        </div>
    )
}

export default withAuth(withPermissions(EmployeesPage, { redirectUrl: Routes.Common.NotFound, requiredPermissions: PermissionsObjects.ViewEmployee }), { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login });
