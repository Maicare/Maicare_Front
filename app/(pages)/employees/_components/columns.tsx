"use client"

import FemaleSvg from "@/common/components/female-svg"
import MaleSvg from "@/common/components/male-svg"
import { mappingGender } from "@/common/data/gender.data"
import ProfilePicture from "@/components/common/profilePicture/profile-picture"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EmployeeList } from "@/types/employee.types"
import { getAge } from "@/utils/get-age"
import { ColumnDef, Row } from "@tanstack/react-table"
import { Archive, CheckCircle, Edit2, Eye, MoreHorizontal, NonBinary, Trash, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
    id: string
    amount: number
    status: "pending" | "processing" | "success" | "failed"
    email: string
}

export const columns: ColumnDef<EmployeeList>[] = [
    {
        id: "profilePicture",
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
        header: () => "Volledige naam",
        accessorFn: (employee) => `${employee.first_name} ${employee.last_name}`,
    },
    {
        accessorKey: "date_of_birth",
        header: () => "Leeftijd",
        cell: (info) =>
            info.getValue() ? getAge(info.getValue() as string) : <span className='bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300'>Niet gespecificeerd</span>,
    },
    {
        accessorKey: "gender",
        header: () => "Geslacht",
        cell: (info) => {
            const gender = (info.getValue() as string).toLowerCase();
            if (gender === "male") {
                return (
                    <div className="flex items-center gap-1">
                        <MaleSvg className="h-5 w-5 text-blue-500 hover:animate-shake-once cursor-pointer" />
                        <span className="text-blue-500 text-base font-medium">
                            {
                                mappingGender[(info.getValue() as string).toLowerCase()]
                            }
                        </span>
                    </div>
                )
            } else if (gender === "female") {
                return (
                    <div className="flex items-center gap-1">
                        <FemaleSvg className="h-5 w-5 text-pink-500" />
                        <span className="text-pink-500 text-base font-medium">
                            {
                                mappingGender[(info.getValue() as string).toLowerCase()]
                            }
                        </span>
                    </div>
                )

            } else {
                return (
                    <div className="flex items-center gap-1">
                        <NonBinary className="h-5 w-5 text-green-300 hover:animate-shake-once cursor-pointer" />
                        <span className="text-green-300 text-base font-medium">
                            {
                                mappingGender[(info.getValue() as string).toLowerCase()] || "Non-binair"
                            }
                        </span>
                    </div>
                )
            }
        }
    },
    {
        accessorKey: "work_phone_number",
        header: () => "Telefoonnummer",
        cell: (info) => info.getValue() || <span className='bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300'>Niet gespecificeerd</span>,
    },
    {
        accessorKey: "email_address",
        header: () => "E-mailadres",
        cell: (info) => info.getValue() || <span className='bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300'>Niet gespecificeerd</span>,
    },
    {
        accessorKey: "out_of_service",
        header: () => "Uit Dienst",
        cell: (info) => {
            if (!info.getValue()) {
                return (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                )
            }
            return (
                <XCircle className="h-5 w-5 text-red-400" />
            )
        }
    },
    {
        id: "actions",
        header: () => "Actions",
        cell: ({ row }) => <ActionCell row={row} />
    },
];

const ActionCell = ({ row }: { row: Row<EmployeeList> }) => {
    const employee = row.original
    const router = useRouter();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => router.push(`/employees/${employee.id}`)}
                    className="hover:bg-indigo-100 hover:text-indigo-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
                >
                    <Eye className="h-4 w-4 " />
                    <span className="text-sm font-medium" >View</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => router.push(`/employees/${employee.id}/update`)}
                    className="hover:bg-orange-100 hover:text-orange-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
                >
                    <Edit2 className="h-4 w-4 " />
                    <span className="text-sm font-medium" >Edit</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => { }}
                    className="bg-red-100 hover:bg-red-200 hover:text-red-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
                >
                    <Trash className="h-4 w-4 " />
                    <span className="text-sm font-medium" >Delete</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => { }}
                    className="bg-red-100 hover:bg-red-200 hover:text-red-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
                >
                    <Archive className="h-4 w-4 " />
                    <span className="text-sm font-medium" >Archive</span>
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
};