"use client";
import { ColumnDef, Row } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit2, MoreHorizontal, Trash, User, Calendar, Briefcase, UserX } from "lucide-react"
import { formatDateToDutch } from "@/utils/timeFormatting"
import { cn } from "@/utils/cn"
import { EMERGENCY_RELATIONSHIP_OPTIONS } from "@/consts"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { InvolvedEmployeeList } from "@/types/involved.types"
import { useParams } from "next/navigation"
import { useInvolvedEmployee } from "@/hooks/client-network/use-involved-employee"
import { useState } from "react"

export type EmployeeRole = {
    client_id: number;
    created_at: string;
    employee_id: number;
    employee_name?: string;
    id: number;
    role: string;
    start_date: string;
}

export const getColumns = (
    handlePreUpdate: (employee: InvolvedEmployeeList) => void,
): ColumnDef<EmployeeRole>[] => [
        {
            header: "Medewerker",
            cell: (info) => {
                const employeeName = info.row.original.employee_name || "Onbekend";
                return (
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-9 w-9 rounded-full bg-indigo-100 text-indigo-800">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="font-medium">{employeeName}</div>
                            <div className="text-xs text-gray-500">ID: {info.row.original.employee_id}</div>
                        </div>
                    </div>
                )
            }
        },
        {
            accessorKey: "role",
            header: "Rol",
            cell: (info) => {
                const role = info.getValue() as string;
                const roleOption = EMERGENCY_RELATIONSHIP_OPTIONS.find(opt => opt.value === role);

                const roleIcons = {
                    "Vriendschap": <User className="h-4 w-4 text-blue-500" />,
                    "Familierelatie": <User className="h-4 w-4 text-green-500" />,
                    "Romantische Relatie": <User className="h-4 w-4 text-pink-500" />,
                    "Collega": <Briefcase className="h-4 w-4 text-purple-500" />,
                    "Zakelijke Relatie": <Briefcase className="h-4 w-4 text-yellow-500" />,
                    "Mentor/Mentee": <User className="h-4 w-4 text-indigo-500" />,
                    "Kennismaking": <User className="h-4 w-4 text-gray-500" />,
                };

                return (
                    <Badge
                        variant="outline"
                        className={cn(
                            "flex items-center gap-1 max-w-fit",
                            role === "Collega" ? "bg-purple-50 text-purple-700" :
                                role === "Zakelijke Relatie" ? "bg-yellow-50 text-yellow-700" :
                                    "bg-blue-50 text-blue-700"
                        )}
                    >
                        {roleIcons[role as keyof typeof roleIcons] || <User className="h-4 w-4" />}
                        {roleOption?.label || role}
                    </Badge>
                )
            }
        },
        {
            accessorKey: "start_date",
            header: "Startdatum",
            cell: (info) => {
                const date = new Date(info.getValue() as string);
                return (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                            {formatDateToDutch(date)}
                        </span>
                    </div>
                )
            }
        },
        {
            accessorKey: "created_at",
            header: "Aangemaakt op",
            cell: (info) => {
                const date = new Date(info.getValue() as string);
                return (
                    <div className="text-sm text-gray-500">
                        {formatDateToDutch(date)}
                    </div>
                )
            }
        },
        {
            id: "actions",
            header: "Acties",
            cell: ({ row }) => <ActionsCell row={row} handlePreUpdate={handlePreUpdate} />,
        }
    ];

const ActionsCell = ({ row,handlePreUpdate }:{ row: Row<EmployeeRole>,handlePreUpdate: (employee: InvolvedEmployeeList) => void,}) => {
    const { clientId } = useParams();
    const { deleteOne } = useInvolvedEmployee({ clientId: clientId as string });
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleDelete = async () => {
        try {
            await deleteOne(row.original.id.toString(), {
                displaySuccess: true,
                displayProgress: true
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Menu openen</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                    <DropdownMenuLabel>Acties</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => handlePreUpdate(row.original)}
                        className="hover:bg-indigo-100 hover:text-indigo-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
                    >
                        <Edit2 className="h-4 w-4" />
                        <span className="text-sm font-medium">Bewerken</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setIsDeleteOpen(true)}
                        className="bg-red-100 hover:bg-red-200 hover:text-red-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
                    >
                        <Trash className="h-4 w-4" />
                        <span className="text-sm font-medium">Verwijderen</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex flex-col gap-2 items-center">
                            <span className="h-12 w-12 rounded-full bg-red-200 flex items-center justify-center">
                                <UserX className="text-red-600 h-8 w-8" />
                            </span>
                            <span className="text-lg font-semibold">Noodcontact verwijderen</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center">
                            Weet u zeker dat u dit noodcontact wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="w-full grid grid-cols-2 gap-2 space-x-0">
                        <AlertDialogCancel className="w-full border-none ring-0 bg-indigo-200 px-2 py-1 text-indigo-500 hover:bg-indigo-400 hover:text-white transition-colors ml-0 space-x-0">
                            Annuleren
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="w-full border-none ring-0 bg-red-200 px-2 py-1 text-red-500 hover:bg-red-500 hover:text-white transition-colors ml-0 space-x-0"
                        >
                            Verwijderen
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}