import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, isSameWeek, getWeek } from "date-fns"
import { ChevronDown } from "lucide-react"

interface WeekSelectorDropdownProps {
  currentDate: Date
  selectedDate?: Date
  onWeekChange: (startDate: Date, endDate: Date) => void
  weekCount?: number
  showCurrentWeekIndicator?: boolean
}

export function WeekSelector({
  currentDate,
  selectedDate,
  onWeekChange,
  weekCount = 8,
  showCurrentWeekIndicator = true,
}: WeekSelectorDropdownProps) {
  const displayedDate = selectedDate || currentDate
  // const weekStart = startOfWeek(displayedDate)
  // const weekEnd = endOfWeek(displayedDate)
  // const currentWeekStart = startOfWeek(new Date())

  const formatWeekLabel = (date: Date) => {
    const weekNum = getWeek(date)
    const year = format(date, "yyyy")
    const start = format(startOfWeek(date), "MMM dd")
    const end = format(endOfWeek(date), "MMM dd")
    return `Week ${weekNum}, ${year} (${start} - ${end})`
  }

  const generateWeekOptions = () => {
    const weeks = []
    const today = new Date()
    const pivotDate = startOfWeek(today)

    // Add previous weeks
    for (let i = Math.floor(weekCount / 2); i > 0; i--) {
      weeks.push(subWeeks(pivotDate, i))
    }

    // Add current and future weeks
    for (let i = 0; i < Math.ceil(weekCount / 2); i++) {
      weeks.push(addWeeks(pivotDate, i))
    }

    return weeks.sort((a, b) => a.getTime() - b.getTime())
  }

  const handleWeekSelect = (date: Date) => {
    onWeekChange(startOfWeek(date), endOfWeek(date))
  }

  const isCurrentWeek = (date: Date) => {
    return isSameWeek(date, new Date())
  }

  const isSelectedWeek = (date: Date) => {
    return selectedDate ? isSameWeek(date, selectedDate) : isSameWeek(date, currentDate)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[280px] justify-between text-left font-normal"
        >
          <span className="truncate">
            {formatWeekLabel(displayedDate)}
            {isCurrentWeek(displayedDate) && showCurrentWeekIndicator && (
              <span className="ml-2 text-muted-foreground">(Current Week)</span>
            )}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white" align="start">
        <div className="max-h-[300px] overflow-y-auto">
          {generateWeekOptions().map((weekDate) => {
            const current = isCurrentWeek(weekDate)
            const selected = isSelectedWeek(weekDate)

            return (
              <div
                key={weekDate.toString()}
                className={`p-2 text-sm cursor-pointer hover:bg-slate-200 hover:text-muted-foreground ${
                  selected ? "bg-accent font-medium" : ""
                }`}
                onClick={() => handleWeekSelect(weekDate)}
              >
                {formatWeekLabel(weekDate)}
                {current && showCurrentWeekIndicator && (
                  <span className="ml-2 text-muted-foreground">(Current Week)</span>
                )}
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}