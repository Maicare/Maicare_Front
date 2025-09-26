import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Shift } from "@/schemas/shift.schema";
import { ColumnDef } from "@tanstack/table-core";
import { Clock, Edit2, Eye, MoreHorizontal, Trash } from "lucide-react";

export const columns: ColumnDef<Shift>[] = [
    {
        accessorKey: "id",
        header: () => "ID",
        cell: (info) => <span className="font-mono">{info.getValue() as string}</span>,
    },
    {
        accessorKey: "shift",
        header: () => "Shift Name",
        cell: (info) => <span className="font-medium">{info.getValue() as string}</span>,
    },
    {
        accessorKey: "start_time",
        header: () => "Start Time",
        cell: (info) => {
            const time = info.getValue() as string;
            return (
                <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>{formatTime(time)}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "end_time",
        header: () => "End Time",
        cell: (info) => {
            const time = info.getValue() as string;
            return (
                <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-red-500" />
                    <span>{formatTime(time)}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "location_id",
        header: () => "Location",
        cell: (info) => {
            const locationId = info.getValue() as number;
            // You might want to fetch location name based on ID here
            return (
                <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                    Location #{locationId}
                </Badge>
            );
        },
    },
    {
        id: "duration",
        header: () => "Duration",
        cell: ({ row }) => {
            const start = new Date(`1970-01-01T${row.original.start_time}`);
            const end = new Date(`1970-01-01T${row.original.end_time}`);
            const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // in hours
            
            return (
                <Badge variant={duration > 8 ? "destructive" : "default"}>
                    {duration.toFixed(1)} hours
                </Badge>
            );
        },
    },
    {
        id: "actions",
        header: () => "Actions",
        cell: ({ row:_r }) => {
            // const _shift = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuLabel>Shift Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => {}}
                            className="hover:bg-indigo-100 hover:text-indigo-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
                        >
                            <Eye className="h-4 w-4" />
                            <span className="text-sm font-medium">View</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {}}
                            className="hover:bg-orange-100 hover:text-orange-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
                        >
                            <Edit2 className="h-4 w-4" />
                            <span className="text-sm font-medium">Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {}}
                            className="bg-red-100 hover:bg-red-200 hover:text-red-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
                        >
                            <Trash className="h-4 w-4" />
                            <span className="text-sm font-medium">Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

// Helper function to format time (you might want to use a library like date-fns)
function formatTime(timeString: string): string {
    try {
        const [hours, minutes] = timeString.split(':');
        return `${hours}:${minutes}`;
    } catch {
        return timeString;
    }
}