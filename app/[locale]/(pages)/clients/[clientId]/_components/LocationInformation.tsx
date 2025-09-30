import CopyTooltip from '@/common/components/CopyTooltip'
import {  LocateIcon } from 'lucide-react'
import React from 'react'
import WorkInformationSkeleton from './WorkInformationSkeleton';
import { cn } from '@/utils/cn';
import { useI18n } from '@/lib/i18n/client';

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
    const t = useI18n();
    if (isParentLoading) {
        return (
            <WorkInformationSkeleton />
        )
    }
    return (
        <div className="w-full h-[287px] rounded-sm shadow-md p-4 bg-white">
            <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><LocateIcon size={18} className='text-indigo-400' /> {t("clients.profile.locationDetails")}</h1>
            <div className="mt-4 w-full">
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">{t("clients.profile.department")}:</p>
                    <CopyTooltip text={departement}>
                        <p className={cn("text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300",departement === "" && "bg-orange-100 text-orange-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300")}>{departement}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">{t("clients.profile.postalCode")}:</p>
                    <CopyTooltip text={Zipcode} >
                        <p className={cn("text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300",Zipcode === "" && "bg-orange-100 text-orange-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300")}>{Zipcode}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">{t("clients.profile.city")}:</p>
                    <CopyTooltip text={city} >
                        <p className={cn("text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300",city === "" && "bg-orange-100 text-orange-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300")}>{city}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">{t("clients.profile.streetName")}:</p>
                    <CopyTooltip text={streetname} >
                        <p className={cn("text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300",streetname === "" && "bg-orange-100 text-orange-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300")}>{streetname}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">{t("clients.profile.streetNumber")}:</p>
                    <CopyTooltip text={street_number} >
                        <p className={cn("text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300",street_number === "" && "bg-orange-100 text-orange-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300")}>{street_number}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">{t("clients.profile.location")}:</p>
                    <CopyTooltip text={location} >
                        <p className={cn("text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300",location === "" && "bg-orange-100 text-orange-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300")}>{location}</p>
                    </CopyTooltip>
                </div>
            </div>
        </div>
    )
}

export default LocationInformation