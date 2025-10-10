"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, CheckCircle2, X } from "lucide-react"
import { format } from "date-fns"

import { CalendarAppointment } from "@/types/calendar.types"

type ConfirmFn = (appointment: CalendarAppointment) => void

export const getColumns = (
  handleConfirm: ConfirmFn,
): ColumnDef<CalendarAppointment>[] => [
    {
      accessorKey: "description",
      header: "Description",
      cell: info => info.getValue() as string ?? "",
    },
    {
      accessorKey: "start_time",
      header: "Start",
      cell: info => format(new Date(info.getValue() as string), "PPP p"),
    },
    {
      accessorKey: "end_time",
      header: "End",
      cell: info => format(new Date(info.getValue() as string), "PPP p"),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: info => info.getValue() as string ?? "",
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const confirmed = row.original.is_confirmed;
        return confirmed ? (
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        ) : (
          <X className="h-4 w-4 text-red-600" />
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => <ActionsCell row={row} onConfirm={handleConfirm} />,
    },
  ]


const ActionsCell = ({
  row,
  onConfirm,
}: {
  row: Row<CalendarAppointment>
  onConfirm: ConfirmFn
}) => (
  <DropdownMenu modal={false}>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-8 p-0">
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" className="bg-white">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>

      <DropdownMenuItem
        onClick={() => onConfirm(row.original)}
        className="cursor-pointer flex items-center gap-2 hover:bg-green-100 hover:text-green-600"
      >
        <CheckCircle2 className="h-4 w-4" />
        <span className="text-sm font-medium">Confirm</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)

export default getColumns
