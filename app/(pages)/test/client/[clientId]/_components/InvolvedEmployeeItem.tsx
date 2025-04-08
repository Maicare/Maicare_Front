import { formatDateToDutch } from '@/utils/timeFormatting';
import { CalendarCheck } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

type Props = {
    image:string;
    fullName:string;
    start_date:string;
    relation:string;
}
const InvolvedEmployeeItem = ({start_date,fullName,image,relation}:Props) => {
    return (
        <div className="flex items-center gap-2 hover:bg-slate-300 hover:rounded-md p-2">
            <Image src={image} alt='profile image' height={40} width={40} className='object-cover rounded-md' />
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <h1 className='text-base text-slate-700'>{fullName}</h1>
                    <span className='bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300'>{relation}</span>
                </div>
                <p className='flex items-center gap-2 text-sm'><CalendarCheck className='h-3 w-3 text-indigo-500' /> {formatDateToDutch(start_date)} </p>
            </div>
        </div>
    )
}

export default InvolvedEmployeeItem