import { Badge } from "@/components/ui/badge"
import { WorkingHoursEntry } from "@/types/working-hours.types"
import { CalendarDays, Clock, FileText, LocateFixed } from "lucide-react"
import { cn } from "@/utils/cn"
import { formatDutchDateTimeWithAMPM } from "@/utils/timeFormatting"

interface WorkingHoursCardProps {
    entry: WorkingHoursEntry
}

export function WorkingHoursCard({ entry }: WorkingHoursCardProps) {
    // Status colors
    const statusColors = {
        PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        CONFIRMED: "bg-green-100 text-green-800 hover:bg-green-200",
        CANCELED: "bg-red-100 text-red-800 hover:bg-red-200",
    }

    // Type colors
    const typeColors = {
        appointment: "bg-purple-100 text-purple-800 hover:bg-purple-200",
        schedule: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    }
    const { date, time } = formatDutchDateTimeWithAMPM(entry.start_time);
    const { time: endTime } = formatDutchDateTimeWithAMPM(entry.end_time);

    return (
        <div className={cn("w-full grid grid-cols-1 bg-white gap-2 pl-6 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 relative before:absolute before:top-4 before:left-0 before:w-1.5 before:h-14 before:bg-indigo-400 before:rounded-full", entry.type === "appointment" ? "before:bg-purple-400" : "before:bg-blue-400")}>
            <div className="flex items-center gap-2">
                <Badge className={`${typeColors[entry.type]} text-xs font-medium px-2 py-1`}>
                    {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                </Badge>
                {entry.status && (<Badge className={`${statusColors[entry.status || "PENDING"]} text-xs font-medium px-2 py-1`}>
                    {entry.status || "PENDING"}
                </Badge>)}
            </div>
            <div className="flex items-center gap-2">
                <CalendarDays className="text-gray-500" size={16} />
                <p className="text-gray-500">{date}</p>
            </div>
            <div className="flex items-center  gap-2">
                <Clock className="text-gray-500" size={16} />
                <p className="text-gray-500">{time} - {endTime} | <span className="text-black">{entry.duration_hours} h</span></p>
            </div>
            <div className="flex items-center gap-2">
                <LocateFixed className="text-gray-500" size={16} />
                <p className="text-gray-500">{entry.location}</p>
            </div>
            <div className={cn("flex items-center gap-2",!entry.description && "invisible")}>
                <FileText className="text-gray-500" size={16} />
                {
                    entry.description && (
                        <p className="text-gray-500">{entry.description}</p>
                    )
                }
            </div>

        </div>
    )
}