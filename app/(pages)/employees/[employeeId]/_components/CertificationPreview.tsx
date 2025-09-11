import { useCertificate } from '@/hooks/certificate/use-certificate';
import { cn } from '@/utils/cn';
import { dateFormat } from '@/utils/timeFormatting';
import { ArrowRight, ArrowRightCircle, BookMarked, Code, PlusCircle } from 'lucide-react'
import React from 'react'
import Button from '@/components/common/Buttons/Button';
import Image from 'next/image';
import PrimaryButton from '@/common/components/PrimaryButton';
import PreviewLoader from './PreviewLoader';


type Props = {
    employeeId: string;
}

const CertificationPreview = ({ employeeId }: Props) => {
    const { isLoading, certificates } = useCertificate({ autoFetch: true, employeeId });
    if (isLoading) {
        return (
            <PreviewLoader />
        )
    }
    if (certificates?.length === 0) {
        return (
            <div className="w-[32%] h-[287px] rounded-sm shadow-md p-4 bg-white">
                <div className="flex justify-between items-center">
                    <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><BookMarked size={18} className='text-indigo-400' /> Certificaten</h1>
                    <Button className='bg-indigo-400 text-white text-xs py-1 px-2 rounded-md flex items-center gap-2 '>
                        <span>View All</span>
                        <ArrowRight size={15} className='arrow-animation' />
                    </Button>
                </div>
                <div className="mt-4 w-full h-max border-slate-200 pl-6 p-2 flex flex-col items-center justify-center gap-4 ">
                    <Image height={200} width={200} src={"/images/no-data.webp"} alt='no data found!' />
                    <PrimaryButton
                        text='Add Certificates'
                        animation='animate-bounce'
                        icon={PlusCircle}

                    />
                </div>
            </div>
        )
    }
    return (
        <div className="w-[32%] h-[287px] rounded-sm shadow-md p-4 bg-white">
            <div className="flex justify-between items-center">
                <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><BookMarked size={18} className='text-indigo-400' /> Certifications</h1>
                <Button className='bg-indigo-400 text-white text-xs py-1 px-2 rounded-md flex items-center gap-2 '>
                    <span>View All</span>
                    <ArrowRight size={15} className='arrow-animation' />
                </Button>
            </div>
            <div className="mt-4 w-full h-max border-l-4 border-dashed border-slate-200 pl-6 p-2 flex flex-col gap-4 ">
                {
                    certificates?.map((item, index) => {
                        if (index > 2) return null;
                        return (
                            <div key={index} className="flex items-start gap-2 relative">
                                <ArrowRightCircle size={15} className={cn('absolute -left-7.5 top-[2px]', index === 0 && "text-indigo-400 arrow-animation")} />
                                <Code size={20} className='text-indigo-400' />
                                <div className='flex flex-col gap-2'>
                                    <p className="text-sm text-slate-600 font-bold">{item.name}</p>
                                    <p className="text-xs text-indigo-400 font-medium">{dateFormat(item.date_issued)}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default CertificationPreview