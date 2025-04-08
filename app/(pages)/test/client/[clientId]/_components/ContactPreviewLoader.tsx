import { Skeleton } from "@/components/ui/skeleton";

export function ContactPreviewLoader() {
  return (
    <div className="w-full h-[287px] rounded-sm shadow-md p-4 bg-white overflow-y-scroll">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full bg-slate-200" />
          <Skeleton className="h-6 w-[150px] bg-slate-200" />
        </div>
        <Skeleton className="h-8 w-[100px] bg-slate-200 rounded-md" />
      </div>

      {/* Content Skeleton */}
      <div className="mt-4 w-full p-2 flex flex-col gap-4">
        {[1, 2, 3].map((index) => (
          <div key={index} className="flex items-center gap-2 p-2">
            {/* Profile Image Skeleton */}
            <Skeleton className="h-10 w-10 rounded-md bg-slate-200" />

            {/* Text Content Skeleton */}
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-full bg-slate-200" />
                <Skeleton className="h-4 w-full bg-slate-200" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full bg-slate-200" />
                <Skeleton className="h-4 w-full bg-slate-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}