import { dateFormat } from '@/utils/timeFormatting'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import ProfileInformationSkeleton from './ProfileInformationSkeleton'
import { UpdateStatusButton } from './UpdateStatusButton'
import { useParams } from 'next/navigation'

type Props = {
    profile_picture:string;
    first_name:string;
    last_name:string;
    date_of_birth:string;
    gender:string;
    status:string;
    isParentLoading:boolean;
}

const ProfileInformation = ({date_of_birth,first_name,gender,last_name,profile_picture,isParentLoading,status}:Props) => {
    const {clientId} = useParams();
    if (isParentLoading) {
        return (
            <ProfileInformationSkeleton />
        )
    }

    return (
        <div className="w-full h-[287px] rounded-sm shadow-md bg-white">
            <div className="h-34 bg-indigo-400 text-indigo-600 flex justify-between rounded-sm">
                <div className="p-4">
                    <h1 className="">Hello World</h1>
                    <p className="text-sm">it will like simplified!</p>
                </div>
                <Image src={"/images/profile-img.png"} width={200} height={100} className="object-cover" alt="profile" />
            </div>
            <div className="p-4 h-31 flex justify-between w-full bg-white">
                <div className="flex flex-col items-start relative w-[40%]">
                    <div className="rounded-full border-2 border-white absolute -top-10 left-0 h-[50px] w-[50px] overflow-hidden">
                        <Image src={profile_picture || "/images/avatar-1.jpg"} width={"50"} height={"50"} className="rounded-full object-cover h-full w-full" alt="profile" />
                    </div>
                    <div className="mt-10">
                        <p className="text-sm font-medium">{first_name + " " + last_name}</p>
                        <span className='bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300'>{status}</span>
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
                    <UpdateStatusButton onConfirm={()=>{}} clientId={clientId as string} status={status} />
                </div>
            </div>
        </div>
    )
}

export default ProfileInformation