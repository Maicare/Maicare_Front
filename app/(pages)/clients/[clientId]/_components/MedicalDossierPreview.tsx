import Button from '@/components/common/Buttons/Button'
import { ArrowRight, HeartPulse } from 'lucide-react'
import React from 'react'
import MedicalDossierPreviewSkeleton from './MedicalDossierPreviewSkeleton';
import { useParams, useRouter } from 'next/navigation';
import { useDiagnosis } from '@/hooks/diagnosis/use-diagnosis';
import Link from 'next/link';
import { formatDateToDutch } from '@/utils/timeFormatting';

type Props = {
    isParentLoading: boolean;
}

const MedicalDossierPreview = ({ isParentLoading }: Props) => {

    const { clientId } = useParams();
    const { diagnosis } = useDiagnosis({ autoFetch: true, clientId: parseInt(clientId as string) });
    const router = useRouter();

    if (isParentLoading) {
        return (
            <MedicalDossierPreviewSkeleton />
        )
    }
    return (
        <div className="w-full h-[287px] rounded-sm shadow-md p-4 bg-white overflow-y-scroll">
            <div className="flex justify-between items-center">
                <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><HeartPulse size={18} className='text-indigo-400' />Medisch dossier</h1>
                <Link href={`/clients/${clientId}/medical-record`}>
                    <Button className='bg-indigo-400 text-white text-xs py-1 px-2 rounded-md flex items-center gap-2 ' onClick={() => router.push(`/clients/${clientId}/medical-record`)}>
                        <span>Alles bekijken</span>
                        <ArrowRight size={15} className='arrow-animation' />
                    </Button>
                </Link>
            </div>
            {diagnosis?.results.length === 0 ? (
                <div className="mt-4 w-full h-max border-slate-200 pl-6 p-2 flex flex-col items-center justify-center gap-4 ">
                    <p className='text-slate-500 font-medium'>Geen medisch dossier gevonden</p>
                </div>
            ) : null}
            <div className="mt-4 w-full p-2 flex flex-col gap-4 ">

                {diagnosis?.results.map(({ title, diagnosis_code, created_at, description }, index) => (
                    <div key={index} className="grid grid-cols-3 gap-1 hover:bg-gray-100 hover:rounded-md p-2 hover:cursor-pointer">
                        <span className='bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300'>{title}</span>
                        <span className='bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300'>{diagnosis_code}</span>
                        <span className='bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-sky-900 dark:text-sky-300'>{formatDateToDutch(created_at!, true)}</span>
                        <p className="text-xs text-slate-500 font-medium px-2.5 py-0.5 col-span-3 truncate">
                            {description}
                        </p>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default MedicalDossierPreview