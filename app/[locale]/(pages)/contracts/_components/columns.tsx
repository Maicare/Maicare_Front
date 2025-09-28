import { ColumnDef, Row } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle2,  AlertCircle, CircleOff, FileText, User, MoreHorizontal } from "lucide-react"
import { cn } from "@/utils/cn"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useLocalizedPath } from "@/hooks/common/useLocalizedPath"

export type ContractResults = {
  id: number
  client_id: number
  status: "draft" | "approved" | "terminated" | "stoped"
  start_date: string
  end_date?: string
  price: number
  price_time_unit: "daily" | "weekly" | "monthly" | "minute" | "hourly"
  care_name: string
  care_type: "ambulante" | "accommodation"
  financing_act: "WMO" | "ZVW" | "WLZ" | "JW" | "WPG"
  financing_option: "ZIN" | "PGB"
  created_at: string
  sender_id: number
  sender_name: string
  client_first_name: string
  client_last_name: string
}

export const columns: ColumnDef<ContractResults>[] = [
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => {
      const contract = row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-blue-200">
            <AvatarFallback className="bg-blue-100 text-blue-800">
              {`${contract.client_first_name[0]}${contract.client_last_name[0]}`}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900">
              {contract.client_first_name} {contract.client_last_name}
            </p>
            <p className="text-xs text-gray-500">
              Client ID: {contract.client_id}
            </p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "care_name",
    header: "Contract Details",
    cell: ({ row }) => {
      const contract = row.original
      return (
        <div className="flex flex-col gap-1">
          <p className="font-medium text-gray-900">{contract.care_name}</p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("text-xs",contract.care_type === "ambulante" ? "bg-pink-100 text-pink-800" : "bg-green-100 text-green-800")}>
              {contract.care_type === "ambulante" ? "Ambulante" : "Accommodation"}
            </Badge>
            <span className="text-xs text-gray-500">
              {new Date(contract.start_date).toLocaleDateString()} -{' '}
              {contract.end_date ? new Date(contract.end_date).toLocaleDateString() : 'Ongoing'}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Created by: {contract.sender_name}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "financing",
    header: "Financing",
    cell: ({ row }) => {
      const contract = row.original
      
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
          <Badge className={`text-xs ${actColors[contract.financing_act]} border-0`}>
            {contract.financing_act}
          </Badge>
          <Badge className={`text-xs ${optionColors[contract.financing_option]} border-0`}>
            {contract.financing_option}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const contract = row.original
      const timeUnitLabels = {
        daily: "day",
        weekly: "week",
        monthly: "month",
        minute: "minute",
        hourly: "hour"
      }
      
      return (
        <div className="flex flex-col">
          <span className="font-medium">€{contract.price.toFixed(2)}</span>
          <span className="text-xs text-gray-500">
            per {timeUnitLabels[contract.price_time_unit]}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as ContractResults["status"]
      
      const statusConfig = {
        draft: {
          icon: <FileText className="h-4 w-4" />,
          color: "bg-gray-100 text-gray-800",
          label: "Draft"
        },
        approved: {
          icon: <CheckCircle2 className="h-4 w-4" />,
          color: "bg-green-100 text-green-800",
          label: "Active"
        },
        terminated: {
          icon: <CircleOff className="h-4 w-4" />,
          color: "bg-red-100 text-red-800",
          label: "Terminated"
        },
        stoped: {
          icon: <AlertCircle className="h-4 w-4" />,
          color: "bg-yellow-100 text-yellow-800",
          label: "Stopped"
        }
      }
      
      return (
        <Badge className={`flex items-center gap-1 ${statusConfig[status].color} border-0`}>
          {statusConfig[status].icon}
          {statusConfig[status].label}
        </Badge>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"))
      return (
        <div className="text-sm text-gray-600">
          {date.toLocaleDateString()}
          <div className="text-xs text-gray-400">
            {date.toLocaleTimeString()}
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
export const ActionColumn = ({cell}:{cell:Row<ContractResults>}) => {
    const router = useRouter();
    const contact = cell.original
    const { currentLocale } = useLocalizedPath();

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-gray-800 shadow-lg">
          <DropdownMenuLabel className="font-semibold">Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100" onClick={() => router.push(`/${currentLocale}/clients/${contact.client_id}/contract/${contact.id}`)}>
            <User className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100" onClick={() => router.push(`/${currentLocale}/clients/${contact.client_id}/contract/${contact.id}/edit`)}>
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
            Edit
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
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
}