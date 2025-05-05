"use client";
import Loader from '@/components/common/loader'
import { useAssessment } from '@/hooks/assessment/use-assessment';
import { AssessmentResponse } from '@/types/assessment.types';
import { CheckCircle } from 'lucide-react'
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AssessmentDetails } from './_components/AssessmentDetails';
import GoalsDetails from './_components/GoalsDetails';

const AssessmentPage = () => {
    const { assessmentId, clientId } = useParams();
    const { readOne } = useAssessment({ autoFetch: false, clientId: parseInt(clientId as string) });
    const [assessment, setAssessment] = useState<AssessmentResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchClient = async (id: number) => {
            setIsLoading(true);
            const data = await readOne(id);
            setAssessment(data);
            setIsLoading(false);
        };
        if (assessmentId) fetchClient(+assessmentId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assessmentId]);
    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'>
                    <CheckCircle size={24} className='text-indigo-400' />  Assessment
                </h1>
                {/* <UpsertAssessmentSheet
                    isOpen={open}
                    handleCreate={handleCreate}
                    handleOpen={handleOpen}
                    handleUpdate={handleUpdate}
                    mode={assessment ? "update" : "create"}
                    assessment={assessment || undefined}
                /> */}
            </div>
            <div className="grid grid-cols-1 gap-4">
                {
                    isLoading ?
                        <Loader />
                        :
                        <>
                            <AssessmentDetails
                                clientId={clientId as string}
                                assessmentId={assessmentId as string}
                                assessment={assessment ? assessment : undefined}
                            />
                            <GoalsDetails
                                assessmentId={assessmentId as string}
                                clientId={clientId as string}
                            />
                        </>
                }
            </div>
        </div>
    )
}

export default AssessmentPage