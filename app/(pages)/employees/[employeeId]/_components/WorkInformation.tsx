import CopyTooltip from '@/common/components/CopyTooltip'
import { Briefcase } from 'lucide-react'
import React from 'react'
import WorkInformationSkeleton from './WorkInformationSkeleton';

type Props = {
    position:string;
    private_email_address:string;
    work_phone_number:string;
    department:string;
    employee_number:string;
    employment_number:string;
    isParentLoading:boolean;
}

const WorkInformation = ({department,employee_number,employment_number,position,private_email_address,work_phone_number,isParentLoading}:Props) => {
    if (isParentLoading) {
        return (
            <WorkInformationSkeleton />
        )
    }
    return (
        <div className="w-[32%] h-[287px] rounded-sm shadow-md p-4 bg-white">
            <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><Briefcase size={18} className='text-indigo-400' /> Werkgegevens</h1>
            <p className="mt-4 text-slate-400">
                Hier vindt u de werkgerelateerde informatie van de medewerker, inclusief functie, contactgegevens en identificatienummers.
            </p>
            <div className="mt-4 w-full">
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">Functie:</p>
                    <CopyTooltip text={position || "Niet gespecificeerd"}>
                        <p className="text-sm text-slate-400 ">{position || "Niet gespecificeerd"}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">Werk E-mail:</p>
                    <CopyTooltip text={private_email_address} >
                        <p className="text-sm text-slate-400 ">{private_email_address}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">Werk Telefoonnummer:</p>
                    <CopyTooltip text={work_phone_number} >
                        <p className="text-sm text-slate-400 ">{work_phone_number}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">Afdeling:</p>
                    <CopyTooltip text={department || "Niet gespecificeerd"} >
                        <p className="text-sm text-slate-400 ">{department || "Niet gespecificeerd"}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">Medewerkernummer:</p>
                    <CopyTooltip text={employee_number || "Niet gespecificeerd"} >
                        <p className="text-sm text-slate-400 ">{employee_number || "Niet gespecificeerd"}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">Dienstnummer:</p>
                    <CopyTooltip text={employment_number || "Niet gespecificeerd"} >
                        <p className="text-sm text-slate-400 ">{employment_number || "Niet gespecificeerd"}</p>
                    </CopyTooltip>
                </div>
            </div>
        </div>
    )
}

export default WorkInformation