import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { dateFormat } from "@/utils/timeFormatting"
import { LEVEL_OPTIONS } from "@/types/maturity-matrix.types"
import { cn, getTailwindClasses } from "@/utils/cn"
import { AssessmentResponse } from "@/types/assessment.types"
import PencilSquare from "@/components/icons/PencilSquare"
import { TrashIcon } from "lucide-react"
import Loader from "@/components/common/loader"

export function AssessmentDetails({ 
  clientId, 
  assessmentId, 
  assessment 
}:{
    clientId: string,
    assessmentId: string,
    assessment?: AssessmentResponse
}) {
    if (!assessment) {
        return (
            <Loader />
        )
    }
  return (
    <Card className="bg-cyan-600/20 backdrop-blur-sm shadow-sm rounded-md">
      <CardHeader className="flex flex-row items-center justify-between p-6">
        <CardTitle>Assessment Details</CardTitle>
        <div className="flex gap-2">
          <Link href={`/clients/${clientId}/goals/${assessmentId}/edit`}>
            <Button variant="outline" size="icon">
              <PencilSquare className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="destructive" size="icon">
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Domain</p>
          <div className="rounded-md border border-indigo-700 p-3 text-sm">
            {assessment.topic_name || "Not Available"}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Initial Level</p>
          <div className="rounded-md border border-indigo-700 p-3 text-sm">
            <Badge variant="outline" className={cn(getTailwindClasses(assessment.initial_level))}>
              {LEVEL_OPTIONS.find(it => it.value === assessment.initial_level.toString())?.label || "Not Available"}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Current Level</p>
          <div className="rounded-md border border-indigo-700 p-3 text-sm">
            <Badge variant="outline" className={cn(getTailwindClasses(assessment.current_level))}>
              {LEVEL_OPTIONS.find(it => it.value === assessment.current_level.toString())?.label || "Not Available"}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Status</p>
          <div className="rounded-md border border-indigo-700 p-3 text-sm">
            <Badge variant={assessment.is_active ? "default" : "secondary"}>
              {assessment.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Start Date</p>
          <div className="rounded-md border border-indigo-700 p-3 text-sm">
            {dateFormat(assessment.start_date) || "Not Available"}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">End Date</p>
          <div className="rounded-md border border-indigo-700 p-3 text-sm">
            {dateFormat(assessment.end_date) || "Not Available"}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}