"use client";
import PrimaryButton from '@/common/components/PrimaryButton'
import LargeErrorMessage from '@/components/common/Alerts/LargeErrorMessage';
import Loader from '@/components/common/loader';
import { DataTable } from '@/components/employee/table/data-table';
import { useAssessment } from '@/hooks/assessment/use-assessment';
import { ArrowBigLeft, ArrowBigRight, Goal } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { columns } from './_components/columns';
import UpsertAssessmentSheet from './_components/UpsertAssessmentSheet';
import { CreateAssessment } from '@/schemas/assessment.schema';
import { Assessment, AssessmentResponse } from '@/types/assessment.types';
import { Row } from '@tanstack/table-core';

const GoalsPage = () => {
    const { clientId } = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [assessment, _setAssessment] = useState<Assessment | null>(null);
    const { isLoading, assessments, page, setPage,createOne } = useAssessment({ autoFetch: true, clientId: parseInt(clientId as string) });
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
    const handleOpen = (bool: boolean) => {
        setOpen(bool);
    }
    const handleCreate = async (values: CreateAssessment) => {
        try {
            await createOne(
                [values],parseInt(clientId as string), {
                displayProgress: true,
                displaySuccess: true
            }
            );
            // setIsMutate(p => !p);
        } catch (error) {
            console.log(error);
        }
    }
    const handleUpdate = async (_values: CreateAssessment) => {
        try {
            // await updateOne(
            //     [values],
            //     medication!.id!.toString(),
            //     {
            //         displayProgress: true,
            //         displaySuccess: true
            //     }
            // );
            // setIsMutate(p => !p);
        } catch (error) {
            console.log(error);
        }
    }
    const handleRowClick = (row:Row<AssessmentResponse> ) => {
        router.push(`/clients/${clientId}/goals/${row.original.id}`);
    }
    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'>
                    <Goal size={24} className='text-indigo-400' />  Assessments
                </h1>
                <UpsertAssessmentSheet
                    isOpen={open}
                    handleCreate={handleCreate}
                    handleOpen={handleOpen}
                    handleUpdate={handleUpdate}
                    mode={assessment ? "update" : "create"}
                    assessment={assessment || undefined}
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

export default GoalsPage