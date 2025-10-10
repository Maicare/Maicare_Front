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
            <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><InfoIcon size={18} className='text-indigo-400' /> Persoonlijke gegevens</h1>
            <p className="mt-4 text-slate-400">
                Hier vindt u de persoonlijke basisinformatie van de cliënt, zoals naam, contactgegevens en geboorteplaats.
            </p>
            <div className="mt-4 w-full">
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">Volledige naam:</p>
                    <CopyTooltip text={first_name + " " + last_name}>
                        <p className="text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300">{first_name + " " + last_name}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">E-mail:</p>
                    <CopyTooltip text={email} >
                        <p className="text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300">{email}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">Telefoonnummer:</p>
                    <CopyTooltip text={private_phone_number} >
                        <p className="text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300">{private_phone_number}</p>
                    </CopyTooltip>
                </div>
                <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">Geboorteplaats:</p>
                    <CopyTooltip text={birthplace} >
                        <p className="text-xs bg-indigo-100 text-indigo-800  font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300">{birthplace}</p>
                    </CopyTooltip>
                </div>
            </div>
        </div>
    )
}

export default PersonalInformation