"use client";
import PrimaryButton from '@/common/components/PrimaryButton';
import LargeErrorMessage from '@/components/common/Alerts/LargeErrorMessage';
import Loader from '@/components/common/loader';
import { DataTable } from '@/components/employee/table/data-table';
import { useAssessment } from '@/hooks/assessment/use-assessment';
import { CarePlan } from '@/types/care-plan.types';
import { Row } from '@tanstack/table-core';
import { ArrowBigLeft, ArrowBigRight, BrainCircuit } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { columns } from './_components/columns';

const ListingCarePlans = () => {
    const { clientId } = useParams();
    const router = useRouter();
    const [__, _setCarePlan] = useState<CarePlan | null>(null);
    const { isLoading, assessments, page, setPage } = useAssessment({ autoFetch: true, clientId: parseInt(clientId as string) });
    const handlePrevious = () => {
        if (page <= 1) {
            setPage(1);
            return;
        }
        setPage(page - 1);
    }
    const handleNext = () => {
        if (assessments?.next) {
            setPage(page + 1);
            return;
        }
    }
    // const handleAdd = () => {
    //     router.push(`/clients/${clientId}/assessments/create`);
    // }

    const handleCreate = async () => {
        router.push(`/clients/${clientId}/care-plan/create`);
    }

    const handleRowClick = (row: Row<CarePlan>) => {
        router.push(`/clients/${clientId}/care-plan/${row.original.care_plan_id}`);
    }
    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'>
                    <BrainCircuit size={24} className='text-indigo-400' />  Zorgplan
                </h1>
                <PrimaryButton
                    onClick={handleCreate}
                    text={"Nieuw Zorgplan"}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white"
                />
            </div>
            <div className="grid grid-cols-1 gap-4">
                {
                    isLoading ?
                        <Loader />
                        : assessments?.results?.length === 0 ?
                            <div className="col-span-4 w-full flex items-center justify-center">
                                <LargeErrorMessage
                                    firstLine={"Oops!"}
                                    secondLine={
                                        "Het lijkt erop dat er geen medewerkers zijn die aan uw zoekcriteria voldoen."
                                    }
                                    className="w-full"
                                />
                            </div>
                            :
                            <div className="grid grid-cols-1 gap-4">
                                <DataTable columns={columns} data={assessments?.results ?? []} onRowClick={handleRowClick} className="dark:bg-[#18181b] dark:border-black" />
                                <div className="flex px-2 py-3 bg-white dark:bg-[#18181b] dark:border-black rounded-md mt-5 justify-between border-2 border-muted">
                                    <PrimaryButton
                                        disabled={page === 1}
                                        onClick={handlePrevious}
                                        text={"Previous"}
                                        icon={ArrowBigLeft}
                                        iconSide="left"
                                    />
                                    <PrimaryButton
                                        disabled={assessments?.next ? false : true}
                                        onClick={handleNext}
                                        text={"Next"}
                                        icon={ArrowBigRight}
                                    />
                                </div>
                            </div>
                }
            </div>
        </div>
    )
}

export default ListingCarePlans