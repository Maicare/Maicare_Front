import { ColumnDef } from "@tanstack/react-table";
import { Check, X, ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { AssessmentResponse } from "@/types/assessment.types";
import { LEVEL_OPTIONS } from "@/types/maturity-matrix.types";
import { fullDateFormat } from "@/utils/timeFormatting";

const getTailwindClasses = (level: number) => {
    switch (level) {
        case 1:
            return "bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300";
        case 2:
            return "bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-yellow-900 dark:text-yellow-300";
        case 3:
            return "bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300";
        case 4:
            return "bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-blue-900 dark:text-blue-300";
        case 5:
            return "bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-purple-900 dark:text-purple-300";
        default:
            return "bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300";
    }
};
export const columns: ColumnDef<AssessmentResponse>[] = [
    {
        accessorKey: "topic_name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="p-0 hover:bg-transparent"
                >
                    Topic
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <div className="font-medium">
                    {row.getValue("topic_name")}
                    {row.original.is_active && (
                        <Badge variant="outline" className="ml-2">
                            Active
                        </Badge>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "initial_level",
        header: "Initial Level",
        cell: ({ row }) => {
            return (
                <Badge
                    variant="outline"
                    className={`p-2 ${getTailwindClasses(row.getValue("initial_level"))}`}
                >
                    {LEVEL_OPTIONS.find(it => it.value === (row.getValue("initial_level") as number).toString())?.label || "Niet Beschikbaar"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "current_level",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="p-0 hover:bg-transparent"
                >
                    Current Level
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2">
                    <Badge
                        variant="outline"
                        className={`p-2 ${getTailwindClasses(row.getValue("current_level"))}`}
                    >
                        {LEVEL_OPTIONS.find(it => it.value === (row.getValue("current_level") as number).toString())?.label || "Niet Beschikbaar"}
                    </Badge>
                </div>
            );
        },
    },
    {
        accessorKey: "progress",
        header: "Progress",
        cell: ({ row }) => {
            const progress = row.original.current_level - row.original.initial_level;
            return (
                <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full ${progress > 0 ? 'bg-green-500' : progress < 0 ? 'bg-red-500' : 'bg-gray-500'
                                }`}
                            style={{
                                width: `${Math.min(100, Math.abs(progress) * 25)}%`,
                            }}
                        />
                    </div>
                    <span className={`text-xs ${progress > 0 ? 'text-green-600' : progress < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                        {progress > 0 ? '+' : ''}{progress} levels
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "start_date",
        header: "Start Date",
        cell: ({ row }) => {
            return fullDateFormat(row.getValue("start_date") as string) ? <span className='bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300'>{fullDateFormat(row.getValue("start_date") as string)}</span> : <span className='bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300'>Niet Beschikbaar</span>
        },
    },
    {
        accessorKey: "end_date",
        header: "End Date",
        cell: ({ row }) => {
            return fullDateFormat(row.getValue("end_date") as string) ? <span className='bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-blue-900 dark:text-blue-300'>{fullDateFormat(row.getValue("end_date") as string)}</span> : <span className='bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300'>Niet Beschikbaar</span>
        },
    },
    {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ row }) => {
            const isActive = row.getValue("is_active");
            return (
                <Badge
                    variant="outline"
                    className={`flex items-center gap-1 ${isActive ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-700"
                        }`}
                >
                    {isActive ? (
                        <>
                            <Check className="h-3 w-3" />
                            Active
                        </>
                    ) : (
                        <>
                            <X className="h-3 w-3" />
                            Inactive
                        </>
                    )}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const assessment = row.original;

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
                            onClick={() => navigator.clipboard.writeText(assessment.id.toString())}
                        >
                            Copy assessment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit assessment</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];