import { ColumnDef } from "@tanstack/react-table";
import { 
  MoreHorizontal, 
  Edit2, 
  Trash, 
  MapPin, 
  Eye, 
  Hash, 
  Mail, 
  Building2, 
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText
} from "lucide-react";
import { Organization } from "@/types/organisation";
import { Badge } from "@/components/ui/badge"; // Aangenomen dat je een Badge component hebt
import { useRouter } from "next/navigation";
import { useLocalizedPath } from "@/hooks/common/useLocalizedPath";

// Status badge component voor organisatie verificatiestatus
export const StatusBadge = ({ status }: { status: "verified" | "pending" | "rejected" }) => {
  const statusConfig = {
    verified: {
      icon: CheckCircle2,
      className: "bg-green-100 text-green-800 border-green-200",
      text: "Geverifieerd"
    },
    pending: {
      icon: Clock,
      className: "bg-amber-100 text-amber-800 border-amber-200",
      text: "In behandeling"
    },
    rejected: {
      icon: AlertCircle,
      className: "bg-red-100 text-red-800 border-red-200",
      text: "Afgewezen"
    }
  };

  const { icon: Icon, className, text } = statusConfig[status];

  return (
    <Badge className={`flex items-center gap-1 py-1 px-2 text-xs font-medium w-fit ${className}`}>
      <Icon className="h-3 w-3" />
      {text}
    </Badge>
  );
};

// Actie dropdown component voor professionele acties
const ActionsDropdown = ({ organization, onEditClick }: { organization: Organization, onEditClick: (org: Organization) => void }) => {
  const router = useRouter();
    const { currentLocale } = useLocalizedPath();

  return (
    <div className="relative group">
      <button className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
        <MoreHorizontal className="h-4 w-4 text-gray-600" />
      </button>
      <div className="absolute right-0 top-7 w-40 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
        <button className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 text-blue-600" onClick={() => router.push(`/${currentLocale}/organisations/${organization.id}`)}>
          <Eye className="h-4 w-4" />
          Details Bekijken
        </button>
        <button className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 text-green-600" onClick={() => onEditClick(organization)}>
          <Edit2 className="h-4 w-4" />
          Bewerken
        </button>
        <button className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 text-red-600">
          <Trash className="h-4 w-4" />
          Verwijderen
        </button>
        <div className="border-t border-gray-200">
          <button className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 text-gray-700">
            <FileText className="h-4 w-4" />
            Data Exporteren
          </button>
        </div>
      </div>
    </div>
  );
};

export const getColumns = ({handlePreUpdate}:{handlePreUpdate: (organisation: Organization) => void}): ColumnDef<Organization>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2 font-medium text-gray-700 hover:text-gray-900 group"
        >
          <div className="p-1.5 rounded-md bg-blue-50 group-hover:bg-blue-100 transition-colors">
            <Building2 className="h-4 w-4 text-blue-600" />
          </div>
          <span>Organisatie</span>
          <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
        </button>
      );
    },
    cell: ({ row }) => {
      
      return (
        <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-blue-50 group-hover:bg-blue-100 transition-colors">
            <Building2 className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex flex-col">
            <div className="font-medium text-gray-900">{row.getValue("name")}</div>
          
          </div>
        </div>
      );
    },
    size: 220,
  },
  {
    accessorKey: "email",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-700">
        <div className="p-1.5 rounded-md bg-blue-50">
          <Mail className="h-4 w-4 text-blue-600" />
        </div>
        <span>E-mail</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-blue-50">
          <Mail className="h-4 w-4 text-blue-600" />
        </div>
        <a 
          href={`mailto:${row.getValue("email")}`} 
          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
        >
          {row.getValue("email")}
        </a>
      </div>
    ),
    size: 220,
  },
  {
    accessorKey: "kvk_number",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-700">
        <div className="p-1.5 rounded-md bg-green-50">
          <Hash className="h-4 w-4 text-green-600" />
        </div>
        <span>KVK Nummer</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-green-50">
          <Hash className="h-4 w-4 text-green-600" />
        </div>
        <span className="font-mono text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">
          {row.getValue("kvk_number")}
        </span>
      </div>
    ),
    size: 150,
  },
  {
    accessorKey: "btw_number",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-700">
        <div className="p-1.5 rounded-md bg-red-50">
          <Hash className="h-4 w-4 text-red-600" />
        </div>
        <span>BTW Nummer</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-red-50">
          <Hash className="h-4 w-4 text-red-600" />
        </div>
        <span className="font-mono text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">
          {row.getValue("btw_number")}
        </span>
      </div>
    ),
    size: 150,
  },
  {
    accessorKey: "location",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-700">
        <div className="p-1.5 rounded-md bg-amber-50">
          <MapPin className="h-4 w-4 text-amber-600" />
        </div>
        <span>Locatie</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-amber-50">
            <MapPin className="h-4 w-4 text-amber-600" />
          </div>
          <span className="text-gray-700">{row.original.city}</span>
        </div>
        <div className="text-xs text-gray-500 mt-1 ml-9">
          {row.original.postal_code}, {row.original.address}
        </div>
      </div>
    ),
    size: 220,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const organization = row.original;
      
      return (
        <div className="flex justify-end">
          <ActionsDropdown organization={organization} onEditClick={handlePreUpdate} />
        </div>
      );
    },
    size: 60,
  },
];