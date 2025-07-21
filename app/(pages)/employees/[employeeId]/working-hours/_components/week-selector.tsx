import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format, startOfISOWeek, endOfISOWeek, isSameISOWeek, getISOWeek, startOfISOWeekYear, addWeeks, getISOWeekYear } from "date-fns"
import { ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"

interface WeekSelectorProps {
  currentDate: Date
  selectedDate?: Date
  onWeekChange: (startDate: Date, endDate: Date) => void
  showCurrentWeekIndicator?: boolean
}

export function WeekSelector({
  currentDate,
  selectedDate,
  onWeekChange,
  showCurrentWeekIndicator = true,
}: WeekSelectorProps) {
  const displayedDate = selectedDate || currentDate
  
  // Initialize with current year and week
  const currentYear = getISOWeekYear(new Date())
  const currentWeekDate = startOfISOWeek(new Date())
  
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [selectedWeek, setSelectedWeek] = useState<Date>(currentWeekDate)
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false)
  const [weekDropdownOpen, setWeekDropdownOpen] = useState(false)

  // Set defaults on mount
  useEffect(() => {
    // Trigger initial callback with current week
    onWeekChange(startOfISOWeek(currentWeekDate), endOfISOWeek(currentWeekDate))
  }, []) // Empty dependency array to run only on mount

  const formatWeekLabel = (date: Date) => {
    const weekNum = getISOWeek(date)
    const year = getISOWeekYear(date)
    const start = format(startOfISOWeek(date), "MMM dd")
    const end = format(endOfISOWeek(date), "MMM dd")
    return `Week ${weekNum} (${start} - ${end})`
  }

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    // Show 5 years before and after current year
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i)
    }
    return years
  }

  const generateWeeksForYear = (year: number) => {
    const weeks = []
    const yearStart = startOfISOWeekYear(new Date(year, 0, 1))
    let currentWeek = yearStart
    
    // Generate all ISO weeks for the year
    while (getISOWeekYear(currentWeek) <= year) {
      if (getISOWeekYear(currentWeek) === year) {
        weeks.push(new Date(currentWeek))
      }
      currentWeek = addWeeks(currentWeek, 1)
      
      // Stop if we've moved to the next ISO week year
      if (getISOWeekYear(currentWeek) > year) {
        break
      }
    }
    
    return weeks
  }

  const handleYearSelect = (year: number) => {
    setSelectedYear(year)
    // Reset to first week of selected year
    const firstWeekOfYear = startOfISOWeekYear(new Date(year, 0, 1))
    setSelectedWeek(firstWeekOfYear)
    setYearDropdownOpen(false) // Close year dropdown
    // Trigger callback with first week of selected year
    onWeekChange(startOfISOWeek(firstWeekOfYear), endOfISOWeek(firstWeekOfYear))
  }

  const handleWeekSelect = (date: Date) => {
    setSelectedWeek(date)
    onWeekChange(startOfISOWeek(date), endOfISOWeek(date))
  }

  const isCurrentWeek = (date: Date) => {
    return isSameISOWeek(date, new Date())
  }

  const isSelectedWeek = (date: Date) => {
    return selectedDate ? isSameISOWeek(date, selectedDate) : false
  }

  return (
    <div className="flex gap-2">
      {/* Year Selection Dropdown */}
      <Popover open={yearDropdownOpen} onOpenChange={setYearDropdownOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[140px] justify-between text-left font-normal"
          >
            <span className="truncate">
              {selectedYear}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white" align="start">
          <div className="max-h-[300px] overflow-y-auto">
            <div className="p-3 border-b bg-slate-50 font-medium text-sm">
              Select Year
            </div>
            {generateYearOptions().map((year) => {
              const isCurrentYear = year === new Date().getFullYear()
              const isSelected = year === selectedYear
              return (
                <div
                  key={year}
                  className={`p-3 text-sm cursor-pointer hover:bg-slate-100 ${
                    isSelected ? "bg-accent font-medium" : ""
                  }`}
                  onClick={() => handleYearSelect(year)}
                >
                  {year}
                  {isCurrentYear && (
                    <span className="ml-2 text-muted-foreground">(Current Year)</span>
                  )}
                </div>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>

      {/* Week Selection Dropdown */}
      <Popover open={weekDropdownOpen} onOpenChange={setWeekDropdownOpen}>
  <PopoverTrigger asChild>
    <Button
      variant="outline"
      className="w-[240px] justify-between text-left font-normal"
    >
      <span className="truncate">
        {formatWeekLabel(selectedWeek)}
        {isCurrentWeek(selectedWeek) && showCurrentWeekIndicator && (
          <span className="ml-2 text-muted-foreground">(Current)</span>
        )}
      </span>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0 bg-white" align="start">
    <div className="max-h-[300px] overflow-y-auto">
      <div className="p-3 border-b bg-slate-50 font-medium text-sm">
        Weeks for {selectedYear}
      </div>
      {generateWeeksForYear(selectedYear).map((weekDate) => {
        const current = isCurrentWeek(weekDate)
        const selected = isSelectedWeek(weekDate) || isSameISOWeek(weekDate, selectedWeek)

        return (
          <div
            key={weekDate.toString()}
            className={`p-2 text-sm cursor-pointer hover:bg-slate-100 ${
              selected ? "bg-accent font-medium" : ""
            }`}
            onClick={() => {
              handleWeekSelect(weekDate)
              setWeekDropdownOpen(false) // 👈 Close popover after selection
            }}
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
    </div>
  )
}