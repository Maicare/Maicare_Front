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
  selectedDate,
  onWeekChange,
  showCurrentWeekIndicator = true,
}: WeekSelectorProps) {
  // const _displayedDate = selectedDate || currentDate

  // Initialiseer met huidig jaar en week
  const currentYear = getISOWeekYear(new Date())
  const currentWeekDate = startOfISOWeek(new Date())

  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [selectedWeek, setSelectedWeek] = useState<Date>(currentWeekDate)
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false)
  const [weekDropdownOpen, setWeekDropdownOpen] = useState(false)

  // Stel standaardwaarden in bij mount
  useEffect(() => {
    // Trigger initiële callback met huidige week
    onWeekChange(startOfISOWeek(currentWeekDate), endOfISOWeek(currentWeekDate))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Lege dependency array om alleen bij mount te runnen

  const formatWeekLabel = (date: Date) => {
    const weekNum = getISOWeek(date)
    // const year = getISOWeekYear(date)
    const start = format(startOfISOWeek(date), "MMM dd")
    const end = format(endOfISOWeek(date), "MMM dd")
    return `Week ${weekNum} (${start} - ${end})`
  }

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    // Toon 5 jaar voor en na huidig jaar
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i)
    }
    return years
  }

  const generateWeeksForYear = (year: number) => {
    const weeks = []
    const yearStart = startOfISOWeekYear(new Date(year, 0, 1))
    let currentWeek = yearStart

    // Genereer alle ISO weken voor het jaar
    while (getISOWeekYear(currentWeek) <= year) {
      if (getISOWeekYear(currentWeek) === year) {
        weeks.push(new Date(currentWeek))
      }
      currentWeek = addWeeks(currentWeek, 1)

      // Stop als we naar het volgende ISO week jaar zijn verplaatst
      if (getISOWeekYear(currentWeek) > year) {
        break
      }
    }

    return weeks
  }

  const handleYearSelect = (year: number) => {
    setSelectedYear(year)
    // Reset naar eerste week van geselecteerd jaar
    const firstWeekOfYear = startOfISOWeekYear(new Date(year, 0, 1))
    setSelectedWeek(firstWeekOfYear)
    setYearDropdownOpen(false) // Sluit jaar dropdown
    // Trigger callback met eerste week van geselecteerd jaar
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
      {/* Jaar Selectie Dropdown */}
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
              Selecteer Jaar
            </div>
            {generateYearOptions().map((year) => {
              const isCurrentYear = year === new Date().getFullYear()
              const isSelected = year === selectedYear
              return (
                <div
                  key={year}
                  className={`p-3 text-sm cursor-pointer hover:bg-slate-100 ${isSelected ? "bg-accent font-medium" : ""
                    }`}
                  onClick={() => handleYearSelect(year)}
                >
                  {year}
                  {isCurrentYear && (
                    <span className="ml-2 text-muted-foreground">(Huidig Jaar)</span>
                  )}
                </div>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>

      {/* Week Selectie Dropdown */}
      <Popover open={weekDropdownOpen} onOpenChange={setWeekDropdownOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[240px] justify-between text-left font-normal"
          >
            <span className="truncate">
              {formatWeekLabel(selectedWeek)}
              {isCurrentWeek(selectedWeek) && showCurrentWeekIndicator && (
                <span className="ml-2 text-muted-foreground">(Huidig)</span>
              )}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white" align="start">
          <div className="max-h-[300px] overflow-y-auto">
            <div className="p-3 border-b bg-slate-50 font-medium text-sm">
              Weken voor {selectedYear}
            </div>
            {generateWeeksForYear(selectedYear).map((weekDate) => {
              const current = isCurrentWeek(weekDate)
              const selected = isSelectedWeek(weekDate) || isSameISOWeek(weekDate, selectedWeek)

              return (
                <div
                  key={weekDate.toString()}
                  className={`p-2 text-sm cursor-pointer hover:bg-slate-100 ${selected ? "bg-accent font-medium" : ""
                    }`}
                  onClick={() => {
                    handleWeekSelect(weekDate)
                    setWeekDropdownOpen(false) // 👈 Sluit popover na selectie
                  }}
                >
                  {formatWeekLabel(weekDate)}
                  {current && showCurrentWeekIndicator && (
                    <span className="ml-2 text-muted-foreground">(Huidige Week)</span>
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