"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { INCIDENT_TYPE_NOTIFICATIONS, INJURY_OPTIONS, PSYCHOLOGICAL_DAMAGE_OPTIONS, SEVERITY_OF_INCIDENT_OPTIONS, TYPES_INCIDENT_OPTIONS } from "@/consts"
import { Incident } from "@/types/incident.types"
import { cn } from "@/utils/cn"
import { formatDateToDutch } from "@/utils/timeFormatting"
import { ColumnDef, Row } from "@tanstack/react-table"
import { AlertCircle, AlertOctagon, AlertTriangle, Bandage, Bell, Bone, Brain, Building2, CheckCircle, Droplets, Edit2,  FileText, Flame, FlaskConical, HeartPulse, Info, MoreHorizontal, Pill, ServerCrash, Skull, Trash, UserX } from "lucide-react"
import { useRouter } from "next/navigation"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useIncident } from "@/hooks/incident/use-incident"
import { useState } from "react"

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
    header: "Reporter",
    cell: (info) => {
      const data = info.row.original;
      return (
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={data.employee_profile_picture || "https://github.com/shadcn.png"} alt="@shadcn" />
            <AvatarFallback className="bg-indigo-500">{data.employee_first_name[0].toUpperCase() + data.employee_last_name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium text-gray-900">
            {data.employee_first_name + " " + data.employee_last_name || "Onbekend"}
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: "incident_date",
    header: "Datum incident",
    cell: (info) => {
      const date = info.getValue() as Date;
      return (
        <span className={cn(
          "flex items-center w-fit gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md",
          "text-indigo-700 bg-indigo-50 border border-indigo-200"
        )}>
          <span>{formatDateToDutch(date)}</span>
        </span>
      )
    }
  },
  {
    accessorKey: "location_name",
    header: "Locatie",
    cell: (info) => {
      // You would typically fetch location name here
      return (
        <span className={cn(
          "flex items-center w-fit gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md",
          "text-gray-700 bg-gray-50 border border-gray-200"
        )}>
          <span>{info.getValue() as string}</span>
        </span>
      );
    }
  },
  {
    accessorKey: "incident_type",
    header: "Type incident",
    cell: (info) => {
      const value = info.getValue() as string;
      const option = TYPES_INCIDENT_OPTIONS.find((option) => option.value === value);
      const typeLabel = option?.label;

      const typeIcon = {
        "yes": <AlertTriangle className="h-5 w-5 text-yellow-500" />, // Near miss
        "no": <AlertCircle className="h-5 w-5 text-orange-500" />,    // Incident
        "nxo": <AlertOctagon className="h-5 w-5 text-red-600" />,     // Calamity
      };

      const typeColors = {
        "yes": "text-yellow-700 bg-yellow-50 border border-yellow-200",
        "no": "text-orange-700 bg-orange-50 border border-orange-200",
        "nxo": "text-red-700 bg-red-50 border border-red-200",
      };

      const getShortLabel = (label: string) => {
        if (value === "yes") return "Gevaarlijke situatie";
        if (value === "no") return "Incident";
        if (value === "nxo") return "Calamiteit";
        return label.split("(")[0].trim();
      };

      const typeClass = typeColors[value as keyof typeof typeColors] ||
        "text-gray-700 bg-gray-50 border border-gray-200";

      return (
        <span className={cn(
          "flex items-center w-fit gap-1 text-xs font-medium px-2.5 py-0.5 rounded-md",
          typeClass
        )}>
          {typeIcon[value as keyof typeof typeIcon]}
          <span>{getShortLabel(typeLabel || "")}</span>
        </span>
      );
    }
  },
  {
    accessorKey: "severity_of_incident",
    header: "Ernst",
    cell: (info) => {
      const value = info.getValue() as string;
      const option = SEVERITY_OF_INCIDENT_OPTIONS.find((option) => option.value === value);
      const severityLabel = option?.label;

      const severityIcon = {
        "near_incident": <Info className="h-5 w-5 text-blue-500" />,
        "less_serious": <AlertCircle className="h-5 w-5 text-yellow-500" />,
        "serious": <AlertTriangle className="h-5 w-5 text-orange-500" />,
        "fatal": <Skull className="h-5 w-5 text-red-800" />,
      };

      const severityColors = {
        "near_incident": "text-blue-700 bg-blue-50 border border-blue-200",
        "less_serious": "text-yellow-700 bg-yellow-50 border border-yellow-200",
        "serious": "text-orange-700 bg-orange-50 border border-orange-200",
        "fatal": "text-red-900 bg-red-50 border border-red-200",
      };

      const getShortLabel = (label: string) => {
        if (value === "near_incident") return "Bijna incident";
        if (value === "less_serious") return "Minder ernstig";
        if (value === "serious") return "Ernstig";
        if (value === "fatal") return "Fataal";
        return label.split(":")[0];
      };

      const severityClass = severityColors[value as keyof typeof severityColors] ||
        "text-gray-700 bg-gray-50 border border-gray-200";

      return (
        <span className={cn(
          "flex items-center w-fit gap-1 text-xs font-medium px-2.5 py-0.5 rounded-md",
          severityClass
        )}>
          {severityIcon[value as keyof typeof severityIcon]}
          <span>{getShortLabel(severityLabel || "")}</span>
        </span>
      );
    }
  },
  {
    accessorKey: "physical_injury",
    header: "Fysiek letsel",
    cell: (info) => {
      const value = info.getValue() as string;
      const option = INJURY_OPTIONS.find((option) => option.value === value);
      const severityLabel = option?.label;
      const severityIcon = {
        "no_injuries": <CheckCircle className="h-5 w-5 text-green-500" />,
        "not_noticeable_yet": <AlertCircle className="h-5 w-5 text-yellow-400" />,
        "bruising_swelling": <Bandage className="h-5 w-5 text-orange-500" />,
        "skin_injury": <AlertTriangle className="h-5 w-5 text-amber-600" />,
        "broken_bones": <Bone className="h-5 w-5 text-red-500" />,
        "shortness_of_breath": <AlertOctagon className="h-5 w-5 text-red-600" />,
        "death": <Skull className="h-5 w-5 text-red-800" />,
      };
      const severityColors = {
        "no_injuries": "text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors",
        "not_noticeable_yet": "text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md hover:bg-yellow-100 transition-colors",
        "bruising_swelling": "text-orange-700 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 transition-colors",
        "skin_injury": "text-amber-700 bg-amber-50 border border-amber-200 rounded-md hover:bg-amber-100 transition-colors",
        "broken_bones": "text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors",
        "shortness_of_breath": "text-red-800 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors",
        "death": "text-red-900 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors",
      };
      const severityClass = severityColors[value as keyof typeof severityColors];

      return (
        <span className={cn(`flex items-center w-fit gap-1 text-orange-500 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm`, severityClass)}>
          {severityIcon[option?.value as keyof typeof severityIcon]}
          <span>{severityLabel?.split(" ").slice(0, 2).join(" ").replace(":", "")}</span>
        </span>
      )
    }
  },
  {
    accessorKey: "psychological_damage",
    header: "Psychische schade",
    cell: (info) => {
      const value = info.getValue() as string;
      const option = PSYCHOLOGICAL_DAMAGE_OPTIONS.find((option) => option.value === value);
      const severityLabel = option?.label;

      const severityIcon = {
        "no": <CheckCircle className="h-5 w-5 text-green-500" />,
        "not_noticeable_yet": <AlertCircle className="h-5 w-5 text-yellow-400" />,
        "drowsiness": <Brain className="h-5 w-5 text-blue-500" />,
        "unrest": <AlertTriangle className="h-5 w-5 text-orange-500" />,
        "other": <HeartPulse className="h-5 w-5 text-purple-500" />,
      };

      const severityColors = {
        "no": "text-green-700 bg-green-50 border border-green-200",
        "not_noticeable_yet": "text-yellow-700 bg-yellow-50 border border-yellow-200",
        "drowsiness": "text-blue-700 bg-blue-50 border border-blue-200",
        "unrest": "text-orange-700 bg-orange-50 border border-orange-200",
        "other": "text-purple-700 bg-purple-50 border border-purple-200",
      };

      const severityClass = severityColors[value as keyof typeof severityColors] ||
        "text-gray-700 bg-gray-50 border border-gray-200";

      return (
        <span className={cn(
          "flex items-center w-fit gap-1 text-xs font-medium px-2.5 py-0.5 rounded-md",
          severityClass
        )}>
          {severityIcon[value as keyof typeof severityIcon]}
          <span>{severityLabel?.split(" ").slice(0, 2).join(" ").replace(":", "")}</span>
        </span>
      );
    }
  },
  {
    header: "Opties",
    cell: (info) => {
      const value = info.row.original;
      const values = [
        "passing_away", "self_harm", "violence", "fire_water_damage",
        "client_absence", "accident", "medicines", "organization",
        "use_prohibited_substances", "other_notifications"
      ];

      const firstTrueValue = values.find((val) => value[val as keyof typeof value] === true);
      const option = INCIDENT_TYPE_NOTIFICATIONS.find((opt) => opt.value === firstTrueValue);
      const notificationLabel = option?.label;

      const notificationIcon = {
        "passing_away": <Skull className="h-5 w-5 text-red-800" />,
        "self_harm": <HeartPulse className="h-5 w-5 text-red-600" />,
        "violence": <AlertTriangle className="h-5 w-5 text-orange-600" />,
        "fire_water_damage": (
          <div className="flex">
            <Flame className="h-5 w-5 text-orange-500" />
            <Droplets className="h-5 w-5 text-blue-500 -ml-1" />
          </div>
        ),
        "client_absence": <UserX className="h-5 w-5 text-amber-600" />,
        "accident": <ServerCrash className="h-5 w-5 text-amber-500" />,
        "medicines": <Pill className="h-5 w-5 text-purple-500" />,
        "organization": <Building2 className="h-5 w-5 text-blue-600" />,
        "use_prohibited_substances": <FlaskConical className="h-5 w-5 text-red-500" />,
        "other_notifications": <Bell className="h-5 w-5 text-gray-600" />
      };

      const notificationColors = {
        "passing_away": "text-red-900 bg-red-50 border border-red-200",
        "self_harm": "text-red-700 bg-red-50 border border-red-200",
        "violence": "text-orange-700 bg-orange-50 border border-orange-200",
        "fire_water_damage": "text-amber-700 bg-amber-50 border border-amber-200",
        "client_absence": "text-amber-600 bg-amber-50 border border-amber-200",
        "accident": "text-amber-700 bg-amber-50 border border-amber-200",
        "medicines": "text-purple-700 bg-purple-50 border border-purple-200",
        "organization": "text-blue-700 bg-blue-50 border border-blue-200",
        "use_prohibited_substances": "text-red-700 bg-red-50 border border-red-200",
        "other_notifications": "text-gray-700 bg-gray-50 border border-gray-200"
      };

      const notificationClass = firstTrueValue
        ? notificationColors[firstTrueValue as keyof typeof notificationColors]
        : "text-gray-400 bg-gray-50 border border-gray-200";

      return (
        <span className={cn(
          "flex items-center w-fit gap-1 text-xs font-medium px-2.5 py-0.5 rounded-md",
          notificationClass
        )}>
          {firstTrueValue && notificationIcon[firstTrueValue as keyof typeof notificationIcon]}
          <span>{notificationLabel || "Geen melding"}</span>
        </span>
      );
    }
  },
  {
    id: "actions",
    header: "Acties",
    cell: ({ row }) => <ActionCell row={row} />,
  }
];

const ActionCell = ({ row }: { row: Row<Incident> }) => {
  const router = useRouter();
  const [type, setType] = useState<"delete" | "confirm">("delete");
  const { confirmOne, generatePdf } = useIncident({ clientId: row.original.client_id, autoFetch: false });
  const dialogProps: Record<"delete" | "confirm", { title: string, desc: string, action: string }> = {
    delete: {
      title: "Incident verwijderen",
      desc: "Weet u zeker dat u dit incident wilt verwijderen?",
      action: "Bevestigen"
    },
    confirm: {
      title: "Bevestig dit incident",
      desc: "Door dit incident te bevestigen, wordt de hier gegenereerde pdf per e-mail verzonden. Weet je het zeker?",
      action: "Bevestigen"
    }
  }
  const selectedDialog = dialogProps[type];
  const handleView = async () => {
    try {
      const res = await generatePdf(row.original?.id as number, { displaySuccess: true });
      window.open(res.file_url, "_blank");
    } catch (error) {
      console.error(error);
    }
  }
  const handleConfirm = async () => {
    if (type === "confirm") {
      try {
        await confirmOne(row.original.id, { displaySuccess: true, displayProgress: true });
      } catch (error) {
        console.error(error);
      }
    }
  }
  return (
    <AlertDialog>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white">
          <DropdownMenuLabel>Acties</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => { router.push(`/clients/${row.original.client_id}/incidents/${row.original.id}/update`) }}
            className="hover:bg-indigo-100 hover:text-indigo-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
          >
            <Edit2 className="h-4 w-4" />
            <span className="text-sm font-medium">Bewerken</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>

            <DropdownMenuItem
              onClick={() => { setType("confirm") }}
              className="bg-green-100 hover:bg-green-200 hover:text-green-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">Bevestig</span>
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogTrigger asChild>

            <DropdownMenuItem
              onClick={() => { setType("delete") }}
              className="bg-red-100 hover:bg-red-200 hover:text-red-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
            >
              <Trash className="h-4 w-4" />
              <span className="text-sm font-medium">verwijderen</span>
            </DropdownMenuItem>
          </AlertDialogTrigger>

        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex flex-col gap-2 items-center">
            <span className="h-12 w-12 rounded-full bg-red-200 flex items-center justify-center">
              <AlertTriangle className="text-red-600 h-8 w-8" />
            </span>
            <span className="text-lg font-semibold">{selectedDialog.title}</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {selectedDialog.desc}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="w-full grid grid-cols-2 gap-2 space-x-0">
          {
            type === "confirm" && <Button onClick={handleView} className="ml-2 p-2 w-full col-span-2 border-none ring-0 bg-sky-200 px-2 py-1 text-sky-500 hover:bg-sky-400 hover:text-white transition-colors">View PDF</Button>
          }
          <AlertDialogCancel className="w-full border-none ring-0 bg-indigo-200 px-2 py-1 text-indigo-500 hover:bg-indigo-400 hover:text-white transition-colors ml-0 space-x-0">Annuleren</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="w-full border-none ring-0 bg-red-200 px-2 py-1 text-red-500 hover:bg-red-500 hover:text-white transition-colors ml-0 space-x-0">{selectedDialog.action}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
