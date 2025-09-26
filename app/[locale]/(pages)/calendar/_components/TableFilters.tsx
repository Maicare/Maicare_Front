"use client"

import { useEffect, useState } from "react"
import { addDays, format } from "date-fns"
import { useForm } from "react-hook-form"
import { DateRange } from "react-day-picker"
import {  CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form } from "@/components/ui/form"


import { Id } from "@/common/types/types"
import EmployeeSelect from "../../clients/[clientId]/incidents/_components/EmployeeSelect"

type FormShape = { employee_id: Id | undefined }

type Props = {
  onChange: (employeeId: Id | null, start: Date, end: Date) => void
}

export default function TableFilters({ onChange }: Props) {
  const form = useForm<FormShape>({
    defaultValues: { employee_id: undefined },
  })

  const employeeId = form.watch("employee_id")

  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })

  useEffect(() => {
    if (!range?.from || !range?.to) return
    onChange(employeeId ?? null, range.from, range.to)
  }, [employeeId, range, onChange])

  /* ── render ────────────────────────────────────────────────────────── */
  return (
      <Form {...form}>
        <CardContent className="flex flex-col md:flex-row gap-4 items-center justify-end px-0">
          <div className="w-full md:w-64">
            <EmployeeSelect name="employee_id" modal className='w-full' variant="inputOnly" />
          </div>

          <div className="w-full md:w-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full md:w-64 justify-start text-left font-normal h-10"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {range?.from ? (
                    range.to ? (
                      <>
                        {format(range.from, "MMM dd")} –{" "}
                        {format(range.to, "MMM dd")}
                      </>
                    ) : (
                      format(range.from, "MMM dd")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0 bg-white rounded-md shadow-lg" align="start">
                <Calendar
                  mode="range"
                  numberOfMonths={2}
                  selected={range}
                  onSelect={setRange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Form>
  )
}
