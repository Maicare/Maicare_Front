import { Skeleton } from '@/components/ui/skeleton';
import React from 'react'

const ReportsPreviewSkeleton = () => {
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
    
          {/* Report Items Skeleton */}
          <div className="mt-4 w-full p-2 flex flex-col gap-4">
            {[1, 2, 3].map((index) => (
              <div key={index} className="flex items-center gap-2 p-2">
                {/* Image Skeleton */}
                <Skeleton className="h-10 w-10 rounded-md bg-slate-200" />
                
                {/* Content Grid Skeleton */}
                <div className="grid grid-cols-3 gap-1 flex-1">
                  {/* Type Badge Skeleton */}
                  <Skeleton className="h-5 w-full bg-slate-200 rounded-sm" />
                  
                  {/* State Badge Skeleton */}
                  <Skeleton className="h-5 w-full bg-slate-200 rounded-sm" />
                  
                  {/* Date Badge Skeleton */}
                  <Skeleton className="h-5 w-full bg-slate-200 rounded-sm" />
                  
                  {/* Report Text Skeleton (full width) */}
                  <Skeleton className="h-4 w-full bg-slate-200 rounded-sm col-span-3 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
}

export default ReportsPreviewSkeleton