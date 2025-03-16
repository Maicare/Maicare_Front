import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const PreviewLoader = () => {
    return (
        <div className="w-[32%] h-[287px] rounded-sm shadow-md p-4 bg-white">
            {/* Header Section Skeleton */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 bg-slate-200 rounded-full" /> {/* Icon */}
                    <Skeleton className="h-6 w-24 bg-slate-200" /> {/* Title */}
                </div>
                <Skeleton className="h-8 w-20 bg-slate-200 rounded-md" /> {/* Button */}
            </div>

            {/* Content Section Skeleton */}
            <div className="mt-4 w-full h-max border-l-4 border-dashed border-slate-200 pl-6 p-2 flex flex-col gap-4">
                {/* Item 1 */}
                <div className="flex items-start gap-2 relative">
                    <Skeleton className="h-4 w-4 bg-slate-200 rounded-full absolute -left-7.5 top-[2px]" /> {/* Arrow Icon */}
                    <Skeleton className="h-5 w-5 bg-slate-200 rounded-full" /> {/* Code Icon */}
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-32 bg-slate-200" /> {/* Title */}
                        <Skeleton className="h-3 w-20 bg-slate-200" /> {/* Subtitle */}
                    </div>
                </div>

                {/* Item 2 */}
                <div className="flex items-start gap-2 relative">
                    <Skeleton className="h-4 w-4 bg-slate-200 rounded-full absolute -left-7.5 top-[2px]" /> {/* Arrow Icon */}
                    <Skeleton className="h-5 w-5 bg-slate-200 rounded-full" /> {/* Code Icon */}
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-32 bg-slate-200" /> {/* Title */}
                        <Skeleton className="h-3 w-20 bg-slate-200" /> {/* Subtitle */}
                    </div>
                </div>

                {/* Item 3 */}
                <div className="flex items-start gap-2 relative mb-6">
                    <Skeleton className="h-4 w-4 bg-slate-200 rounded-full absolute -left-7.5 top-[2px]" /> {/* Arrow Icon */}
                    <Skeleton className="h-5 w-5 bg-slate-200 rounded-full" /> {/* Code Icon */}
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-32 bg-slate-200" /> {/* Title */}
                        <Skeleton className="h-3 w-20 bg-slate-200" /> {/* Subtitle */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PreviewLoader;