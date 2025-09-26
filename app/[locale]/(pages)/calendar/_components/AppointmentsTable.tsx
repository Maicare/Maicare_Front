"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Row } from "@tanstack/react-table"

import { Card, CardContent } from "@/components/ui/card"
import Loader from "@/components/common/loader"
import LargeErrorMessage from "@/components/common/Alerts/LargeErrorMessage"
import PrimaryButton from "@/common/components/PrimaryButton"
import { DataTable } from "@/components/employee/table/data-table"

import { useCalendar } from "@/hooks/calendar/use-calendar"
import { CalendarAppointment } from "@/types/calendar.types"

import { ArrowBigLeft, ArrowBigRight } from "lucide-react"
import getColumns from "./columns"
import { Any } from "@/common/types/types"

const PAGE_SIZE = 10

type Props = {
  employeeId: number
  start?: Date
  end?: Date
  onRowClick?: (row: Row<CalendarAppointment>) => void
}

export default function AppointmentsTable({
  employeeId,
  start,
  end,
  onRowClick,
}: Props) {

  const today = new Date()
  const rangeStart = start ?? today
  const rangeEnd = end ?? new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)

  const { fetchAppointmentsWindowByEmployee, confirmAppointment } = useCalendar(String(employeeId))

  const [appointments, setAppointments] = useState<CalendarAppointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    let mounted = true
      ; (async () => {
        setLoading(true)
        setError(null)
        try {
          const data = await fetchAppointmentsWindowByEmployee(rangeStart, rangeEnd)
          if (mounted) setAppointments(data)
        } catch (e: Any) {
          if (mounted) setError(e)
        } finally {
          if (mounted) setLoading(false)
        }
      })()
    return () => { mounted = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, rangeStart, rangeEnd])

  const handleConfirm = useCallback(async (appt: CalendarAppointment) => {
    try {
      console.log(appt)
      await confirmAppointment(String((appt as Any).id), {
        displayProgress: true,
        displaySuccess: true,
      })
      setAppointments(prev =>
        prev.map(a =>
          (a as Any).id === (appt as Any).id
            ? { ...a, is_confirmed: true } as Any
            : a,
        ),
      )
    } catch (e) {
      console.error(e)
    }
  }, [confirmAppointment])

  const columns = useMemo(() => getColumns(handleConfirm), [handleConfirm])

  const totalPages = Math.max(1, Math.ceil(appointments.length / PAGE_SIZE))
  const pagedData = useMemo(
    () => appointments.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [appointments, page],
  )

  const previous = () => setPage(p => Math.max(1, p - 1))
  const next = () => setPage(p => Math.min(totalPages, p + 1))

  return (
    <Card className="bg-transparent border-none shadow-none rounded-md p-0">
      <CardContent className="grid gap-4 p-0">
        {loading ? (
          <div className="flex justify-center py-8"><Loader /></div>
        ) : error ? (
          <LargeErrorMessage
            firstLine="Error loading appointments"
            secondLine={error.message}
          />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={pagedData}
              onRowClick={onRowClick}
              className="dark:bg-[#18181b] dark:border-black"
            />

            <div className="flex justify-between px-2 py-3 bg-white dark:bg-[#18181b] dark:border-black rounded-md border-2 border-muted">
              <PrimaryButton
                disabled={page === 1}
                onClick={previous}
                text="Previous"
                icon={ArrowBigLeft}
                iconSide="left"
              />
              <PrimaryButton
                disabled={page === totalPages}
                onClick={next}
                text="Next"
                icon={ArrowBigRight}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
