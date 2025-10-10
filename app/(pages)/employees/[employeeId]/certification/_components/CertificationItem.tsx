import PrimaryButton from '@/common/components/PrimaryButton'
import { Certification } from '@/types/certification.types';
import { dateFormat } from '@/utils/timeFormatting';
import { Edit, Trash } from 'lucide-react'
import React from 'react'

type Props = {
    certification: Certification;
    onEdit: () => void;
    onDelete: () => void;
}

const CertificationItem = ({certification,onDelete,onEdit}:Props) => {
    return (
        <div className="bg-white rounded-sm w-full ">
            <div className="w-full p-3 flex flex-col items-center justify-center">
                <div className="h-16 w-16 bg-indigo-300 flex items-center justify-center rounded-full border-2 border-indigo-500">
                    <img src="/images/az-900.png" alt="certificaat" className="h-15 w-15 rounded-full bg-cover" />
                </div>
                <h1 className="text-md font-semibold mt-3">{certification.name}</h1>
                <p className="text-sm text-gray-500 text-center">{certification.issued_by}</p>
                <p className="mt-2">{dateFormat(certification.date_issued)}</p>
            </div>
            <div className="p-3 border-t-2 border-t-[#f1f5f9] w-full flex items-center justify-between gap-2">
                <PrimaryButton
                    text='Bewerken'
                    animation='animate-bounce'
                    icon={Edit}
                    onClick={onEdit}
                    className='p-1 text-sm w-[50%] bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white'
                />
                <PrimaryButton
                    text='Verwijderen'
                    animation='animate-bounce'
                    icon={Trash}
                    onClick={onDelete}
                    className='bg-red-100 text-red-500 hover:bg-red-500 hover:text-white p-1 text-sm w-[50%]'
                />
            </div>
        </div>
    )
}

export default CertificationItem