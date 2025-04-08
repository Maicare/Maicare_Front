import { Skeleton } from '@/components/ui/skeleton';
import React from 'react'

const ContractPreviewSkeleton = () => {
    return (
        <div className="w-full h-[287px] rounded-sm shadow-md p-4 bg-white overflow-y-scroll">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full bg-slate-200" />
                    <Skeleton className="h-6 w-[120px] bg-slate-200" />
                </div>
                <Skeleton className="h-8 w-[90px] bg-slate-200 rounded-md" />
            </div>

            {/* Contract Items Skeleton */}
            <div className="mt-4 w-full p-2 flex flex-col gap-4">
                {[1, 2, 3].map((index) => (
                    <div key={index} className="grid grid-cols-3 gap-2 p-2">
                        {/* Contract Type Skeleton */}
                        <div className="flex items-center gap-2 p-1">
                            <Skeleton className="h-4 w-4 rounded-full bg-slate-200" />
                            <Skeleton className="h-4 w-[80px] bg-slate-200" />
                        </div>

                        {/* Duration Skeleton */}
                        <div className="flex items-center gap-2 p-1">
                            <Skeleton className="h-4 w-4 rounded-full bg-slate-200" />
                            <Skeleton className="h-4 w-[100px] bg-slate-200" />
                        </div>

                        {/* Amount Skeleton */}
                        <div className="flex items-center gap-2 p-1">
                            <Skeleton className="h-4 w-4 rounded-full bg-slate-200" />
                            <Skeleton className="h-4 w-[60px] bg-slate-200" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ContractPreviewSkeleton