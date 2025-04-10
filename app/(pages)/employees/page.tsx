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
import IconButton from '@/components/common/Buttons/IconButton';
import { Archive } from 'lucide-react';
import GroupIcon from '@/components/icons/GroupIcon';
import BuildingIcon from '@/components/icons/BuildingIcon';

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
                    info.getValue() ? getAge(info.getValue() as string) : <span className='bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300'>Niet gespecificeerd</span>,
            },
            {
                accessorKey: "gender",
                header: () => "Geslacht",
                cell: (info) => mappingGender[(info.getValue() as string).toLowerCase()] || <span className='bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300'>Niet gespecificeerd</span>,
            },
            {
                accessorKey: "work_phone_number",
                header: () => "Telefoonnummer",
                cell: (info) => info.getValue() || <span className='bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300'>Niet gespecificeerd</span>,
            },
            {
                accessorKey: "email",
                header: () => "E-mailadres",
                cell: (info) => info.getValue() || <span className='bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300'>Niet gespecificeerd</span>,
            },
        ];
    }, []);

    const pagination = employees ? (
        <div className="p-4 sm:p-6 xl:p-7.5 flex items-center justify-between">
            <Pagination
                page={page}
                disabled={isLoading || error || employees.results.length === 0}
                onClick={setPage}
                totalPages={Math.ceil(employees.count / PAGE_SIZE)}
            />
            {isLoading && <div className="text-sm font-semibold">Fetching page {page}...</div>}
        </div>
    ) : (
        <></>
    );

    return (
        <div>
            <div className="flex justify-between items-center">
                <div className='p-5 flex justify-between items-center w-60 rounded-lg bg-white shadow-md mb-4'>
                    <div className=" flex flex-col gap-4">
                        <h1 className='text-xl font-bold'>Medewerkers</h1>
                        <p className='text-sm font-semibold'>800</p>
                    </div>
                    <IconButton className='relative flex items-center justify-center overflow-hidden h-12 w-12'>
                        <div className="h-full w-full absolute before:content-['']  before:-top-1 before:right-1/3 before:rotate-45 before:absolute before:w-2 before:h-14 before:bg-white/20 before:rounded-sm"></div>
                        <GroupIcon />
                        <div className="h-full w-full absolute before:content-['']  before:-top-12 before:right-1/2 before:rotate-45 before:absolute before:w-2 before:h-20 before:bg-white/40 before:rounded-sm hover:before:translate-x-10 hover:before:translate-y-10 before:transition-all before:duration-600 before:ease-in-out"></div>
                    </IconButton>
                </div>
                <div className='p-5 flex justify-between items-center w-60 rounded-lg bg-white shadow-md mb-4'>
                    <div className=" flex flex-col gap-4">
                        <h1 className='text-xl font-bold'>Locatie</h1>
                        <p className='text-sm font-semibold'>10</p>
                    </div>
                    <IconButton className='relative flex items-center justify-center overflow-hidden h-12 w-12'>
                        <div className="h-full w-full absolute before:content-['']  before:-top-1 before:right-1/3 before:rotate-45 before:absolute before:w-2 before:h-14 before:bg-white/20 before:rounded-sm"></div>
                        <BuildingIcon />
                        <div className="h-full w-full absolute before:content-['']  before:-top-12 before:right-1/2 before:rotate-45 before:absolute before:w-2 before:h-20 before:bg-white/40 before:rounded-sm hover:before:translate-x-10 hover:before:translate-y-10 before:transition-all before:duration-600 before:ease-in-out"></div>
                    </IconButton>
                </div>
                <div className='p-5 flex justify-between items-center w-60 rounded-lg bg-white shadow-md mb-4'>
                    <div className=" flex flex-col gap-4">
                        <h1 className='text-xl font-bold'>Uit Dienst</h1>
                        <p className='text-sm font-semibold'>37</p>
                    </div>
                    <IconButton className='relative flex items-center justify-center overflow-hidden h-12 w-12'>
                        <div className="h-full w-full absolute before:content-['']  before:-top-1 before:right-1/3 before:rotate-45 before:absolute before:w-2 before:h-14 before:bg-white/20 before:rounded-sm"></div>
                        <Archive className='h-6 w-6' />
                        <div className="h-full w-full absolute before:content-['']  before:-top-12 before:right-1/2 before:rotate-45 before:absolute before:w-2 before:h-20 before:bg-white/40 before:rounded-sm hover:before:translate-x-10 hover:before:translate-y-10 before:transition-all before:duration-600 before:ease-in-out"></div>
                    </IconButton>
                </div>
                <div className='p-5 flex justify-between items-center w-60 rounded-lg bg-white shadow-md mb-4'>
                    <div className=" flex flex-col gap-4">
                        <h1 className='text-xl font-bold'>Medewerkers</h1>
                        <p className='text-sm font-semibold'>800</p>
                    </div>
                    <IconButton className='relative flex items-center justify-center overflow-hidden h-12 w-12'>
                        <div className="h-full w-full absolute before:content-['']  before:-top-1 before:right-1/3 before:rotate-45 before:absolute before:w-2 before:h-14 before:bg-white/20 before:rounded-sm"></div>
                        <GroupIcon />
                        <div className="h-full w-full absolute before:content-['']  before:-top-12 before:right-1/2 before:rotate-45 before:absolute before:w-2 before:h-20 before:bg-white/40 before:rounded-sm hover:before:translate-x-10 hover:before:translate-y-10 before:transition-all before:duration-600 before:ease-in-out"></div>
                    </IconButton>
                </div>
            </div>
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
