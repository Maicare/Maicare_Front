import { Skeleton } from '@/components/ui/skeleton';
import React from 'react'

const DocumentPreviewSkeleton = () => {
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

            {/* Document List Skeleton */}
            <div className="mt-4 w-full p-2 flex flex-col gap-2">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="flex items-center justify-between p-2">
                        {/* Document Label - alternates width to simulate different text lengths */}
                        <Skeleton
                            className={`h-5 bg-slate-200 rounded-sm w-[90%]`}
                        />

                        {/* Icon - alternates between red and green variants */}
                        <Skeleton className="h-4 w-4 rounded-full bg-slate-200" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DocumentPreviewSkeleton