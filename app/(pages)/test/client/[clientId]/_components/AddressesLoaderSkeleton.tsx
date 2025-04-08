import { Skeleton } from "@/components/ui/skeleton";

export function AddressesLoaderSkeleton() {
  return (
    <div className="w-full h-[287px] rounded-sm shadow-md p-4 bg-white overflow-y-scroll">
      {/* Header Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded-full bg-slate-200" />
        <Skeleton className="h-6 w-[200px] bg-slate-200" />
      </div>

      {/* Accordion Skeleton */}
      <div className="mt-4 w-full space-y-2">
        {[1, 2, 3].map((index) => (
          <div key={index} className="w-full">
            {/* Accordion Trigger Skeleton */}
            <div className="flex items-center justify-between p-2">
              <Skeleton className="h-4 w-[100px] bg-slate-200" />
              <Skeleton className="h-4 w-4 bg-slate-200" />
            </div>

            {/* Accordion Content Skeleton */}
            <div className="space-y-2 p-2">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-[40%] bg-slate-200" />
                  <Skeleton className="h-4 w-[50%] bg-slate-200" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}