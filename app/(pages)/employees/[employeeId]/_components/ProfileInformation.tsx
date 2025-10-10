import { useRole } from '@/hooks/role/use-role'
import { dateFormat } from '@/utils/timeFormatting'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import ProfileInformationSkeleton from './ProfileInformationSkeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type Props = {
    profile_picture:string;
    first_name:string;
    last_name:string;
    role_id:number;
    date_of_birth:string;
    gender:string;
    isParentLoading:boolean;
}

const ProfileInformation = ({date_of_birth,first_name,gender,last_name,profile_picture,role_id,isParentLoading}:Props) => {
    const {roles,isLoading} = useRole({autoFetch:true});

    if (isLoading || isParentLoading) {
        return (
            <ProfileInformationSkeleton />
        )
    }

    const role = roles?.find(item=>item.id === role_id);
    return (
        <div className="w-[32%] h-[287px] rounded-sm shadow-md bg-white">
            <div className="h-34 bg-indigo-400 text-indigo-600 flex justify-between rounded-sm">
                <div className="p-4">
                    <h1 className="">Profiel Informatie</h1>
                    <p className="text-sm">Persoonlijke gegevens</p>
                </div>
                <Image src={"/images/profile-img.png"} width={200} height={100} className="object-cover" alt="profiel" />
            </div>
            <div className="p-4 h-31 flex justify-between w-full bg-white">
                <div className="flex flex-col items-start relative w-[30%]">
                    <div className="rounded-full border-2 border-white absolute -top-8 left-0 h-[50px] w-[50px] overflow-hidden">
                        {/* <Image src={profile_picture || "/images/avatar-1.jpg"} width={50} height={50} className="rounded-full" alt="profiel" /> */}
                        <Avatar className="h-full w-full rounded-full">
                            <AvatarImage src={profile_picture} alt={first_name} />
                            <AvatarFallback className="rounded-full bg-indigo-400 text-white">{first_name[0].toUpperCase()+last_name[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="mt-10">
                        <p className="text-sm font-medium">{first_name + " " + last_name}</p>
                        <span className='text-xs font-medium text-slate-400'>{role?.role_name}</span>
                    </div>
                </div>
                <div className="w-[60%] flex flex-col justify-between">
                    <div className="flex">
                        <div className="w-[50%]">
                            <p className="text-xs text-slate-400">Geboortedatum</p>
                            <p className="text-sm font-medium">{dateFormat(date_of_birth ?? "")}</p>
                        </div>
                        <div className="w-[50%]">
                            <p className="text-xs text-slate-400">Geslacht</p>
                            <p className="text-sm font-medium">{gender}</p>
                        </div>
                    </div>
                    <button className='flex items-center justify-center gap-2 bg-indigo-400 text-white rounded-md py-2 text-sm w-[50%]'>
                        <span>Details Bekijken</span>
                        <ArrowRight size={15} className='arrow-animation' />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProfileInformation