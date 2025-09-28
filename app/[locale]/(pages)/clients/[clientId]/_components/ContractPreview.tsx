import Button from '@/components/common/Buttons/Button'
import { ArrowRight, Receipt } from 'lucide-react'
import React from 'react'
import ContractItem from './ContractItem'
import ContractPreviewSkeleton from './ContractPreviewSkeleton'
import { useContract } from '@/hooks/contract/use-contract'
import { formatDateToDutch } from '@/utils/timeFormatting'
import { useParams, useRouter } from 'next/navigation'
import { useLocalizedPath } from '@/hooks/common/useLocalizedPath'

type Props = {
    isParentLoading: boolean;
}

const ContractPreview = ({ isParentLoading }: Props) => {
    const {clientId} = useParams();
    const { contracts } = useContract({autoFetch:true,clientId:clientId as string});
    const router = useRouter();
  const { currentLocale } = useLocalizedPath();

    if (isParentLoading) {
        return (
            <ContractPreviewSkeleton />
        )
    }
    return (
        <div className="w-full h-[287px] rounded-sm shadow-md p-4 bg-white overflow-y-scroll">
            <div className="flex justify-between items-center">
                <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><Receipt size={18} className='text-indigo-400' />Contracten</h1>
                <Button className='bg-indigo-400 text-white text-xs py-1 px-2 rounded-md flex items-center gap-2 ' onClick={()=>router.push(`/${currentLocale}/clients/${clientId}/contract`)}>
                    <span>View All</span>
                    <ArrowRight size={15} className='arrow-animation' />
                </Button>
            </div>
            <div className="mt-4 w-full p-2 flex flex-col gap-2">
                {
                    contracts?.results.map((c) => (
                        <ContractItem key={c.id} occupation={c.care_name} price={c.price.toString()} date={formatDateToDutch(c.start_date,true)} />
                    ))
                }
            </div>
        </div>
    )
}

export default ContractPreview