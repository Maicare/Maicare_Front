import Button from '@/components/common/Buttons/Button'
import { DOCUMENT_LABELS } from '@/consts';
import { ArrowRight, CheckCircle, Edit, FileText, XCircle } from 'lucide-react'
import React from 'react'
import DocumentPreviewSkeleton from './DocumentPreviewSkeleton';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useDocument } from '@/hooks/document/use-document';
import Image from 'next/image';
import PrimaryButton from '@/common/components/PrimaryButton';

type Props = {
    isParentLoading: boolean;
}

const DocumentsPreview = ({ isParentLoading }: Props) => {

    const { clientId } = useParams();
    const { isLoading, documents } = useDocument({ autoFetch: true, clientId: parseInt(clientId as string) })
    const router = useRouter();
    if (isParentLoading || isLoading) {
        return (
            <DocumentPreviewSkeleton />
        );
    }
    if (documents.results.length === 0) {
        return (
            <div className="w-full h-[287px] rounded-sm shadow-md p-4 bg-white overflow-y-scroll">
                <div className="flex justify-between items-center">
                    <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><FileText size={18} className='text-indigo-400' />Documenten</h1>
                    <Link href={`/clients/${clientId}/documents`}>
                        <Button className='bg-indigo-400 text-white text-xs py-1 px-2 rounded-md flex items-center gap-2 ' onClick={() => router.push(`/clients/${clientId}/documents`)}>
                            <span>View All</span>
                            <ArrowRight size={15} className='arrow-animation' />
                        </Button>
                    </Link>
                </div>
                <div className="mt-4 w-full p-2 flex flex-col items-center justify-center gap-1 ">
                    <Image
                        height={200}
                        width={200}
                        src="/images/no-data.webp"
                        alt="no data found!"
                    />
                    <PrimaryButton
                        text='Add Documents'
                        animation='animate-bounce'
                        icon={Edit}
                        onClick={() => router.push(`/clients/${clientId}/documents`)}
                    />
                </div>
            </div>
        )
    }
    return (
        <div className="w-full h-[287px] rounded-sm shadow-md p-4 bg-white overflow-y-scroll">
            <div className="flex justify-between items-center">
                <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><FileText size={18} className='text-indigo-400' />Documenten</h1>
                <Link href={`/clients/${clientId}/documents`}>
                    <Button className='bg-indigo-400 text-white text-xs py-1 px-2 rounded-md flex items-center gap-2 ' onClick={() => router.push(`/clients/${clientId}/documents`)}>
                        <span>View All</span>
                        <ArrowRight size={15} className='arrow-animation' />
                    </Button>
                </Link>
            </div>
            <div className="mt-4 w-full p-2 flex flex-col gap-1 ">
                {
                    Object.entries(DOCUMENT_LABELS).map(([key, value], index) => {
                        if (documents.results.some(i => i.label === key)) {
                            return (
                                <div key={index} className="flex items-center justify-between hover:bg-green-100 hover:rounded-md p-2 hover:cursor-pointer">
                                    <p className='bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300'>{value}</p>
                                    <CheckCircle className='h-4 w-4 text-green-800' />
                                </div>
                            )
                        }
                        return (
                            <div key={index} className="flex items-center justify-between hover:bg-red-100 hover:rounded-md p-2 hover:cursor-pointer">
                                <p className='bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300'>{value}</p>
                                <XCircle className='h-4 w-4 text-red-800' />
                            </div>
                        )

                    })
                }
            </div>
        </div>
    )
}

export default DocumentsPreview