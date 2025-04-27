"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ColumnDef, Row } from "@tanstack/react-table"
import { Edit2, Mail, Phone, Trash, User, UserCheck, UserX, MoreHorizontal, Heart, Users, Handshake, Briefcase, GraduationCap } from "lucide-react"
import { useParams } from "next/navigation"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useState } from "react"
import { cn } from "@/utils/cn"
import { EmergencyContactList } from "@/types/emergency.types"
import { EMERGENCY_DISTANCE_OPTIONS, EMERGENCY_RELATIONSHIP_OPTIONS } from "@/consts"
import { useEmergencyContact } from "@/hooks/client-network/use-emergency-contact"


export const getColumns = (handlePreUpdate: (contact: EmergencyContactList) => void): ColumnDef<EmergencyContactList>[] => [
  {
    header: "Contact",
    cell: (info) => {
      const data = info.row.original;
      return (
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={"https://github.com/shadcn.png"} alt="@shadcn" />
            <AvatarFallback className="bg-indigo-500">
              {data.first_name?.[0]?.toUpperCase() + data.last_name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-gray-900">
              {data.first_name + " " + data.last_name}
            </div>
            <div className="text-xs text-gray-500">{data.relationship}</div>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: "email",
    header: "Contact Info",
    cell: (info) => {
      const email = info.getValue() as string;
      const phone = info.row.original.phone_number;

      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-indigo-500" />
            <span className="text-sm">{email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-indigo-500" />
            <span className="text-sm">{phone}</span>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: "relationship",
    header: "Relationship",
    cell: (info) => {
      const relationship = info.getValue() as string;
      const relationDistance = info.row.original.relation_status; // Assuming this is where distance is stored

      const relationshipOption = EMERGENCY_RELATIONSHIP_OPTIONS.find(opt => opt.value === relationship);
      const distanceOption = EMERGENCY_DISTANCE_OPTIONS.find(opt => opt.value === relationDistance);

      const relationshipIcons = {
        "Vriendschap": <Heart className="h-4 w-4 text-pink-500" />,
        "Familierelatie": <Users className="h-4 w-4 text-blue-500" />,
        "Romantische Relatie": <Heart className="h-4 w-4 text-red-500" />,
        "Collega": <Briefcase className="h-4 w-4 text-gray-500" />,
        "Zakelijke Relatie": <Handshake className="h-4 w-4 text-green-500" />,
        "Mentor/Mentee": <GraduationCap className="h-4 w-4 text-purple-500" />,
        "Kennismaking": <User className="h-4 w-4 text-yellow-500" />,
      };

      const distanceColors = {
        "Primary Relationship": "bg-blue-100 text-blue-800 border-blue-200",
        "Secondary Relationship": "bg-purple-100 text-purple-800 border-purple-200",
        "": "bg-gray-100 text-gray-800 border-gray-200"
      };

      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {relationshipIcons[relationship as keyof typeof relationshipIcons] || <User className="h-4 w-4" />}
            <span className="text-sm font-medium">
              {relationshipOption?.label || relationship}
            </span>
          </div>
          {distanceOption && distanceOption.value && (
            <span className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
              distanceColors[distanceOption.value as keyof typeof distanceColors] || distanceColors[""]
            )}>
              {distanceOption.label}
            </span>
          )}
        </div>
      )
    }
  },
  {
    header: "Notification Settings",
    cell: (info) => {
      const { medical_reports, goals_reports, incidents_reports } = info.row.original;

      const getBadge = (enabled: boolean, label: string) => (
        <span className={cn(
          "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md",
          enabled ? "text-green-700 bg-green-50 border border-green-200" : "text-gray-400 bg-gray-50 border border-gray-200"
        )}>
          {enabled ? (
            <UserCheck className="h-3.5 w-3.5" />
          ) : (
            <UserX className="h-3.5 w-3.5" />
          )}
          {label}
        </span>
      );

      return (
        <div className="flex flex-wrap gap-1">
          {getBadge(medical_reports, "Medical")}
          {getBadge(goals_reports, "Goals")}
          {getBadge(incidents_reports, "Incidents")}
        </div>
      )
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} handlePreUpdate={handlePreUpdate} />
  }
];
const ActionsCell = ({ row, handlePreUpdate }: { row: Row<EmergencyContactList>, handlePreUpdate: (contact: EmergencyContactList) => void }) => {
  const { clientId } = useParams();
  const { deleteOne } = useEmergencyContact({ clientId: clientId as string });
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
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => handlePreUpdate(row.original)}
            className="hover:bg-indigo-100 hover:text-indigo-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
          >
            <Edit2 className="h-4 w-4" />
            <span className="text-sm font-medium">Edit</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsDeleteOpen(true)}
            className="bg-red-100 hover:bg-red-200 hover:text-red-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
          >
            <Trash className="h-4 w-4" />
            <span className="text-sm font-medium">Delete</span>
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
              <span className="text-lg font-semibold">Delete Emergency Contact</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Are you sure you want to delete this emergency contact? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="w-full grid grid-cols-2 gap-2 space-x-0">
            <AlertDialogCancel className="w-full border-none ring-0 bg-indigo-200 px-2 py-1 text-indigo-500 hover:bg-indigo-400 hover:text-white transition-colors ml-0 space-x-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="w-full border-none ring-0 bg-red-200 px-2 py-1 text-red-500 hover:bg-red-500 hover:text-white transition-colors ml-0 space-x-0"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}