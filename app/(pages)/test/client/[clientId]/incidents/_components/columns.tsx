"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Incident } from "@/types/incident.types"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { AlertCircle, AlertTriangle,  CheckCircle,  Edit2,  Eye,  FileText,  MoreHorizontal,  XCircle } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
    id: string
    amount: number
    status: "pending" | "processing" | "success" | "failed"
    email: string
}

export const columns: ColumnDef<Incident>[] = [
    {
      accessorKey: "incident_date",
      header: "Datum incident",
      cell: (info) => {
        const date = info.getValue() as Date;
        return date ? format(date, "dd-MM-yyyy") : <span className='bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm'>Niet gespecificeerd</span>;
      }
    },
    {
      accessorKey: "employee_id",
      header: "Medewerker",
      cell: (info) => {
        // You would typically fetch employee name here
        return info.getValue() || <span className='bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm'>Niet gespecificeerd</span>;
      }
    },
    {
      accessorKey: "location_id",
      header: "Locatie",
      cell: (info) => {
        // You would typically fetch location name here
        return info.getValue() || <span className='bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm'>Niet gespecificeerd</span>;
      }
    },
    {
      accessorKey: "incident_type",
      header: "Type incident",
      cell: (info) => {
        const type = info.getValue() as string;
        const typeMap: Record<string, { color: string, icon: React.ReactNode }> = {
          // Define your mappings here
        };
        
        const mapping = typeMap[type] || { color: 'gray', icon: <AlertCircle className="h-4 w-4" /> };
        
        return (
          <div className={`flex items-center gap-1 text-${mapping.color}-500`}>
            {mapping.icon}
            <span>{type}</span>
          </div>
        );
      }
    },
    {
      accessorKey: "severity_of_incident",
      header: "Ernst",
      cell: (info) => {
        const severity = info.getValue() as string;
        const severityColors: Record<string, string> = {
          low: 'green',
          medium: 'yellow',
          high: 'red'
        };
        
        return (
          <Badge variant={severityColors[severity] as 'default' | 'destructive' | 'outline' | 'secondary'}>
            {severity}
          </Badge>
        );
      }
    },
    {
      accessorKey: "physical_injury",
      header: "Fysiek letsel",
      cell: (info) => {
        const value = info.getValue() as string;
        return value ? (
          <CheckCircle className="h-5 w-5 text-green-400" />
        ) : (
          <XCircle className="h-5 w-5 text-red-400" />
        );
      }
    },
    {
      accessorKey: "psychological_damage",
      header: "Psychische schade",
      cell: (info) => {
        const value = info.getValue() as string;
        return value ? (
          <CheckCircle className="h-5 w-5 text-green-400" />
        ) : (
          <XCircle className="h-5 w-5 text-red-400" />
        );
      }
    },
    {
      accessorKey: "violence",
      header: "Geweld",
      cell: (info) => {
        const value = info.getValue() as boolean;
        return value ? (
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span>Ja</span>
          </div>
        ) : (
          <span>Nee</span>
        );
      }
    },
    {
      id: "actions",
      header: "Acties",
      cell: ({ row:_row }) => {
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuLabel>Acties</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {}}
                className="hover:bg-indigo-100 hover:text-indigo-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">Bekijken</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {}}
                className="hover:bg-orange-100 hover:text-orange-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
              >
                <Edit2 className="h-4 w-4" />
                <span className="text-sm font-medium">Bewerken</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {}}
                className="bg-red-100 hover:bg-red-200 hover:text-red-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">Rapport</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];
