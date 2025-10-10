import { Skeleton } from "@/components/ui/skeleton";

export default function EmployeeFormSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Left Column */}
      <div className="grid grid-cols-1 gap-4 h-fit">
        {/* Identification Section Skeleton */}
        <div className="flex flex-col gap-4 px-6 py-3 bg-white rounded-md border-2 border-muted h-fit">
          <Skeleton className="h-6 w-1/4 bg-slate-200" /> {/* Title */}
          <Skeleton className="h-[1px] w-full bg-slate-300" /> {/* Separator */}
          <div className="space-y-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4 bg-slate-200" /> {/* Label */}
              <Skeleton className="h-10 w-full bg-slate-200" /> {/* Input */}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4 bg-slate-200" /> {/* Label */}
              <Skeleton className="h-10 w-full bg-slate-200" /> {/* Input */}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4 bg-slate-200" /> {/* Label */}
                <Skeleton className="h-10 w-full bg-slate-200" /> {/* Select */}
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4 bg-slate-200" /> {/* Label */}
                <Skeleton className="h-10 w-full bg-slate-200" /> {/* Select */}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Skeleton className="h-5 w-5 bg-slate-200" /> {/* Checkbox */}
              <div className="space-y-1">
                <Skeleton className="h-4 w-32 bg-slate-200" /> {/* Label */}
                <Skeleton className="h-3 w-48 bg-slate-200" /> {/* Description */}
              </div>
            </div>
          </div>
        </div>

        {/* Name Section Skeleton */}
        <div className="flex flex-col gap-4 px-6 py-3 bg-white rounded-md border-2 border-muted">
          <Skeleton className="h-6 w-1/4 bg-slate-200" /> {/* Title */}
          <Skeleton className="h-[1px] w-full bg-slate-300" /> {/* Separator */}
          <div className="space-y-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4 bg-slate-200" /> {/* Label */}
              <Skeleton className="h-10 w-full bg-slate-200" /> {/* Input */}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4 bg-slate-200" /> {/* Label */}
              <Skeleton className="h-10 w-full bg-slate-200" /> {/* Input */}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="grid grid-cols-1 gap-4">
        {/* Contact Section Skeleton */}
        <div className="flex flex-col gap-4 px-6 py-3 bg-white rounded-md border-2 border-muted">
          <Skeleton className="h-6 w-1/4 bg-slate-200" /> {/* Title */}
          <Skeleton className="h-[1px] w-full bg-slate-300" /> {/* Separator */}
          <div className="space-y-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4 bg-slate-200" /> {/* Label */}
              <Skeleton className="h-10 w-full bg-slate-200" /> {/* Input */}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4 bg-slate-200" /> {/* Label */}
              <Skeleton className="h-10 w-full bg-slate-200" /> {/* Input */}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4 bg-slate-200" /> {/* Label */}
              <Skeleton className="h-10 w-full bg-slate-200" /> {/* Input */}
            </div>
          </div>
        </div>

        {/* Birth Details Section Skeleton */}
        <div className="flex flex-col gap-4 px-6 py-3 bg-white rounded-md border-2 border-muted">
          <Skeleton className="h-6 w-1/4 bg-slate-200" /> {/* Title */}
          <Skeleton className="h-[1px] w-full bg-slate-300" /> {/* Separator */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4 bg-slate-200" /> {/* Label */}
              <Skeleton className="h-10 w-full bg-slate-200" /> {/* Date Picker */}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4 bg-slate-200" /> {/* Label */}
              <Skeleton className="h-10 w-full bg-slate-200" /> {/* Select */}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons Skeleton */}
      <div className="col-span-2 flex justify-end gap-4">
        <Skeleton className="h-10 w-[50%] bg-slate-200" /> {/* Save Button */}
        <Skeleton className="h-10 w-[50%] bg-slate-200" /> {/* Cancel Button */}
      </div>
    </div>
  );
}