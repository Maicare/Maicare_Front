"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

import TableFilters from "./TableFilters"
import AppointmentsTable from "./AppointmentsTable"

import { Id } from "@/common/types/types"

export default function AppointmentsDetails() {
  const [employeeId, setEmployeeId] = useState<Id | null>(null)
  const [start, setStart] = useState<Date>(new Date())
  const [end, setEnd] = useState<Date>(new Date())

  const handleFilterChange = (emp: Id | null, s: Date, e: Date) => {
    setEmployeeId(emp)
    setStart(s)
    setEnd(e)
  }

  return (
    <div className="flex flex-col gap-4">
      <TableFilters onChange={handleFilterChange} />

      {employeeId ? (
        <AppointmentsTable
          key={String(employeeId) + start.toISOString() + end.toISOString()}
          employeeId={employeeId as number}
          start={start}
          end={end}
        />
      ) : (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">
            Select an employee to view their appointments.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
