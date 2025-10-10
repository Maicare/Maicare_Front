import Image from 'next/image'
import React from 'react'

type Props = {
    image:string;
    type:string;
    state:string;
    date:string;
    report:string;
}

const ReportItem = ({date,image,report,state,type}:Props) => {
    return (
        <div className="flex items-center gap-2 hover:bg-gray-100 hover:rounded-md p-2 hover:cursor-pointer">
            <Image src={image} alt='profile image' height={40} width={40} className='object-cover rounded-md' />
            <div className="grid grid-cols-3 gap-1">
                <span className='bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300'>{type}</span>
                <span className='bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300'>{state}</span>
                <span className='bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-sky-900 dark:text-sky-300'>{date}</span>
                <p className="text-xs text-slate-500 font-medium px-2.5 py-0.5 col-span-3 truncate">
                    {report}
                </p>
            </div>
        </div>
    )
}

export default ReportItem