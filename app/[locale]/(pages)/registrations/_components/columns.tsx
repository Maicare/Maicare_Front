import { ColumnDef, Row } from "@tanstack/react-table"
import { Check, X, Clock, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Registration } from "@/types/registration.types"
import { useRouter } from "next/navigation"
import { useLocalizedPath } from "@/hooks/common/useLocalizedPath"


export const columns: ColumnDef<Registration>[] = [
  {
    accessorKey: "client",
    header: "Client Name",
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.original.client_first_name} {row.original.client_last_name}
        </div>
      )
    },
  },
  {
    accessorKey: "form_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.form_status
      return (
        <div className="flex items-center gap-2">
          {status === "approved" && (
            <>
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-green-600">Approved</span>
            </>
          )}
          {status === "rejected" && (
            <>
              <X className="h-4 w-4 text-red-500" />
              <span className="text-red-600">Rejected</span>
            </>
          )}
          {status === "pending" && (
            <>
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="text-amber-600">Pending</span>
            </>
          )}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "care_type",
    header: "Care Type",
    cell: ({ row }) => {
      const careTypes = []
      if (row.original.care_ambulatory_guidance) careTypes.push("Ambulatory")
      if (row.original.care_assisted_independent_living) careTypes.push("Assisted Living")
      if (row.original.care_protected_living) careTypes.push("Protected Living")
      if (row.original.care_room_training_center) careTypes.push("Training Center")

      return (
        <div className="flex flex-wrap gap-1">
          {careTypes.map((type, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800"
            >
              {type}
            </span>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "referrer",
    header: "Referrer",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.referrer_first_name} {row.original.referrer_last_name}
        </div>
      )
    },
  },
  {
    accessorKey: "application_date",
    header: "Application Date",
    cell: ({ row }) => {
      return new Date(row.original.application_date).toLocaleDateString()
    },
  },
  {
    accessorKey: "risk_count",
    header: "Risk Factors",
    cell: ({ row }) => {
      const count = row.original.risk_count
      return (
        <div className="flex items-center justify-center">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${count > 3 ? "bg-red-100 text-red-800" :
                count > 0 ? "bg-amber-100 text-amber-800" :
                  "bg-green-100 text-green-800"
              }`}
          >
            {count} {count === 1 ? "factor" : "factors"}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({row})=><ActionCell row={row} />,
  },
]
const ActionCell = ({ row }: { row: Row<Registration> }) => {
  const registration = row.original;
  const router = useRouter();
    const { currentLocale } = useLocalizedPath();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuItem
        onClick={() => router.push(`/${currentLocale}/registrations/${registration.id}`)}
          className="hover:bg-indigo-100 hover:text-indigo-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
        >
          View
        </DropdownMenuItem>
        <DropdownMenuItem
        onClick={() => router.push(`/${currentLocale}/registrations/${registration.id}/update`)}
          className="hover:bg-indigo-100 hover:text-indigo-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
        >
          Edit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
};