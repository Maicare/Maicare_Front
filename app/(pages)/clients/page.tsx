"use client";
import PrimaryButton from "@/common/components/PrimaryButton";
import StatisticCard from "@/common/components/StatisticCard";
import { DataTable } from "@/components/employee/table/data-table"
import { PAGE_SIZE } from "@/consts";
import { useClient } from "@/hooks/client/use-client";
import { useDebounce } from "@/hooks/common/useDebounce";
import { Client, ClientsSearchParams } from "@/types/client.types";
import { Row } from "@tanstack/table-core";
import { ArrowBigLeft, ArrowBigRight, ListRestart, ListX, SquareActivity, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { columns } from "./_components/columns";
import TableFilters from "./_components/TableFilters";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";



function Page() {

    const router = useRouter();

    const [filters, setFilters] = useState<ClientsSearchParams>({
        page: 1,
        page_size: PAGE_SIZE,
        search: "",
        status: "On Waiting List"
    });

    const deboucedFilters = useDebounce(filters, 500);

    const { clients, page, setPage, readClientCounts } = useClient(deboucedFilters);
    const [clientCounts, setClientCounts] = useState<{
        clients_in_care: number;
        clients_on_waiting_list: number;
        clients_out_of_care: number;
        total_clients: number;
    }>({
        clients_in_care: 0,
        clients_on_waiting_list: 0,
        clients_out_of_care: 0,
        total_clients: 0
    });

    const fetchClientCounts = async () => {
        try {
            const counts = await readClientCounts();
            setClientCounts(counts);
        } catch (error) {
            console.error("Error fetching client counts:", error);
        }
    };

    useEffect(() => {
        fetchClientCounts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRowClick = (employeeRow: Row<Client>) => {
        // const employee = employeeRow.original;
        // router.push(`/clients/${employee.id}/overview`);
    };

    const handlePrevious = () => {
        if (page <= 1) {
            setPage(1);
            return;
        }
        setPage(page - 1);
    }
    const handleNext = () => {
        if (clients?.next) {
            setPage(page + 1);
            return;
        }
    }
    const handleAdd = () => {
        router.push(`/clients/new`);
    }
    return (
        <div className="">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-xl font-semibold">Clients</h1>
                <p>Dashboard / <span className="font-medium text-indigo-500 hover:cursor-pointer">Clients</span></p>
            </div>
            <div className="w-full grid lg:grid-cols-[repeat(4,230px)] grid-cols-[repeat(3,205px)] md:grid-cols-[repeat(4,205px)] justify-between mb-5 ">
                <StatisticCard colorKey="teal" icon={Users} title="Clienten" value={clientCounts.total_clients} />
                <StatisticCard colorKey="sky" icon={ListRestart} title="Wachtlijst" value={clientCounts.clients_on_waiting_list} />
                <StatisticCard colorKey="pink" icon={SquareActivity} title="In Zorg" value={clientCounts.clients_in_care} />
                <StatisticCard colorKey="orange" icon={ListX} title="Uit Zorg" value={clientCounts.clients_out_of_care} />
            </div>
            <TableFilters
                filters={filters}
                handleAdd={handleAdd}
                setFilters={(filters) => setFilters(filters)}
            />
            <DataTable columns={columns} data={clients?.results ?? []} onRowClick={handleRowClick} className="dark:bg-[#18181b] dark:border-black" />
            <div className="flex px-2 py-3 bg-white dark:bg-[#18181b] dark:border-black rounded-md mt-5 justify-between border-2 border-muted">
                <PrimaryButton
                    disabled={page === 1}
                    onClick={handlePrevious}
                    text={"Previous"}
                    icon={ArrowBigLeft}
                    iconSide="left"
                />
                <PrimaryButton
                    disabled={clients?.next ? false : true}
                    onClick={handleNext}
                    text={"Next"}
                    icon={ArrowBigRight}
                />
            </div>
        </div>
    )
}

export default withAuth(
    withPermissions(Page, {
        redirectUrl: Routes.Common.NotFound,
        requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permission
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);