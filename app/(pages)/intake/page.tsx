"use client";
import { PermissionsObjects } from "@/common/data/permission.data";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import React, { useState } from 'react';
import { useIntake } from "@/hooks/intake/use-intake";
import Loader from "@/components/common/loader";
import { useRouter } from "next/navigation";
import LargeErrorMessage from "@/components/common/Alerts/LargeErrorMessage";
import { DataTable } from "@/components/employee/table/data-table";
import { columns } from "./_components/columns";
import PrimaryButton from "@/common/components/PrimaryButton";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { motion } from "framer-motion";


const ClientsPage = () => {
    const router = useRouter();
    const [sortBy, setSortBy] = useState('urgency_score');
    const [search, setSearch] = useState('');
    const [moveLoading, setMoveLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const { intakes, isLoading, moveToWaitingList } = useIntake({
        autoFetch: true,
        sort_by: sortBy,
        search,
        page: currentPage
    });



    const handleRowClick = (row: any) => {
        router.push(`/intake/${row.original.id}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 max-w-6xl mx-auto"
        >
            <div className="mb-6">
                <h1 className="text-3xl font-black mb-1 bg-gradient-to-r from-slate-900 to-slate-500 bg-clip-text text-transparent dark:from-white dark:to-slate-400">
                    Intakebeheer
                </h1>
                {!isLoading && <p className="text-slate-400 font-medium tracking-wide">
                    {intakes?.count} cliënten op de wachtlijst
                </p>}
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader />
                </div>
            ) : (!intakes || intakes.results.length === 0) ? (
                <LargeErrorMessage
                    firstLine="Geen cliënten gevonden"
                    secondLine="Er zijn momenteel geen cliënten die voldoen aan uw criteria."
                />
            ) : (
                <>
                    <DataTable
                        columns={columns}
                        data={intakes.results}
                        onRowClick={handleRowClick}
                        className="dark:bg-[#18181b] dark:border-black shadow-sm"
                    />

                    <div className="flex justify-between px-2 py-3 bg-white dark:bg-[#18181b] dark:border-black rounded-md mt-5 border-2 border-muted shadow-sm">
                        <PrimaryButton
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            text="Vorige"
                            icon={ArrowBigLeft}
                            iconSide="left"
                            type="button"
                        />
                        <div className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300">
                            Pagina {currentPage}
                        </div>
                        <PrimaryButton
                            disabled={!intakes.next}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            text="Volgende"
                            icon={ArrowBigRight}
                            type="button"
                        />
                    </div>
                </>
            )}
        </motion.div>
    );
};

export default withAuth(
    withPermissions(ClientsPage, {
        redirectUrl: Routes.Common.NotFound,
        requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Voeg de correcte permissie toe
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);
