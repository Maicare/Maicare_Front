import CopyTooltip from '@/common/components/CopyTooltip'
import {  Info } from 'lucide-react'
import React from 'react'
import { cn } from '@/utils/cn';
import WorkInformationSkeleton from '../../../_components/WorkInformationSkeleton';

type Props = {
    code:string;
    status:string;
    severity:string;
    diagnosing_clinician:string;
    description:string;
    notes:string;
    isParentLoading:boolean;
}

const DiagnosisInformationCard = ({code,isParentLoading,status,severity,diagnosing_clinician,description,notes}:Props) => {
    if (isParentLoading) {
        return (
            <WorkInformationSkeleton />
        )
    }
    return (
        <div className="w-full h-fit rounded-sm shadow-md p-4 bg-white">
            <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><Info size={18} className='text-indigo-400' /> Diagnosis Information</h1>
            <div className="mt-4 w-full">
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">ICD Code:</p>
                    <CopyTooltip text={code || "Niet gespecificeerd"}>
                        <p className={cn("text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300",code === "" && "bg-orange-100 text-orange-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300")}>{code || "Niet gespecificeerd"}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">Status:</p>
                    <CopyTooltip text={status} >
                        <p className={cn("text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300",status === "" && "bg-orange-100 text-orange-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300")}>{status || "Niet gespecificeerd"}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">Ernst:</p>
                    <CopyTooltip text={severity} >
                        <p className={cn("text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300",severity === "" && "bg-orange-100 text-orange-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300")}>{severity || "Niet gespecificeerd"}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">clinician:</p>
                    <CopyTooltip text={diagnosing_clinician || "Niet gespecificeerd"} >
                        <p className={cn("text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300",diagnosing_clinician === "" && "bg-orange-100 text-orange-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300")}>{diagnosing_clinician || "Niet gespecificeerd"}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">Aandoening:</p>
                    <CopyTooltip text={description || "Niet gespecificeerd"} >
                        <p className={cn("text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300",description === "" && "bg-orange-100 text-orange-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300")}>{description || "Niet gespecificeerd"}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">Notities:</p>
                    <CopyTooltip text={notes || "Niet gespecificeerd"} >
                        <p className={cn("text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300",notes === "" && "bg-orange-100 text-orange-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300")}>{notes || "Niet gespecificeerd"}</p>
                    </CopyTooltip>
                </div>
            </div>
        </div>
    )
}

export default DiagnosisInformationCard