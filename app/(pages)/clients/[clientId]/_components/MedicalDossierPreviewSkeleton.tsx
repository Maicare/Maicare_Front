import { Skeleton } from '@/components/ui/skeleton';
import React from 'react'

const MedicalDossierPreviewSkeleton = () => {
    return (
        <div className="w-full h-[287px] rounded-sm shadow-md p-4 bg-white overflow-y-scroll">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full bg-slate-200" />
              <Skeleton className="h-6 w-[150px] bg-slate-200" />
            </div>
            <Skeleton className="h-8 w-[90px] bg-slate-200 rounded-md" />
          </div>
    
          {/* Accordion Skeleton */}
          <div className="mt-4 w-full p-2 flex flex-col gap-4">
            {/* Diagnose Section */}
            <div className="border rounded-md">
              <div className="flex items-center justify-between p-3 border-b">
                <Skeleton className="h-5 w-[80px] bg-slate-200" />
                <Skeleton className="h-4 w-4 bg-slate-200" />
              </div>
              <div className="p-2 space-y-2">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="grid grid-cols-3 gap-1 p-2">
                    <Skeleton className="h-5 bg-slate-200 rounded-sm" />
                    <Skeleton className="h-5 bg-slate-200 rounded-sm" />
                    <Skeleton className="h-5 bg-slate-200 rounded-sm" />
                    <Skeleton className="h-4 col-span-3 bg-slate-200 rounded-sm mt-1" />
                  </div>
                ))}
              </div>
            </div>
    
            {/* Medicatie Section */}
            <div className="border rounded-md">
              <div className="flex items-center justify-between p-3 border-b">
                <Skeleton className="h-5 w-[80px] bg-slate-200" />
                <Skeleton className="h-4 w-4 bg-slate-200" />
              </div>
              <div className="p-2 space-y-2">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="grid grid-cols-3 gap-1 p-2">
                    <Skeleton className="h-5 bg-slate-200 rounded-sm" />
                    <Skeleton className="h-5 bg-slate-200 rounded-sm" />
                    <Skeleton className="h-5 bg-slate-200 rounded-sm" />
                    <Skeleton className="h-4 col-span-3 bg-slate-200 rounded-sm mt-1" />
                  </div>
                ))}
              </div>
            </div>
    
            {/* Allergieën Section */}
            <div className="border rounded-md">
              <div className="flex items-center justify-between p-3 border-b">
                <Skeleton className="h-5 w-[80px] bg-slate-200" />
                <Skeleton className="h-4 w-4 bg-slate-200" />
              </div>
              <div className="p-2 space-y-2">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="grid grid-cols-3 gap-1 p-2">
                    <Skeleton className="h-5 bg-slate-200 rounded-sm" />
                    <Skeleton className="h-5 bg-slate-200 rounded-sm" />
                    <Skeleton className="h-5 bg-slate-200 rounded-sm" />
                    <Skeleton className="h-4 col-span-3 bg-slate-200 rounded-sm mt-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
}

export default MedicalDossierPreviewSkeleton