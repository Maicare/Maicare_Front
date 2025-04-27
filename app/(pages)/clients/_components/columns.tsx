"use client"

import { mappingGender } from "@/common/data/gender.data"
import ProfilePicture from "@/components/common/profilePicture/profile-picture"

import { STATUS_OPTIONS } from "@/consts"
import { Client } from "@/types/client.types"
import { getAge } from "@/utils/get-age"
import { ColumnDef } from "@tanstack/react-table"

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
      id: "profilePicture",
      // Profile
      header: () => <div className="text-center">Profiel</div>,
      cell: (info) => (
        <div className="flex items-center justify-center">
          <ProfilePicture
            profilePicture={info.row.original.profile_picture}
            width={48}
            height={48}
          />
        </div>
      ),
    },
    {
      id: "full_name",
      header: () => "Volledige Naam",
      accessorFn: (client) => `${client.first_name} ${client.last_name}`,
    },
    {
      accessorKey: "date_of_birth",
      header: () => "Leeftijd",
      cell: (info) =>
        info.getValue()
          ? <span className='bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300'>{getAge(info.getValue() as string)}</span>
          : <span className='bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300'>Niet Beschikbaar</span>,
    },
    {
      accessorKey: "gender",
      header: () => "Geslacht",
      cell: (info) =>
        mappingGender[info.getValue() as string] || <span className='bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300'>Niet Beschikbaar</span>,
    },
    {
      accessorKey: "status",
      header: () => "Status",
      cell: (info) => (
        STATUS_OPTIONS.find(item=>item.value === info.getValue() as string) ?
        <span className='bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300'>{STATUS_OPTIONS.find(item=>item.value === info.getValue() as string)?.label}</span>
        :
        <span className='bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300'>Niet Beschikbaar</span>
      ), //TODO: add thiss condition later
    },
    {
      accessorKey: "document_info",
      header: () => "Documenten",
      cell: (_info) => {
        //   let missing_documents = info.getValue() ["not_uploaded_document_labels"]?.length;
        const missing_documents = 0;
        return missing_documents > 0 ? (
          <span className="text-red-600">
            {missing_documents} missende documenten
          </span>
        ) : (
          <span className='bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300'>voltooid</span>
        );
      },
    },
  ];
