"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  User, MapPin, Calendar,
  FileText,
  Eye,
  Edit,
} from "lucide-react"

import { Client } from "@/types/client.types"
import { ColumnDef, Row } from "@tanstack/react-table"
import { Any } from "@/common/types/types"
import { useRouter } from "next/navigation"
import { useLocalizedPath } from "@/hooks/common/useLocalizedPath"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}



export const columns: ColumnDef<Client>[] = [
  {
    id: "client",
    header: "Client",
    cell: ({ row }) => {
      const client = row.original;
      const fullName = `${client.first_name} ${client.infix || ''} ${client.last_name}`.trim();

      return (
        <div className="flex items-center gap-3">
          {client.profile_picture ? (
            <img
              src={client.profile_picture}
              alt={fullName}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">
              {fullName}
            </span>
            <span className="text-sm text-gray-500">BSN: {client.bsn}</span>
          </div>
        </div>
      );
    },
  },
  {
    id: "age_gender",
    header: "Age / Gender",
    cell: ({ row }) => {
      const client = row.original;

      // Calculate age from date_of_birth
      const calculateAge = (birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
          age--;
        }

        return age;
      };

      const age = client.date_of_birth ? calculateAge(client.date_of_birth) : 'N/A';

      return (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{age} years</span>
          <span className="text-sm text-gray-500 capitalize">{client.gender || 'Not specified'}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "filenumber",
    header: () => (
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-cyan-500" />
        <span>File Number</span>
      </div>
    ),
    cell: ({ row }) => {
      const fileNumber = row.getValue("filenumber") as string;
      return (
        <div className="font-medium text-gray-800">
          {fileNumber || "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      const statusVariants: Record<string, string> = {
        active: "bg-green-100 text-green-800 border-green-200",
        inactive: "bg-gray-100 text-gray-800 border-gray-200",
        pending: "bg-amber-100 text-amber-800 border-amber-200",
        terminated: "bg-red-100 text-red-800 border-red-200",
        completed: "bg-blue-100 text-blue-800 border-blue-200",
      };

      const statusClass = statusVariants[status?.toLowerCase()] || statusVariants.inactive;

      return (
        <Badge variant="outline" className={`capitalize ${statusClass}`}>
          {status || "inactive"}
        </Badge>
      );
    },
  },
  {
    id: "location",
    header: () => (
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-red-500" />
        <span>Location</span>
      </div>
    ),
    cell: ({ row }) => {
      const client = row.original;
      return (
        <div className="flex flex-col">
          <span className="text-gray-800">{client.city || "N/A"}</span>
          <span className="text-sm text-gray-500">{client.Zipcode || ""}</span>
        </div>
      );
    },
  },
  {
    id: "intake_date",
    header: () => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-amber-500" />
        <span>Intake Date</span>
      </div>
    ),
    cell: ({ row }) => {
      const client = row.original;
      const intakeDate = (client as Any).intake_date || client.created_at;

      return (
        <div className="text-gray-700">
          {intakeDate ? new Date(intakeDate).toLocaleDateString() : "N/A"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({row}) => <ActionCell row={row} />
  },
];
// export const columns: ColumnDef<Client>[] = [
//     {
//       id: "profilePicture",
//       // Profile
//       header: () => <div className="text-center">Profiel</div>,
//       cell: (info) => (
//         <div className="flex items-center justify-center">
//           <ProfilePicture
//             profilePicture={info.row.original.profile_picture}
//             width={48}
//             height={48}
//           />
//         </div>
//       ),
//     },
//     {
//       id: "full_name",
//       header: () => "Volledige Naam",
//       accessorFn: (client) => `${client.first_name} ${client.last_name}`,
//     },
//     {
//       accessorKey: "date_of_birth",
//       header: () => "Leeftijd",
//       cell: (info) =>
//         info.getValue()
//           ? <span className='bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300'>{getAge(info.getValue() as string)}</span>
//           : <span className='bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300'>Niet Beschikbaar</span>,
//     },
//     {
//       accessorKey: "gender",
//       header: () => "Geslacht",
//       cell: (info) =>
//         mappingGender[info.getValue() as string] || <span className='bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300'>Niet Beschikbaar</span>,
//     },
//     {
//       accessorKey: "status",
//       header: () => "Status",
//       cell: (info) => (
//         STATUS_OPTIONS.find(item=>item.value === info.getValue() as string) ?
//         <span className='bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300'>{STATUS_OPTIONS.find(item=>item.value === info.getValue() as string)?.label}</span>
//         :
//         <span className='bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300'>Niet Beschikbaar</span>
//       ), //TODO: add thiss condition later
//     },
//     {
//       accessorKey: "document_info",
//       header: () => "Documenten",
//       cell: (_info) => {
//         //   let missing_documents = info.getValue() ["not_uploaded_document_labels"]?.length;
//         const missing_documents = 0;
//         return missing_documents > 0 ? (
//           <span className="text-red-600">
//             {missing_documents} missende documenten
//           </span>
//         ) : (
//           <span className='bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300'>voltooid</span>
//         );
//       },
//     },
//   ];
const ActionCell = ({ row }:{row:Row<Client>}) => {
  const client = row.original;
  const router = useRouter();
    const { currentLocale } = useLocalizedPath();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
        onClick={() => router.push(`/${currentLocale}/clients/${client.id}/overview`)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 text-green-600 hover:text-green-800 hover:bg-green-50"
        onClick={() => router.push(`/${currentLocale}/clients/${client.id}/update`)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      {/* <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50"
        onClick={() => console.log("Delete client:", client)}
      >
        <DeleteClientButton 
          client={client}
          onDelete={(id)=>deleteOne(id.toString())}
          />
        
      </Button> */}
    </div>
  );
};