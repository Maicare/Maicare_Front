import { BriefcaseBusiness, CalendarCheck, CircleDollarSign } from 'lucide-react'
import React from 'react'

type Props = {
    occupation:string;
    date:string;
    price:string;
}

const ContractItem = ({date,occupation,price}:Props) => {
    return (
        <div className="grid grid-cols-3 gap-2 hover:bg-gray-100 hover:rounded-md p-2 hover:cursor-pointer">
            {/* <Image src={image} alt='profile image' height={40} width={40} className='object-cover rounded-md' /> */}
            <div className="flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300">
                <BriefcaseBusiness className='h-4 w-4 text-green-900 dark:text-green-200' />
                <h1 className='text-xs px-2.5 py-0.5 text-green-900 dark:text-green-200'>{occupation}</h1>
            </div>
            <div className="flex items-center bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300">
                <CalendarCheck className='!h-5 !w-5 text-orange-900 dark:text-orange-200' />
                <h1 className='text-xs text-orange-700 px-2.5 py-0.5 dark:text-orange-200'>{date}</h1>
            </div>
            <div className="flex items-center bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-sky-900 dark:text-sky-300">
                <CircleDollarSign className='h-4 w-4 text-sky-900 dark:text-sky-200' />
                <span className='bg-sky-100 text-sky-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-sky-900 dark:text-sky-200'>{price}</span>
            </div>
        </div>
    )
}

export default ContractItem