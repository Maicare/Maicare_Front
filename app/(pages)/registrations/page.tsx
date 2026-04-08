"use client";
import React, { useEffect, useState } from "react";
import { useRegistration } from "@/hooks/registration/use-registration";
import { Registration } from "@/types/registration.types";
import Loader from "@/components/common/loader";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/employee/table/data-table";
import { columns } from "./_components/columns";
import PrimaryButton from "@/common/components/PrimaryButton";
import { ArrowBigLeft, ArrowBigRight, Users, CheckCircle, Clock, XCircle } from "lucide-react";
import StatisticCard from "@/common/components/StatisticCard";
import TableFilters from "../clients/_components/TableFilters";
import { ClientsSearchParams } from "@/types/client.types";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { motion } from "framer-motion";

const RegistrationsList = () => {
    const { readAll } = useRegistration();
    const [registrations, setRegistrations] = useState<PaginatedResponse<Registration> | null>(null);
    const [loading, setLoading] = useState(true);

    // Set standard filters matching other lists
    const [filters, setFilters] = useState<ClientsSearchParams>({
        page: 1,
        page_size: 10,
        search: "",
        status: ""
    });

    const router = useRouter();

    useEffect(() => {
        const fetchRegistrations = async () => {
            setLoading(true);
            try {
                const data = await readAll({
                    Page: filters.page,
                    PageSize: filters.page_size,
                    search: filters.search,
                    status: filters.status
                });
                // Ensure data falls back to empty paginated response if wrapped oddly
                if (Array.isArray(data)) {
                    setRegistrations({ results: data, count: data.length, next: null, previous: null, page_size: filters.page_size || 10 });
                } else if (data && data.results) {
                    setRegistrations(data);
                } else {
                    setRegistrations({ results: [], count: 0, next: null, previous: null, page_size: filters.page_size || 10 });
                }
            } catch (error) {
                console.error("Failed to fetch registrations", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRegistrations();
    }, [filters.page, filters.page_size, filters.search, filters.status]);

    const handlePrevious = () => {
        if ((filters.page || 1) <= 1) return;
        setFilters(prev => ({ ...prev, page: (prev.page || 2) - 1 }));
    };

    const handleNext = () => {
        if (!registrations?.next) return;
        setFilters(prev => ({ ...prev, page: (prev.page || 0) + 1 }));
    };

    const handleAdd = () => {
        router.push(`/registration_form`); // Assuming public route
    };

    if (loading) return <Loader />;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-1"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-slate-900 to-slate-500 bg-clip-text text-transparent dark:from-white dark:to-slate-400 mb-1">
                        Aanmeldingen
                    </h1>
                    <p className="text-sm text-slate-400 font-medium font-satoshi tracking-tight">Beheer en bekijk alle inkomende aanmeldingen.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                    <span>Dashboard</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                    <span className="text-primary">Aanmeldingen</span>
                </div>
            </div>

            <div className="w-full grid lg:grid-cols-[repeat(4,230px)] grid-cols-[repeat(3,205px)] md:grid-cols-[repeat(4,205px)] gap-4 mb-5">
                <StatisticCard colorKey="teal" icon={Users} title="Totaal Aanmeldingen" value={registrations?.count || 0} />
                <StatisticCard colorKey="sky" icon={Clock} title="In Afwachting" value={0} />
                <StatisticCard colorKey="pink" icon={CheckCircle} title="Goedgekeurd" value={0} />
                <StatisticCard colorKey="orange" icon={XCircle} title="Afgewezen" value={0} />
            </div>

            <TableFilters
                filters={filters}
                handleAdd={handleAdd}
                setFilters={(newFilters) => setFilters(newFilters)}
            />

            {loading && !registrations?.results.length ? (
                <div className="flex justify-center py-20"><Loader /></div>
            ) : (
                <>
                    <DataTable
                        columns={columns}
                        data={registrations?.results || []}
                        onRowClick={(row) => router.push(`/registrations/${row.original.id}`)}
                        className="dark:bg-[#18181b] dark:border-black"
                    />

                    <div className="flex px-2 py-3 bg-white dark:bg-[#18181b] dark:border-black rounded-md mt-5 justify-between border-2 border-muted">
                        <PrimaryButton
                            disabled={(filters.page || 1) === 1}
                            onClick={handlePrevious}
                            text="Vorige"
                            icon={ArrowBigLeft}
                            iconSide="left"
                            type="button"
                        />
                        <div className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300">
                            Pagina {filters.page}
                        </div>
                        <PrimaryButton
                            disabled={!registrations?.next}
                            onClick={handleNext}
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

export default RegistrationsList;
