import { Skeleton } from "@/components/ui/skeleton";

export function RegistrationSkeleton() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-[300px]" />
        <Skeleton className="h-4 w-[400px]" />
      </div>

      {/* Two-column layout for the first sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Information Card */}
        <div className="space-y-4 rounded-lg border p-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Address Information Card */}
        <div className="space-y-4 rounded-lg border p-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Two-column layout for Care and Education sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Care Needs Card */}
        <div className="space-y-4 rounded-lg border p-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-4 border rounded-md">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-5 w-[200px]" />
              </div>
            ))}
          </div>
        </div>

        {/* Education Card */}
        <div className="space-y-4 rounded-lg border p-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 border rounded-md">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-[200px]" />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-9 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Assessment Card - Full width */}
      <div className="space-y-4 rounded-lg border p-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-4 border rounded-md">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-[200px]" />
            </div>
          ))}
        </div>
        <div className="space-y-4 mt-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>

      {/* Two-column layout for Documents and Referrer sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Documents Card */}
        <div className="space-y-4 rounded-lg border p-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-gray-200 px-3 py-6 text-sm w-full">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                  <Skeleton className="h-9 w-[80px]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Referrer Information Card */}
        <div className="space-y-4 rounded-lg border p-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-md">
              <Skeleton className="h-5 w-5 rounded" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-3 w-[200px]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guardian Information Card - Full width */}
      <div className="space-y-4 rounded-lg border p-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-5 w-[100px]" />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-5 w-[150px]" />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-[180px]" />
      </div>
    </div>
  );
}