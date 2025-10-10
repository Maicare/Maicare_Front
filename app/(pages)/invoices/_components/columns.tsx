import { ColumnDef, Row } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { 
  ArrowUpDown, 
  FileText, 
  Download, 
  User, 
  Send, 
  Calendar, 
  AlertCircle,
  Clock,
  CheckCircle,
  CircleDollarSign,
  FileSearch,
  Zap,
  Loader,
  CalendarX,
  PlusCircle,
  Database
} from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { Any } from "@/common/types/types"
import { useLocalizedPath } from "@/hooks/common/useLocalizedPath"

export type InvoicesType = {
  id: number
  invoice_number: string
  client_id: number
  client_first_name: string
  client_last_name: string
  sender_id: number
  sender_name: string
  sender_kvknumber: string
  sender_btwnumber: string
  status: "outstanding" | "partially_paid" | "paid" | "expired" | "overpaid" | "imported" | "concept"
  total_amount: number
  issue_date: string
  due_date: string
  created_at: string
  updated_at: string
  warning_count: number
  pdf_attachment_id: string
  extra_content: Any
  invoice_details: {
    contract_id: number
    contract_name: string
    pre_vat_total_price: number
    price: number
    price_time_unit: string
    total_price: number
    vat: number
    warnings: string[]
    periods: {
      start_date: string
      end_date: string
      accommodation_time_frame: string
      ambulante_total_minutes: number
    }[]
  }[]
}

const statusConfig = {
  outstanding: {
    variant: "destructive",
    text: "Openstaand",
    icon: <AlertCircle className="h-4 w-4 mr-1" />,
    bgColor: "bg-red-50 dark:bg-red-900/20",
    textColor: "text-red-600 dark:text-red-400"
  },
  canceled: {
    variant: "destructive",
    text: "Geannuleerd",
    icon: <AlertCircle className="h-5 w-5" />,
    bgColor: "bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/60",
    textColor: "text-red-700 dark:text-red-300",
    borderColor: "border-red-200 dark:border-red-800",
    progressColor: "bg-red-500"
  },
  partially_paid: {
    variant: "warning",
    text: "Gedeeltelijk",
    icon: <Loader className="h-4 w-4 mr-1" />,
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    textColor: "text-amber-600 dark:text-amber-400"
  },
  paid: {
    variant: "success",
    text: "Betaald",
    icon: <CheckCircle className="h-4 w-4 mr-1" />,
    bgColor: "bg-green-50 dark:bg-green-900/20",
    textColor: "text-green-600 dark:text-green-400"
  },
  expired: {
    variant: "outline",
    text: "Verlopen",
    icon: <CalendarX className="h-4 w-4 mr-1" />,
    bgColor: "bg-gray-50 dark:bg-gray-800",
    textColor: "text-gray-500 dark:text-gray-400"
  },
  overpaid: {
    variant: "secondary",
    text: "Overbetaald",
    icon: <PlusCircle className="h-4 w-4 mr-1" />,
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    textColor: "text-purple-600 dark:text-purple-400"
  },
  imported: {
    variant: "default",
    text: "Geïmporteerd",
    icon: <Database className="h-4 w-4 mr-1" />,
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    textColor: "text-blue-600 dark:text-blue-400"
  },
  concept: {
    variant: "outline",
    text: "Concept",
    icon: <FileSearch className="h-4 w-4 mr-1" />,
    bgColor: "bg-gray-50 dark:bg-gray-800",
    textColor: "text-gray-500 dark:text-gray-400"
  }
}

export const columns: ColumnDef<InvoicesType>[] = [
  {
    accessorKey: "invoice_number",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
        >
          <FileText className="h-4 w-4 mr-2 text-blue-500" />
          Factuur #
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <Link 
        href={`/invoices/${row.original.id}`}
        className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline flex items-center"
      >
        <FileText className="h-4 w-4 mr-2 text-blue-500" />
        {row.getValue("invoice_number")}
      </Link>
    )
  },
  {
    accessorKey: "client",
    header: () => (
      <div className="flex items-center">
        <User className="h-4 w-4 mr-2 text-purple-500" />
        <span>Klant</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full mr-3">
          <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <div className="font-medium">{`${row.original.client_first_name} ${row.original.client_last_name}`}</div>
          <div className="text-xs text-muted-foreground">ID: {row.original.client_id}</div>
        </div>
      </div>
    )
  },
  {
    accessorKey: "sender_name",
    header: () => (
      <div className="flex items-center">
        <Send className="h-4 w-4 mr-2 text-amber-500" />
        <span>Opdrachtgever</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full mr-3">
          <Send className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="text-sm">{row.getValue("sender_name")}</div>
      </div>
    )
  },
  {
    accessorKey: "total_amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-green-50 dark:hover:bg-green-900/20"
        >
          <CircleDollarSign className="h-4 w-4 mr-2 text-green-500" />
          Bedrag
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total_amount"))
      const formatted = new Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "EUR"
      }).format(amount)
      
      return (
        <div className="flex items-center font-medium">
          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-3">
            <CircleDollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          {formatted}
        </div>
      )
    }
  },
  {
    accessorKey: "issue_date",
    header: () => (
      <div className="flex items-center">
        <Calendar className="h-4 w-4 mr-2 text-rose-500" />
        <span>Uitgiftedatum</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <div className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-full mr-3">
          <Calendar className="h-4 w-4 text-rose-600 dark:text-rose-400" />
        </div>
        <div className="text-sm">
          {format(new Date(row.getValue("issue_date")), "dd-MM-yyyy")}
        </div>
      </div>
    )
  },
  {
    accessorKey: "due_date",
    header: () => (
      <div className="flex items-center">
        <Clock className="h-4 w-4 mr-2 text-indigo-500" />
        <span>Vervaldatum</span>
      </div>
    ),
    cell: ({ row }) => {
      const dueDate = new Date(row.getValue("due_date"))
      const today = new Date()
      const isOverdue = dueDate < today && row.original.status !== "paid"
      
      return (
        <div className="flex items-center">
          <div className={`${isOverdue ? "bg-red-100 dark:bg-red-900/30" : "bg-indigo-100 dark:bg-indigo-900/30"} p-2 rounded-full mr-3`}>
            <Clock className={`h-4 w-4 ${isOverdue ? "text-red-600 dark:text-red-400" : "text-indigo-600 dark:text-indigo-400"}`} />
          </div>
          <div className={`text-sm ${isOverdue ? "text-red-600 dark:text-red-400 font-medium" : ""}`}>
            {format(dueDate, "dd-MM-yyyy")}
            {isOverdue && (
              <span className="ml-1 text-xs">(Achterstallig)</span>
            )}
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="flex items-center">
        <Zap className="h-4 w-4 mr-2 text-yellow-500" />
        <span>Status</span>
      </div>
    ),
    cell: ({ row }) => {
      const status = row.original.status
      const config = statusConfig[status]
      
      return (
        <div className={`flex items-center ${config.bgColor} ${config.textColor} px-3 py-1 rounded-full w-fit`}>
          {config.icon}
          {config.text}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    }
  },
  {
    accessorKey: "warning_count",
    header: () => (
      <div className="flex items-center">
        <AlertCircle className="h-4 w-4 mr-2 text-orange-500" />
        <span>Waarschuwingen</span>
      </div>
    ),
    cell: ({ row }) => {
      const warnings = row.original.warning_count
      return (
        <div className="flex items-center">
          <div className={`${warnings > 0 ? "bg-orange-100 dark:bg-orange-900/30" : "bg-gray-100 dark:bg-gray-800"} p-2 rounded-full mr-3`}>
            <AlertCircle className={`h-4 w-4 ${warnings > 0 ? "text-orange-600 dark:text-orange-400" : "text-gray-500 dark:text-gray-400"}`} />
          </div>
          {warnings > 0 ? (
            <span className="font-medium">{warnings} {warnings === 1 ? "Waarschuwing" : "Waarschuwingen"}</span>
          ) : (
            <span className="text-muted-foreground">Geen</span>
          )}
        </div>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell row={row} />
  }
]

const ActionCell = ({row}:{row:Row<InvoicesType>}) => {
      const invoice = row.original
      const {currentLocale} = useLocalizedPath();
      return (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
            asChild
          >
            <Link href={`/${currentLocale}/invoices/${invoice.id}`}>
              <FileSearch className="h-4 w-4 mr-2 text-blue-500" />
              Bekijken
            </Link>
          </Button>
          {invoice.pdf_attachment_id && (
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-green-50 dark:hover:bg-green-900/20"
              asChild
            >
              <Link href={`/api/invoices/${invoice.id}/download`}>
                <Download className="h-4 w-4 mr-2 text-green-500" />
                PDF
              </Link>
            </Button>
          )}
        </div>
      )
    }