import Button from '@/components/common/Buttons/Button'
import { ArrowRight, FileBadge, PlusCircle } from 'lucide-react'
import React from 'react'
import ReportItem from './ReportItem';
import ReportsPreviewSkeleton from './ReportsPreviewSkeleton';
import { useReport } from '@/hooks/report/use-report';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import PrimaryButton from '@/common/components/PrimaryButton';

type Props = {
    isParentLoading: boolean;
}

const ReportsPreview = ({ isParentLoading }: Props) => {

    const { clientId } = useParams();
    const router = useRouter();

    const { reports, isLoading } = useReport({ autoFetch: true, clientId: parseInt(clientId as string) });

    if (isParentLoading || isLoading) {
        return (
            <ReportsPreviewSkeleton />
        )
    }
    if (!reports || reports.results.length === 0) {
        return (
            <div className="w-full h-[287px] rounded-sm shadow-md p-4 bg-white overflow-y-scroll">
                <div className="flex justify-between items-center">
                    <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><FileBadge size={18} className='text-indigo-400' />Rapporten</h1>
                    <Link href={`/clients/${clientId}/reports/user-reports`}>
                        <Button className='bg-indigo-400 text-white text-xs py-1 px-2 rounded-md flex items-center gap-2 '>
                            <span>View All</span>
                            <ArrowRight size={15} className='arrow-animation' />
                        </Button>
                    </Link>
                </div>
                <div className="mt-4 w-full h-max border-slate-200 pl-6 p-2 flex flex-col items-center justify-center gap-4 ">
                    <Image height={200} width={200} src={"/images/no-data.webp"} alt='no data found!' />
                    <PrimaryButton
                        text='Add Report'
                        animation='animate-bounce'
                        icon={PlusCircle}
                        onClick={()=>router.push(`/clients/${clientId}/reports/user-reports`)}
                    />
                </div>
            </div>
        )
    }
    return (
        <div className="w-full h-[287px] rounded-sm shadow-md p-4 bg-white overflow-y-scroll">
            <div className="flex justify-between items-center">
                <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><FileBadge size={18} className='text-indigo-400' />Rapporten</h1>
                <Link href={`/clients/${clientId}/reports/user-reports`}>
                    <Button className='bg-indigo-400 text-white text-xs py-1 px-2 rounded-md flex items-center gap-2 '>
                        <span>View All</span>
                        <ArrowRight size={15} className='arrow-animation' />
                    </Button>
                </Link>
            </div>
            <div className="mt-4 w-full p-2 flex flex-col gap-4 ">
                {reports?.results.map(({ date, report_text, emotional_state, type, employee_profile_picture }, index) => (
                    <ReportItem
                        key={index}
                        image={employee_profile_picture ?? "/images/avatar-1.jpg"}
                        date={date}
                        report={report_text}
                        state={emotional_state}
                        type={type}
                    />
                ))}
            </div>
        </div>
    )
}

export default ReportsPreview