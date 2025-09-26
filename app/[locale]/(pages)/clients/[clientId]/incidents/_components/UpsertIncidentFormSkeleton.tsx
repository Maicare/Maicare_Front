import { Skeleton } from "@/components/ui/skeleton"

const UpsertIncidentFormSkeleton = () => {
    return (
        <div className="grid grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            {/* General Information Card */}
            <div className="bg-white rounded-md border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-[180px] bg-slate-200 rounded-sm" />
                <Skeleton className="h-[1px] w-full max-w-[200px] bg-slate-200" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`${i === 3 || i === 5 ? 'col-span-2' : ''}`}>
                    <Skeleton className="h-4 w-[120px] bg-slate-200 mb-2 rounded-sm" />
                    <Skeleton className="h-10 w-full bg-slate-200 rounded-sm" />
                  </div>
                ))}
              </div>
            </div>
    
            {/* Cause Card */}
            <div className="bg-white rounded-md border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-[220px] bg-slate-200 rounded-sm" />
                <Skeleton className="h-[1px] w-full max-w-[200px] bg-slate-200" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`${i < 4 ? 'col-span-2' : ''}`}>
                    <Skeleton className="h-4 w-[120px] bg-slate-200 mb-2 rounded-sm" />
                    {i < 4 ? (
                      <div className="grid grid-cols-3 gap-3">
                        {[...Array(i === 0 ? 6 : 3)].map((_, j) => (
                          <div key={j} className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 bg-slate-200 rounded-sm" />
                            <Skeleton className="h-4 w-[80px] bg-slate-200 rounded-sm" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Skeleton className="h-24 w-full bg-slate-200 rounded-sm" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
    
          {/* Right Column */}
          <div className="flex flex-col gap-4">
            {/* Incident Information Card */}
            <div className="bg-white rounded-md border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-[180px] bg-slate-200 rounded-sm" />
                <Skeleton className="h-[1px] w-full max-w-[200px] bg-slate-200" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`${i === 1 || i >= 4 ? 'col-span-2' : ''}`}>
                    <Skeleton className="h-4 w-[120px] bg-slate-200 mb-2 rounded-sm" />
                    {i === 1 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {[...Array(10)].map((_, j) => (
                          <div key={j} className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 bg-slate-200 rounded-sm" />
                            <Skeleton className="h-4 w-[100px] bg-slate-200 rounded-sm" />
                          </div>
                        ))}
                      </div>
                    ) : i >= 4 ? (
                      <Skeleton className="h-24 w-full bg-slate-200 rounded-sm" />
                    ) : (
                      <Skeleton className="h-10 w-full bg-slate-200 rounded-sm" />
                    )}
                  </div>
                ))}
              </div>
            </div>
    
            {/* Consequences Card */}
            <div className="bg-white rounded-md border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-[100px] bg-slate-200 rounded-sm" />
                <Skeleton className="h-[1px] w-full max-w-[200px] bg-slate-200" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`${i !== 2 ? 'col-span-2' : ''}`}>
                    <Skeleton className="h-4 w-[160px] bg-slate-200 mb-2 rounded-sm" />
                    {i !== 2 ? (
                      <Skeleton className={`h-${i === 0 || i === 1 || i === 4 ? '24' : '10'} w-full bg-slate-200 rounded-sm`} />
                    ) : (
                      <Skeleton className="h-10 w-full bg-slate-200 rounded-sm" />
                    )}
                  </div>
                ))}
              </div>
            </div>
    
            {/* Follow-up Card */}
            <div className="bg-white rounded-md border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-[100px] bg-slate-200 rounded-sm" />
                <Skeleton className="h-[1px] w-full max-w-[200px] bg-slate-200" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`${i === 0 || i === 1 || i === 4 ? 'col-span-2' : ''}`}>
                    <Skeleton className="h-4 w-[120px] bg-slate-200 mb-2 rounded-sm" />
                    {i === 0 ? (
                      <div className="grid grid-cols-3 gap-3">
                        {[...Array(6)].map((_, j) => (
                          <div key={j} className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 bg-slate-200 rounded-sm" />
                            <Skeleton className="h-4 w-[80px] bg-slate-200 rounded-sm" />
                          </div>
                        ))}
                      </div>
                    ) : i === 2 ? (
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 bg-slate-200 rounded-sm" />
                        <Skeleton className="h-4 w-[100px] bg-slate-200 rounded-sm" />
                      </div>
                    ) : (
                      <Skeleton className={`h-${i === 1 || i === 4 ? '24' : '10'} w-full bg-slate-200 rounded-sm`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
    
            {/* Email Card */}
            <div className="bg-white rounded-md border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-[180px] bg-slate-200 rounded-sm" />
                <Skeleton className="h-[1px] w-full max-w-[200px] bg-slate-200" />
              </div>
              <Skeleton className="h-12 w-full bg-slate-200 rounded-sm" />
            </div>
          </div>
    
          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-3">
            <Skeleton className="h-11 w-[100px] bg-slate-200 rounded-sm" />
            <Skeleton className="h-11 w-[100px] bg-slate-200 rounded-sm" />
          </div>
        </div>
      );
}

export default UpsertIncidentFormSkeleton