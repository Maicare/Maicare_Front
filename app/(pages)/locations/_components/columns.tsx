import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal, Edit2, Trash, MapPin, Users, Warehouse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Location } from "@/schemas/location.schema";
import { useRouter } from "next/navigation";

interface ColumnsProps {
  handlePreUpdate: (location: Location) => void;
}

export const getColumns = ({ handlePreUpdate }: ColumnsProps): ColumnDef<Location>[] => [
  {
    accessorKey: "id",
    header: () => "ID",
    cell: (info) => (
      <span className="font-mono text-sm text-gray-600">
        #{info.getValue() as number}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: () => "Locatienaam",
    cell: (info) => (
      <div className="flex items-center gap-2">
        <Warehouse className="h-4 w-4 text-blue-500" />
        <span className="font-medium">{info.getValue() as string}</span>
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: () => "Adres",
    cell: (info) => (
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-green-500" />
        <span className="text-sm">{info.getValue() as string}</span>
      </div>
    ),
  },
  {
    accessorKey: "capacity",
    header: () => "Capaciteit",
    cell: (info) => {
      const capacity = info.getValue() as number;
      return (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-purple-500" />
          <Badge 
            variant={capacity > 100 ? "default" : "secondary"}
            className={capacity > 100 ? "bg-purple-100 text-purple-800" : ""}
          >
            {capacity} personen
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => "Acties",
    cell: ({ row }) => <ActionCell row={row} handlePreUpdate={handlePreUpdate} />,
  },
];

const ActionCell = ({ row ,handlePreUpdate}: { row: Row<Location>,handlePreUpdate: (location: Location) => void }) => {
    const location = row.original;
    const router = useRouter();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Menu openen</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuLabel>Locatie Acties</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => router.push(`/locations/${location.id}/overview`)}
              className="hover:bg-indigo-100 hover:text-indigo-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">Details Bekijken</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handlePreUpdate(location)}
              className="hover:bg-orange-100 hover:text-orange-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
            >
              <Edit2 className="h-4 w-4" />
              <span className="text-sm font-medium">Bewerken</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => console.log("Delete", location.id)}
              className="bg-red-100 hover:bg-red-200 hover:text-red-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
            >
              <Trash className="h-4 w-4" />
              <span className="text-sm font-medium">Verwijderen</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
};