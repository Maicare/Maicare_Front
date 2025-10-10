import { ColumnDef, Row } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { CareType, Contract, } from "@/schemas/contract.schema"
import { CheckCircle2, Clock, AlertCircle, CircleOff, FileText, User, Building2, MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export const columns: ColumnDef<Contract>[] = [
  {
    accessorKey: "care_name",
    header: "Zorgdienst",
    cell: ({ row }) => {
      const contract = row.original
      return (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{contract.care_name}</p>
            <p className="text-xs text-gray-500">
              {new Date(contract.start_date).toLocaleDateString()} -{' '}
              {contract.end_date ? new Date(contract.end_date).toLocaleDateString() : 'Lopend'}
            </p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "care_type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("care_type") as CareType
      const isAmbulante = type === "ambulante"

      return (
        <Badge
          variant="outline"
          className={`flex items-center gap-1 ${isAmbulante ? 'bg-purple-50 text-purple-800 border-purple-200' : 'bg-green-50 text-green-800 border-green-200'}`}
        >
          {isAmbulante ? (
            <>
              <User className="h-3 w-3" />
              <span>Ambulante</span>
            </>
          ) : (
            <>
              <Building2 className="h-3 w-3" />
              <span>Accommodatie</span>
            </>
          )}
        </Badge>
      )
    },
  },
  {
    accessorKey: "financing",
    header: "Financiering",
    cell: ({ row }) => {
      const contract = row.original
      const act = contract.financing_act
      const option = contract.financing_option

      const actColors = {
        WMO: "bg-blue-100 text-blue-800",
        ZVW: "bg-green-100 text-green-800",
        WLZ: "bg-yellow-100 text-yellow-800",
        JW: "bg-purple-100 text-purple-800",
        WPG: "bg-red-100 text-red-800",
      }

      const optionColors = {
        ZIN: "bg-indigo-100 text-indigo-800",
        PGB: "bg-teal-100 text-teal-800",
      }

      return (
        <div className="flex flex-col gap-1">
          <Badge className={`text-xs ${actColors[act]} border-0`}>
            {act}
          </Badge>
          <Badge className={`text-xs ${optionColors[option]} border-0`}>
            {option}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "price",
    header: "Prijs",
    cell: ({ row }) => {
      const contract = row.original
      const price = parseFloat(row.getValue("price"))
      const vat = contract.VAT
      // const _careType = contract.care_type

      const timeUnitLabels = {
        daily: "dag",
        weekly: "week",
        monthly: "maand",
        minute: "minuut",
        hourly: "uur"
      }

      return (
        <div className="flex flex-col">
          <span className="font-medium">€{price.toFixed(2)}</span>
          <span className="text-xs text-gray-500">
            {vat}% BTW • per {timeUnitLabels[contract.price_time_unit as keyof typeof timeUnitLabels]}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Contract["status"]

      const statusConfig = {
        draft: {
          icon: <FileText className="h-4 w-4" />,
          color: "bg-gray-100 text-gray-800",
          label: "Concept"
        },
        approved: {
          icon: <CheckCircle2 className="h-4 w-4" />,
          color: "bg-green-100 text-green-800",
          label: "Actief"
        },
        terminated: {
          icon: <CircleOff className="h-4 w-4" />,
          color: "bg-red-100 text-red-800",
          label: "Beëindigd"
        },
        stoped: {
          icon: <AlertCircle className="h-4 w-4" />,
          color: "bg-yellow-100 text-yellow-800",
          label: "Gestopt"
        }
      }

      return (
        <Badge className={`flex items-center gap-1 ${statusConfig[status].color} border-0`}>
          {statusConfig[status].icon}
          {statusConfig[status].label}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "reminder_period",
    header: "Herinnering",
    cell: ({ row }) => {
      const days = row.getValue("reminder_period") as number
      return (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Clock className="h-4 w-4 text-gray-400" />
          <span>{days} dagen</span>
        </div>
      )
    },
  },
  {
    accessorKey: "updated_at",
    header: "Laatst bijgewerkt",
    cell: ({ row }) => {
      const date = new Date(row.getValue("updated_at"))
      return (
        <div className="text-sm text-gray-600">
          {date.toLocaleDateString('nl-NL')}
          <div className="text-xs text-gray-400">
            {date.toLocaleTimeString('nl-NL')}
          </div>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionColumn cell={row} />,
  },
]
export const ActionColumn = ({cell}:{cell:Row<Contract>}) => {

    const router = useRouter();
    const contact = cell.original

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
            <span className="sr-only">Menu openen</span>
            <MoreHorizontal className="h-4 w-4 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-gray-800 shadow-lg">
          <DropdownMenuLabel className="font-semibold">Acties</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100" onClick={() => router.push(`contract/${contact.id}`)}>
            <User className="mr-2 h-4 w-4" />
            Details bekijken
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100" onClick={() => router.push(`contract/${contact.id}/edit`)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Bewerken
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointe hover:bg-gray-100 focus:bg-gray-100 text-red-600 focus:text-red-600" >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            Verwijderen
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
}