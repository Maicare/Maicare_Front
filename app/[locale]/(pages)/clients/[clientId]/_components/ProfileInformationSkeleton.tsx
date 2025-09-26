import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileInformationSkeleton() {
  return (
    <div className="w-full h-[287px] rounded-sm shadow-md bg-white">
      {/* Top Section Skeleton */}
      <div className="h-34 bg-indigo-400 text-indigo-600 flex justify-between rounded-sm">
        <div className="p-4">
          <Skeleton className="h-6 w-32 bg-slate-200" /> {/* Title */}
          <Skeleton className="h-4 w-48 bg-slate-200 mt-2" /> {/* Subtitle */}
        </div>
      </div>

      {/* Bottom Section Skeleton */}
      <div className="p-4 h-31 flex justify-between w-full bg-white">
        {/* Left Side (Profile Picture and Name) */}
        <div className="flex flex-col items-start relative w-[30%]">
          <Skeleton className="rounded-full border-2 border-white absolute -top-8 left-0 h-[50px] w-[50px] bg-slate-200" /> {/* Profile Picture */}
          <div className="mt-10">
            <Skeleton className="h-4 w-24 bg-slate-200" /> {/* Name */}
            <Skeleton className="h-3 w-16 bg-slate-200 mt-2" /> {/* Role */}
          </div>
        </div>

        {/* Right Side (Details and Button) */}
        <div className="w-[60%] flex flex-col justify-between">
          {/* Details Row */}
          <div className="flex">
            <div className="w-[50%]">
              <Skeleton className="h-3 w-16 bg-slate-200" /> {/* Label */}
              <Skeleton className="h-4 w-20 bg-slate-200 mt-1" /> {/* Value */}
            </div>
            <div className="w-[50%]">
              <Skeleton className="h-3 w-16 bg-slate-200" /> {/* Label */}
              <Skeleton className="h-4 w-20 bg-slate-200 mt-1" /> {/* Value */}
            </div>
          </div>

          {/* Button */}
          <Skeleton className="h-10 w-[50%] bg-slate-200 rounded-md" /> {/* View Details Button */}
        </div>
      </div>
    </div>
  );
}