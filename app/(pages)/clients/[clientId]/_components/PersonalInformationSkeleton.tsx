import { Skeleton } from "@/components/ui/skeleton";

export default function PersonalInformationSkeleton() {
  return (
    <div className="w-full h-[287px] rounded-sm shadow-md p-4 bg-white">
      {/* Header Section Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 bg-slate-200 rounded-full" /> {/* Info Icon */}
        <Skeleton className="h-6 w-48 bg-slate-200" /> {/* Title */}
      </div>

      {/* Description Skeleton */}
      <Skeleton className="mt-4 h-12 w-full bg-slate-200" /> {/* Description Text */}

      {/* Details Section Skeleton */}
      <div className="mt-4 w-full">
        {/* Full Name */}
        <div className="flex items-center w-full py-2 border-b border-slate-200">
          <Skeleton className="w-[40%] h-4 bg-slate-200" /> {/* Label */}
          <Skeleton className="w-[50%] h-4 bg-slate-200 ml-2" /> {/* Value */}
        </div>

        {/* Email */}
        <div className="flex items-center w-full py-2 border-b border-slate-200">
          <Skeleton className="w-[40%] h-4 bg-slate-200" /> {/* Label */}
          <Skeleton className="w-[50%] h-4 bg-slate-200 ml-2" /> {/* Value */}
        </div>

        {/* Mobile */}
        <div className="flex items-center w-full py-2 border-b border-slate-200">
          <Skeleton className="w-[40%] h-4 bg-slate-200" /> {/* Label */}
          <Skeleton className="w-[50%] h-4 bg-slate-200 ml-2" /> {/* Value */}
        </div>

        {/* Location */}
        <div className="flex items-center w-full py-2 border-b border-slate-200">
          <Skeleton className="w-[40%] h-4 bg-slate-200" /> {/* Label */}
          <Skeleton className="w-[50%] h-4 bg-slate-200 ml-2" /> {/* Value */}
        </div>
      </div>
    </div>
  );
}