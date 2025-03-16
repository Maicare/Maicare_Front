import { Skeleton } from "@/components/ui/skeleton";

export default function WorkInformationSkeleton() {
  return (
    <div className="w-[32%] h-[287px] rounded-sm shadow-md p-4 bg-white">
      {/* Header Section Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 bg-slate-200 rounded-full" /> {/* Briefcase Icon */}
        <Skeleton className="h-6 w-48 bg-slate-200" /> {/* Title */}
      </div>

      {/* Details Section Skeleton */}
      <div className="mt-4 w-full">
        {/* Positie */}
        <div className="flex items-center w-full py-2 border-b border-slate-200">
          <Skeleton className="w-[40%] h-4 bg-slate-200" /> {/* Label */}
          <Skeleton className="w-[50%] h-4 bg-slate-200 ml-2" /> {/* Value */}
        </div>

        {/* Werk E-mail */}
        <div className="flex items-center w-full py-2 border-b border-slate-200">
          <Skeleton className="w-[40%] h-4 bg-slate-200" /> {/* Label */}
          <Skeleton className="w-[50%] h-4 bg-slate-200 ml-2" /> {/* Value */}
        </div>

        {/* Werk Telefoonnummer */}
        <div className="flex items-center w-full py-2 border-b border-slate-200">
          <Skeleton className="w-[40%] h-4 bg-slate-200" /> {/* Label */}
          <Skeleton className="w-[50%] h-4 bg-slate-200 ml-2" /> {/* Value */}
        </div>

        {/* Afdeling */}
        <div className="flex items-center w-full py-2 border-b border-slate-200">
          <Skeleton className="w-[40%] h-4 bg-slate-200" /> {/* Label */}
          <Skeleton className="w-[50%] h-4 bg-slate-200 ml-2" /> {/* Value */}
        </div>

        {/* Medewerkernummer */}
        <div className="flex items-center w-full py-2 border-b border-slate-200">
          <Skeleton className="w-[40%] h-4 bg-slate-200" /> {/* Label */}
          <Skeleton className="w-[50%] h-4 bg-slate-200 ml-2" /> {/* Value */}
        </div>

        {/* Dienstnummer */}
        <div className="flex items-center w-full py-2 border-b border-slate-200">
          <Skeleton className="w-[40%] h-4 bg-slate-200" /> {/* Label */}
          <Skeleton className="w-[50%] h-4 bg-slate-200 ml-2" /> {/* Value */}
        </div>
      </div>
    </div>
  );
}