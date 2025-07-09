import { ColumnDef, Row } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Mail, Phone, MapPin, User, Building, Clipboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Contact } from "@/schemas/contact.schema"
import { useRouter } from "next/navigation"


const getTypeBadge = (type: Contact["types"]) => {
  const typeMap = {
    main_provider: { label: "Main Provider", color: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
    local_authority: { label: "Local Authority", color: "bg-purple-100 text-purple-800 hover:bg-purple-200" },
    particular_party: { label: "Private Party", color: "bg-green-100 text-green-800 hover:bg-green-200" },
    healthcare_institution: { label: "Healthcare", color: "bg-pink-100 text-pink-800 hover:bg-pink-200" },
  }
  return (
    <Badge className={`${typeMap[type].color} rounded-full px-3 py-1 text-xs font-medium`}>
      {typeMap[type].label}
    </Badge>
  )
}

export const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold text-gray-700 hover:text-gray-900"
        >
          <Building className="mr-2 h-4 w-4" />
          Organization
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-gray-100 text-gray-600">
              {row.original.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900">{row.original.name}</p>
            <p className="text-sm text-gray-500">{row.original.phone_number}</p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "client_number",
    header: () => <span className="font-semibold text-gray-700">Client ID</span>,
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="border-gray-200 bg-gray-50 font-mono">
          {row.original.client_number}
        </Badge>
      )
    },
  },
  {
    accessorKey: "KVKnumber",
    header: () => <span className="font-semibold text-gray-700">KVK</span>,
    cell: ({ row }) => (
      <span className="font-mono text-sm text-gray-600">{row.original.KVKnumber}</span>
    ),
  },
  {
    accessorKey: "address",
    header: () => (
      <div className="flex items-center font-semibold text-gray-700">
        <MapPin className="mr-2 h-4 w-4" />
        Location
      </div>
    ),
    cell: ({ row }) => {
      const address = `${row.original.address}, ${row.original.postal_code} ${row.original.place}`
      return (
        <div className="max-w-[220px] space-y-1">
          <p className="truncate text-sm font-medium text-gray-900">{address}</p>
          <p className="text-xs text-gray-500">{row.original.land}</p>
        </div>
      )
    },
  },
  {
    accessorKey: "contacts",
    header: () => <span className="font-semibold text-gray-700">Primary Contact</span>,
    cell: ({ row }) => {
      const primaryContact = row.original.contacts[0]
      return (
        <div className="space-y-1">
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4 text-gray-400" />
            <span className="font-medium">{primaryContact?.name}</span>
          </div>
          <div className="flex items-center">
            <Mail className="mr-2 h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">{primaryContact?.email}</span>
          </div>
          <div className="flex items-center">
            <Phone className="mr-2 h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">{primaryContact?.phone_number}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "types",
    header: () => <span className="font-semibold text-gray-700">Type</span>,
    cell: ({ row }) => getTypeBadge(row.original.types),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "created_at",
    header: () => <span className="font-semibold text-gray-700">Created</span>,
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"))
      return (
        <div className="text-sm text-gray-600">
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionColumn cell={row} />,
  },
]

export const ActionColumn = ({cell}:{cell:Row<Contact>}) => {
    const router = useRouter();
    const contact = cell.original

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
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(contact.client_number)}
            className="cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100"
          >
            <Clipboard className="mr-2 h-4 w-4" />
            Copy Client ID
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100" onClick={() => router.push(`/contacts/${contact.id}`)}>
            <User className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100" onClick={() => router.push(`/contacts/${contact.id}/edit`)}>
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