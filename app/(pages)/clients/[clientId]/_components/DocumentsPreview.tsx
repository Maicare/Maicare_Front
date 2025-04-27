import Button from '@/components/common/Buttons/Button'
import { DOCUMENT_LABELS } from '@/consts';
import { ArrowRight, CheckCircle, FileText, XCircle } from 'lucide-react'
import React from 'react'
import DocumentPreviewSkeleton from './DocumentPreviewSkeleton';
type Props = {
    isParentLoading: boolean;
}
const DocumentsPreview = ({ isParentLoading }: Props) => {
    if (isParentLoading) {
        return(
            <DocumentPreviewSkeleton/>
        );
    }
    return (
        <div className="w-full h-[287px] rounded-sm shadow-md p-4 bg-white overflow-y-scroll">
            <div className="flex justify-between items-center">
                <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><FileText size={18} className='text-indigo-400' />Documenten</h1>
                <Button className='bg-indigo-400 text-white text-xs py-1 px-2 rounded-md flex items-center gap-2 '>
                    <span>View All</span>
                    <ArrowRight size={15} className='arrow-animation' />
                </Button>
            </div>
            <div className="mt-4 w-full p-2 flex flex-col gap-1 ">
                {
                    Object.entries(DOCUMENT_LABELS).map(([_Key, value], index) => {
                        if (index % 3 === 0) {
                            return (
                                <div key={index} className="flex items-center justify-between hover:bg-red-100 hover:rounded-md p-2 hover:cursor-pointer">
                                    <p className='bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300'>{value}</p>
                                    <XCircle className='h-4 w-4 text-red-800' />
                                </div>
                            )
                        }
                        return (
                            <div key={index} className="flex items-center justify-between hover:bg-green-100 hover:rounded-md p-2 hover:cursor-pointer">
                                <p className='bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300'>{value}</p>
                                <CheckCircle className='h-4 w-4 text-green-800' />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default DocumentsPreview