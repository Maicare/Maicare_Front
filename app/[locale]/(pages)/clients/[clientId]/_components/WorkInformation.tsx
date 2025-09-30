import CopyTooltip from '@/common/components/CopyTooltip'
import { Briefcase } from 'lucide-react'
import React from 'react'
import WorkInformationSkeleton from './WorkInformationSkeleton';
import { useI18n } from '@/lib/i18n/client';

type Props = {
    organisation:string;
    legal_measure:string;
    infix:string;
    source:string;
    filenumber:string;
    bsn:string;
    isParentLoading:boolean;
}

const WorkInformation = ({source,filenumber,bsn,organisation,legal_measure,infix,isParentLoading}:Props) => {
    const t = useI18n();
    if (isParentLoading) {
        return (
            <WorkInformationSkeleton />
        )
    }
    return (
        <div className="w-full h-[287px] rounded-sm shadow-md p-4 bg-white">
            <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><Briefcase size={18} className='text-indigo-400' /> {t("clients.profile.workDetails")}</h1>
            <div className="mt-4 w-full">
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">{t("clients.profile.organization")}:</p>
                    <CopyTooltip text={organisation}>
                        <p className="text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300">{organisation}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">{t("clients.profile.legalMeasure")}:</p>
                    <CopyTooltip text={legal_measure} >
                        <p className="text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300">{legal_measure}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">{t("clients.profile.middleName")}:</p>
                    <CopyTooltip text={infix} >
                        <p className="text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300">{infix}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">{t("clients.profile.source")}:</p>
                    <CopyTooltip text={source} >
                        <p className="text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300">{source}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">{t("clients.profile.fileNumber")}:</p>
                    <CopyTooltip text={filenumber} >
                        <p className="text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300">{filenumber}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">{t("clients.profile.bsn")}:</p>
                    <CopyTooltip text={bsn} >
                        <p className="text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300">{bsn}</p>
                    </CopyTooltip>
                </div>
            </div>
        </div>
    )
}

export default WorkInformation