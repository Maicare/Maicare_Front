import { Skeleton } from "@/components/ui/skeleton";

export default function UpsertClientFormSkeleton() {
  return (
    <div>
      {/* Header Section Skeleton */}
      <div className="flex justify-between items-center mb-5">
        <Skeleton className="h-8 w-48 bg-slate-200" /> {/* Title */}
        <Skeleton className="h-4 w-64 bg-slate-200" /> {/* Breadcrumb */}
      </div>

      {/* Form Section Skeleton */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="grid grid-cols-1 gap-2 h-fit">
          {/* Persoonlijke Gegevens Section */}
          <div className="flex flex-col gap-4 px-6 py-3 bg-white rounded-md border-2 border-muted h-fit">
            <Skeleton className="h-6 w-48 bg-slate-200" /> {/* Section Title */}
            <Skeleton className="h-[1px] w-full bg-slate-300" /> {/* Separator */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-4">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-slate-200" /> {/* Label */}
                  <Skeleton className="h-10 w-full bg-slate-200" /> {/* Input */}
                </div>
              ))}
            </div>
          </div>

          {/* Identiteitsgegevens Section */}
          <div className="flex flex-col gap-4 px-6 py-3 bg-white rounded-md border-2 border-muted h-fit">
            <Skeleton className="h-6 w-48 bg-slate-200" /> {/* Section Title */}
            <Skeleton className="h-[1px] w-full bg-slate-300" /> {/* Separator */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-4">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-slate-200" /> {/* Label */}
                  <Skeleton className="h-10 w-full bg-slate-200" /> {/* Input */}
                </div>
              ))}
            </div>
            <Skeleton className="h-24 w-full bg-slate-200" /> {/* File Uploader */}
          </div>
        </div>

        {/* Right Column */}
        <div className="grid grid-cols-1 gap-2 h-fit">
          {/* Locatiegegevens Section */}
          <div className="flex flex-col gap-4 px-6 py-3 bg-white rounded-md border-2 border-muted h-fit">
            <Skeleton className="h-6 w-48 bg-slate-200" /> {/* Section Title */}
            <Skeleton className="h-[1px] w-full bg-slate-300" /> {/* Separator */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-slate-200" /> {/* Label */}
                  <Skeleton className="h-10 w-full bg-slate-200" /> {/* Input */}
                </div>
              ))}
            </div>
          </div>

          {/* Opdrachtgever Section */}
          <div className="flex flex-col gap-4 px-6 py-3 bg-white rounded-md border-2 border-muted h-fit">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-48 bg-slate-200" /> {/* Section Title */}
              <Skeleton className="h-10 w-48 bg-slate-200" /> {/* Button */}
            </div>
            <Skeleton className="h-[1px] w-full bg-slate-300" /> {/* Separator */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-slate-200" /> {/* Label */}
              <Skeleton className="h-10 w-full bg-slate-200" /> {/* Input */}
            </div>
          </div>

          {/* Adresgegevens Section */}
          <div className="flex flex-col gap-4 px-6 py-3 bg-white rounded-md border-2 border-muted h-fit">
            <Skeleton className="h-6 w-48 bg-slate-200" /> {/* Section Title */}
            <Skeleton className="h-[1px] w-full bg-slate-300" /> {/* Separator */}
            <Skeleton className="h-24 w-full bg-slate-200" /> {/* Address Form */}
          </div>
        </div>
      </div>

      {/* Buttons Section Skeleton */}
      <div className="flex justify-end gap-4 mt-4">
        <Skeleton className="h-10 w-24 bg-slate-200" /> {/* Save Button */}
        <Skeleton className="h-10 w-24 bg-slate-200" /> {/* Cancel Button */}
      </div>
    </div>
  );
}