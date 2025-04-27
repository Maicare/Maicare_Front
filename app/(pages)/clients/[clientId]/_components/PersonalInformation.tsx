import CopyTooltip from '@/common/components/CopyTooltip'
import { InfoIcon } from 'lucide-react'
import PersonalInformationSkeleton from './PersonalInformationSkeleton';

type Props = {
    first_name: string;
    last_name: string;
    email: string;
    private_phone_number: string;
    birthplace: string;
    isParentLoading: boolean;
}

const PersonalInformation = ({ email, first_name, last_name, birthplace, private_phone_number, isParentLoading }: Props) => {
    
    if (isParentLoading) {
        return (
            <PersonalInformationSkeleton />
        )
    }
    return (
        <div className="w-full h-[287px] rounded-sm shadow-md p-4 bg-white">
            <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><InfoIcon size={18} className='text-indigo-400' /> Personal Information</h1>
            <p className="mt-4 text-slate-400">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem. description text here.
            </p>
            <div className="mt-4 w-full">
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">Full Name:</p>
                    <CopyTooltip text="Bourichi Taha">
                        <p className="text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300">{first_name + " " + last_name}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">Email:</p>
                    <CopyTooltip text="bourichi.taha@gmail.com" >
                        <p className="text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300">{email}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">Mobile:</p>
                    <CopyTooltip text={private_phone_number} >
                        <p className="text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300">{private_phone_number}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">Birthplace:</p>
                    <CopyTooltip text={birthplace} >
                        <p className="text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300">{birthplace}</p>
                    </CopyTooltip>
                </div>
            </div>
        </div>
    )
}

export default PersonalInformation