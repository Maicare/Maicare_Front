import Button from '@/components/common/Buttons/Button'
import { ArrowRight, Receipt } from 'lucide-react'
import React from 'react'
import ContractItem from './ContractItem'
import ContractPreviewSkeleton from './ContractPreviewSkeleton'

type Props = {
    isParentLoading:boolean;
}

const ContractPreview = ({isParentLoading}:Props) => {
    if (isParentLoading) {
        return(
            <ContractPreviewSkeleton />
        )
    }
    return (
        <div className="w-full h-[287px] rounded-sm shadow-md p-4 bg-white overflow-y-scroll">
            <div className="flex justify-between items-center">
                <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><Receipt size={18} className='text-indigo-400' />Contracten</h1>
                <Button className='bg-indigo-400 text-white text-xs py-1 px-2 rounded-md flex items-center gap-2 '>
                    <span>View All</span>
                    <ArrowRight size={15} className='arrow-animation' />
                </Button>
            </div>
            <div className="mt-4 w-full p-2 flex flex-col gap-2">
                <ContractItem occupation='Physical Therapy' price='500,00' date='1 maanden 9 dagen' />
                <ContractItem occupation='Occupational Therapy' price='900,00' date='3 maanden 2 dagen' />
                <ContractItem occupation='Mental Therapy' price='700,00' date='5 maanden 29 dagen' />
            </div>
        </div>
    )
}

export default ContractPreview