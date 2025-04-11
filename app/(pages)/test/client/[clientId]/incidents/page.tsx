"use client";
import PrimaryButton from '@/common/components/PrimaryButton'
import { useIncident } from '@/hooks/incident/use-incident';
import { CreateIncident } from '@/types/incident.types';
import { AlarmClock, ArrowBigLeft, ArrowBigRight, BellRing, PlusCircle, Timer, TriangleAlert } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useModal } from "@/components/providers/ModalProvider";
import { getDangerActionConfirmationModal } from "@/components/common/Modals/DangerActionConfirmation";
import StatisticCard from '@/common/components/StatisticCard';
import Loader from '@/components/common/loader';
import LargeErrorMessage from '@/components/common/Alerts/LargeErrorMessage';
import { DataTable } from '@/components/employee/table/data-table';
import { columns } from './_components/columns';
const Page = () => {

    const [_incident, _setIncident] = useState<CreateIncident & { id: number } | null>(null);
    const { clientId } = useParams();
    const router = useRouter();

    const { isLoading, incidents, page, setPage } = useIncident({ autoFetch: true, clientId: parseInt(clientId as string) });

    const { open: _open } = useModal(
        getDangerActionConfirmationModal({
            msg: "Weet u zeker dat u deze ervaring wilt verwijderen?",
            title: "Ervaring Verwijderen",
        })
    );

    const handlePrevious = () => {
        if (page <= 1) {
            setPage(1);
            return;
        }
        setPage(page - 1);
    }
    const handleNext = () => {
        if (incidents?.next) {
            setPage(page + 1);
            return;
        }
    }
    const handleAdd = () => {
        router.push(`/test/client/${clientId}/incidents/create`);
    }
    // const handleDelete = async (incident: Incident) => {
    //     open({
    //         onConfirm: async () => {
    //             try {
    //                 // await deleteOne(incident, { displayProgress: true, displaySuccess: true });
    //             } catch (error) {
    //                 console.log(error);
    //             }
    //         },
    //     });
    // }
    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'>
                    <BellRing size={24} className='text-indigo-400' />  Incidenten
                </h1>
                <PrimaryButton
                    text="Add"
                    onClick={handleAdd}
                    disabled={false}
                    icon={PlusCircle}
                    animation="animate-bounce"
                    className="bg-indigo-400 text-white"
                />
            </div>
            <div className="w-full grid lg:grid-cols-[repeat(4,280px)] grid-cols-[repeat(3,205px)] md:grid-cols-[repeat(4,205px)] justify-between mb-5 ">
                <StatisticCard colorKey="teal" icon={BellRing} title="Incidenten" value={500} className='lg:w-[280px] ' />
                <StatisticCard colorKey="sky" icon={AlarmClock} title="Avg. Resulution Time" value={3} prefix='Days' className='lg:w-[280px] ' />
                <StatisticCard colorKey="pink" icon={Timer} title="Avg. Response Time" value={4} prefix='Hours' className='lg:w-[280px] ' />
                <StatisticCard colorKey="orange" icon={TriangleAlert} title="Ovl. Rate" value={8} prefix='%' className='lg:w-[280px] ' />
            </div>
            {/* {adding ?
                <UpsertCertificationForm employeeId={parseInt(employeeId as string)} onCancel={cancelAdd} mode="add" onSuccess={cancelAdd} />
                : editing ?
                    <UpsertCertificationForm employeeId={parseInt(employeeId as string)} onCancel={cancelEdit} mode="update" onSuccess={cancelEdit} defaultValues={certification || undefined} />
                    : null
            } */}
            <div className="grid grid-cols-1 gap-4">
                {
                    isLoading ?
                        <Loader />
                        : incidents?.results?.length === 0 ?
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

                                <DataTable columns={columns} data={incidents?.results ?? []} onRowClick={() => { }} className="dark:bg-[#18181b] dark:border-black" />
                                <div className="flex px-2 py-3 bg-white dark:bg-[#18181b] dark:border-black rounded-md mt-5 justify-between border-2 border-muted">
                                    <PrimaryButton
                                        disabled={page === 1}
                                        onClick={handlePrevious}
                                        text={"Previous"}
                                        icon={ArrowBigLeft}
                                        iconSide="left"
                                    />
                                    <PrimaryButton
                                        disabled={incidents?.next ? false : true}
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

export default Page