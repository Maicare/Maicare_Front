import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { FileTextIcon, UserIcon, Building2Icon, CalendarIcon, ClockIcon, DollarSignIcon } from "lucide-react"

export function ContractCardSkeleton() {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-sm bg-gray-800/10">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FileTextIcon className="h-5 w-5 text-muted-foreground" />
              <Skeleton className="h-5 w-40 bg-white" />
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Skeleton className="h-6 w-20 rounded-full bg-white" />
              <Skeleton className="h-6 w-16 rounded-full bg-white" />
              <Skeleton className="h-6 w-16 rounded-full bg-white" />
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground">Contract</span>
            <Skeleton className="h-5 w-12 bg-white" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Client Section */}
        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex-shrink-0">
            <Skeleton className="h-10 w-10 rounded-full bg-white" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <Skeleton className="h-4 w-16 bg-white" />
            </div>
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-12 rounded-full bg-white" />
            </div>
          </div>
        </div>

        {/* Sender Section */}
        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
          <div className="flex-shrink-0">
            <Skeleton className="h-10 w-10 rounded-full bg-white" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Building2Icon className="h-4 w-4 text-muted-foreground" />
              <Skeleton className="h-4 w-20 bg-white" />
            </div>
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-24 rounded-full bg-white" />
            </div>
          </div>
        </div>

        {/* Contract Details */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-2 text-sm">
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-12 bg-white" />
              <Skeleton className="h-4 w-20 bg-white" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-12 bg-white" />
              <Skeleton className="h-4 w-16 bg-white" />
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="border-t pt-3 mt-2 space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-16 bg-white" />
              <Skeleton className="h-4 w-32 bg-white" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-16 bg-white" />
              <Skeleton className="h-4 w-32 bg-white" />
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-0">
        <Skeleton className="h-4 w-24 bg-white" />
        <Skeleton className="h-4 w-12 bg-white" />
      </CardFooter>
    </Card>
  )
}