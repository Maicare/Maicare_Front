import CopyTooltip from '@/common/components/CopyTooltip'
import { useLocation } from '@/hooks/location/use-location';
import { Location } from '@/types/location.types';
import { InfoIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import PersonalInformationSkeleton from './PersonalInformationSkeleton';

type Props = {
    first_name: string;
    last_name: string;
    email: string;
    private_phone_number: string;
    location_id: number;
    isParentLoading: boolean;
}

const PersonalInformation = ({ email, first_name, last_name, location_id, private_phone_number, isParentLoading }: Props) => {
    const { readOne } = useLocation({autoFetch:false});
    const [location, setLocation] = useState<Location | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchLocationById = async (id:number) => {
            setIsLoading(true);
            const data = await readOne(id);
            setLocation(data);
            setIsLoading(false);
        }
        if (location_id && !isParentLoading) {
            fetchLocationById(location_id);
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[location_id,isParentLoading]);
    if (isLoading || isParentLoading) {
        return (
            <PersonalInformationSkeleton />
        )
    }
    console.log({location})
    return (
        <div className="w-[32%] h-[287px] rounded-sm shadow-md p-4 bg-white">
            <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><InfoIcon size={18} className='text-indigo-400' /> Persoonsgegevens</h1>
            <p className="mt-4 text-slate-400">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem. description text here.
            </p>
            <div className="mt-4 w-full">
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">Full Name:</p>
                    <CopyTooltip text="Bourichi Taha">
                        <p className="text-sm text-slate-400 ">{first_name + " " + last_name}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">Email:</p>
                    <CopyTooltip text="bourichi.taha@gmail.com" >
                        <p className="text-sm text-slate-400 ">{email}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">Mobile:</p>
                    <CopyTooltip text={private_phone_number} >
                        <p className="text-sm text-slate-400 ">{private_phone_number}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">Location:</p>
                    <CopyTooltip text={location?.address} >
                        <p className="text-sm text-slate-400 ">{location?.address}</p>
                    </CopyTooltip>
                </div>
            </div>
        </div>
    )
}

export default PersonalInformation