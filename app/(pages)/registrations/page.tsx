"use client";
import PrimaryButton from "@/common/components/PrimaryButton";
import { DataTable } from "@/components/employee/table/data-table"
import { PAGE_SIZE } from "@/consts";
import { useDebounce } from "@/hooks/common/useDebounce";
import { useRegistration } from "@/hooks/registration/use-registration";
import {  RegistrationParamsFilters } from "@/types/registration.types";
import { ArrowBigLeft, ArrowBigRight, FormInput,  } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { columns } from "./_components/columns";
import TableFilters from "./_components/table-filters";



export default function Page() {

    const router = useRouter();

    const [filters, setFilters] = useState<RegistrationParamsFilters>({
        page: 1,
        page_size: PAGE_SIZE,
        status: "pending",
        risk_aggressive_behavior: false,
        risk_criminal_history: false,
        risk_day_night_rhythm: false,
        risk_flight_behavior: false,
        risk_psychiatric_issues: false,
        risk_sexual_behavior: false,
        risk_suicidal_selfharm: false,
        risk_substance_abuse: false,
        risk_weapon_possession: false,
    });

    const deboucedFilters = useDebounce(filters, 500);

    const { registrations, page, setPage } = useRegistration(deboucedFilters);


    const handlePrevious = () => {
        if (page <= 1) {
            setPage(1);
            return;
        }
        setPage(page - 1);
    }
    const handleNext = () => {
        if (registrations?.next) {
            setPage(page + 1);
            return;
        }
    }
    const handleAdd = () => {
        router.push(`/registrations/new`);
    }
    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'>
                    <FormInput size={24} className='text-indigo-400' />  Registraties
                </h1>
            </div>
            <div className="grid grid-cols-1 gap-4">

                <div className="grid grid-cols-1 gap-4">
                    <TableFilters
                        filters={filters}
                        handleAdd={handleAdd}
                        setFilters={(filters) => setFilters(filters)}
                    />
                    <DataTable columns={columns} data={registrations?.results ?? []} className="dark:bg-[#18181b] dark:border-black" />
                    <div className="flex px-2 py-3 bg-white dark:bg-[#18181b] dark:border-black rounded-md mt-5 justify-between border-2 border-muted">
                        <PrimaryButton
                            disabled={page === 1}
                            onClick={handlePrevious}
                            text={"Previous"}
                            icon={ArrowBigLeft}
                            iconSide="left"
                        />
                        <PrimaryButton
                            disabled={registrations?.next ? false : true}
                            onClick={handleNext}
                            text={"Next"}
                            icon={ArrowBigRight}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}