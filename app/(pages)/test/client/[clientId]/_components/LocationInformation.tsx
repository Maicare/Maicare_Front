import CopyTooltip from '@/common/components/CopyTooltip'
import {  LocateIcon } from 'lucide-react'
import React from 'react'
import WorkInformationSkeleton from './WorkInformationSkeleton';
import { cn } from '@/utils/cn';

type Props = {
    departement:string;
    Zipcode:string;
    city:string;
    streetname:string;
    street_number:string;
    location:string;
    isParentLoading:boolean;
}

const LocationInformation = ({streetname,street_number,location,departement,Zipcode,city,isParentLoading}:Props) => {
    if (isParentLoading) {
        return (
            <WorkInformationSkeleton />
        )
    }
    return (
        <div className="w-full h-[287px] rounded-sm shadow-md p-4 bg-white">
            <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><LocateIcon size={18} className='text-indigo-400' /> Location Information</h1>
            <div className="mt-4 w-full">
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">departement:</p>
                    <CopyTooltip text={departement || "Niet gespecificeerd"}>
                        <p className={cn("text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300",departement === "" && "bg-orange-100 text-orange-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300")}>{departement || "Niet gespecificeerd"}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">Postal:</p>
                    <CopyTooltip text={Zipcode} >
                        <p className={cn("text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300",Zipcode === "" && "bg-orange-100 text-orange-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300")}>{Zipcode || "Niet gespecificeerd"}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">city:</p>
                    <CopyTooltip text={city} >
                        <p className={cn("text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300",city === "" && "bg-orange-100 text-orange-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300")}>{city || "Niet gespecificeerd"}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">streetname:</p>
                    <CopyTooltip text={streetname || "Niet gespecificeerd"} >
                        <p className={cn("text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300",streetname === "" && "bg-orange-100 text-orange-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300")}>{streetname || "Niet gespecificeerd"}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">street number:</p>
                    <CopyTooltip text={street_number || "Niet gespecificeerd"} >
                        <p className={cn("text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300",street_number === "" && "bg-orange-100 text-orange-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300")}>{street_number || "Niet gespecificeerd"}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">location:</p>
                    <CopyTooltip text={location || "Niet gespecificeerd"} >
                        <p className={cn("text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300",location === "" && "bg-orange-100 text-orange-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300")}>{location || "Niet gespecificeerd"}</p>
                    </CopyTooltip>
                </div>
            </div>
        </div>
    )
}

export default LocationInformation