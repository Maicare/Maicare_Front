"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/utils/cn"
import { ColumnDef, Row } from "@tanstack/react-table"
import { AlertCircle, AlertTriangle, CheckCircle, Edit2, Eye, MoreHorizontal, Pill, Trash, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Diagnosis } from "@/types/diagnosis.types"
import { DIAGNOSIS_SEVERITY_OPTIONS } from "@/consts"
import { format } from "date-fns"
import { useDiagnosis } from "@/hooks/diagnosis/use-diagnosis"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"



export const columns: ColumnDef<Diagnosis>[] = [
    {
        header: "Diagnose",
        cell: (info) => {
            const data = info.row.original;
            return (
                <div className="flex flex-col space-y-1">
                    <div className="text-sm font-semibold text-gray-900">{data.title}</div>
                    <div className="text-xs text-gray-500 line-clamp-2">{data.description}</div>
                </div>
            )
        }
    },
    {
        accessorKey: "diagnosing_clinician",
        header: "Klinisch specialist",
        cell: (info) => {
            const clinician = info.getValue() as string;
            return (
                <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback className="bg-blue-500 text-white">
                            {clinician ? clinician[0].toUpperCase() : "K"}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{clinician || "Onbekend"}</span>
                </div>
            )
        }
    },
    {
        accessorKey: "diagnosis_code",
        header: "Code",
        cell: (info) => {
            const code = info.getValue() as string;
            return (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {code || "N.v.t."}
                </Badge>
            )
        }
    },
    {
        accessorKey: "severity",
        header: "Ernst",
        cell: (info) => {
            const value = info.getValue() as string;
            const option = DIAGNOSIS_SEVERITY_OPTIONS.filter(i => i.value !== "").find((option) => option.value === value);
            const severityLabel = option?.label.split(":")[0];

            const severityIcon = {
                "Mild": <CheckCircle className="h-4 w-4 text-green-500" />,
                "Moderate": <AlertCircle className="h-4 w-4 text-yellow-500" />,
                "Severe": <XCircle className="h-4 w-4 text-red-500" />,
            };

            const severityColors = {
                "Mild": "text-green-700 bg-green-50 border border-green-200",
                "Moderate": "text-yellow-700 bg-yellow-50 border border-yellow-200",
                "Severe": "text-red-700 bg-red-50 border border-red-200",
            };

            return (
                <span className={cn(
                    "flex items-center w-fit gap-1 text-xs font-medium px-2.5 py-0.5 rounded-md",
                    severityColors[value as keyof typeof severityColors] || "text-gray-700 bg-gray-50 border border-gray-200"
                )}>
                    {severityIcon[value as keyof typeof severityIcon]}
                    <span>{severityLabel}</span>
                </span>
            );
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
            const value = info.getValue() as string;

            return (
                <Badge variant="outline" className={cn(
                    "text-purple-700 bg-purple-50 border border-purple-200"
                )}>
                    {value}
                </Badge>
            );
        }
    },
    {
        header: "Medicatie",
        cell: (info) => {
            const medications = info.row.original.medications || [];
            if (medications.length === 0) {
                return (
                    <div className="flex items-center text-xs font-medium px-2 py-1 rounded-full text-gray-500 w-fit bg-gray-50 border border-gray-200">
                        <Pill className="h-4 w-4 mr-2" />
                        Geen medicatie voorgeschreven
                    </div>
                );

            }
            if (medications.length <= 1) {
                const med = medications[0];
                return (
                    <div
                        className={cn(
                            "flex flex-col text-xs font-medium px-2 py-1 rounded-md w-fit",
                            med.is_critical
                                ? "text-red-700 bg-red-50 border border-red-200"
                                : "text-blue-700 bg-blue-50 border border-blue-200"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <Pill className={cn(
                                "h-3 w-3",
                                med.is_critical ? "text-red-500" : "text-blue-500"
                            )} />
                            <span className="font-semibold">{med.name}</span>
                            {med.is_critical && (
                                <span className="text-[8px] text-red-500 font-bold">(KRITIEK)</span>
                            )}
                        </div>
                        <div className="text-xs opacity-80 ml-5">{med.dosage}</div>
                    </div>
                )
            }
            const med = medications.find(m => m.is_critical) || medications[0];
            return (
                <div className="flex flex-col gap-1">
                    <div
                        className={cn(
                            "flex flex-col text-xs font-medium px-2 py-1 rounded-md w-fit",
                            med.is_critical
                                ? "text-red-700 bg-red-50 border border-red-200"
                                : "text-blue-700 bg-blue-50 border border-blue-200"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <Pill className={cn(
                                "h-3 w-3",
                                med.is_critical ? "text-red-500" : "text-blue-500"
                            )} />
                            <span className="font-semibold text-xs">{med.name}</span>
                            {med.is_critical && (
                                <span className="text-[8px] text-red-500 font-bold">(KRITIEK)</span>
                            )}
                        </div>
                        <div className="text-xs opacity-80 ml-5">{med.dosage}</div>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-fit h-fit hover:bg-gray-500 hover:text-white transition-colors text-xs flex items-center gap-0.5 px-2 py-1 rounded-md border-1 border-gray-500 bg-gray-50 text-gray-600">
                                <span>{medications.length - 1} meer</span>
                                <MoreHorizontal className="w-2.5 h-2.5 mt-1" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Pill className="h-4 w-4" />
                                    <span className="text-lg font-semibold">Medicatie</span>
                                </DialogTitle>
                                <DialogDescription className="text-sm text-gray-500">
                                    Hier zijn de voorgeschreven medicijnen voor deze diagnose.
                                </DialogDescription>
                            </DialogHeader>
                            {
                                medications.map((medication) => (
                                    <div key={medication.id} className="flex flex-col gap-2 hover:bg-gray-100 p-2 rounded-md">
                                        <div className="flex items-center gap-2">
                                            <Pill className={cn(
                                                "h-3 w-3",
                                                medication.is_critical ? "text-red-500" : "text-blue-500"
                                            )} />
                                            <span className="font-semibold text-xs">{medication.name}</span>
                                            {medication.is_critical && (
                                                <span className="text-[8px] text-red-500 font-bold">(KRITIEK)</span>
                                            )}
                                        </div>
                                        <div className="text-xs opacity-80 ml-5">{medication.dosage}</div>
                                    </div>
                                ))
                            }
                        </DialogContent>
                    </Dialog>
                </div>
            )
        }
    },
    {
        header: "Diagnose periode",
        cell: (info) => {
            const diagnosis = info.row.original;
            const medications = diagnosis.medications;

            // Calculate overall diagnosis period
            const calculateDiagnosisPeriod = () => {
                if (!medications.length) return null;

                const startDates = medications.map(m => new Date(m.start_date));
                const endDates = medications.map(m => m.end_date ? new Date(m.end_date) : null);

                const validStartDates = startDates.filter(d => !isNaN(d.getTime()));
                const validEndDates = endDates.filter(d => d && !isNaN(d.getTime()));

                if (!validStartDates.length) return null;

                const minStartDate = new Date(Math.min(...validStartDates.map(d => d.getTime())));
                const maxEndDate = validEndDates.length
                    ? new Date(Math.max(...validEndDates.map(d => (d as Date).getTime())))
                    : null;

                const formatDate = (date: Date) => format(date, "MMM dd, yyyy");

                return {
                    start: formatDate(minStartDate),
                    end: maxEndDate ? formatDate(maxEndDate) : "Heden",
                    ongoing: !maxEndDate
                };
            };

            const diagnosisPeriod = calculateDiagnosisPeriod();


            return (
                <div className="flex flex-col gap-3">
                    {/* Diagnosis Period */}
                    {diagnosisPeriod && (
                        <div className="flex items-center gap-2 text-xs">
                            <span className="font-medium text-gray-700">Periode:</span>
                            <span className={cn(
                                "px-2 py-1 rounded-md",
                                diagnosisPeriod.ongoing
                                    ? "text-green-700 bg-green-50 border border-green-200"
                                    : "text-gray-700 bg-gray-50 border border-gray-200"
                            )}>
                                {diagnosisPeriod.start} → {diagnosisPeriod.end}
                            </span>
                            {diagnosisPeriod.ongoing && (
                                <span className="flex items-center gap-1 text-xs text-green-600">
                                    <AlertCircle className="h-3 w-3" />
                                    Actief
                                </span>
                            )}
                        </div>
                    )}
                </div>
            );
        }
    },
    {
        id: "actions",
        header: "Acties",
        cell: ({ row }) => <ActionsCell row={row} />
    }
];
const ActionsCell = ({ row }: { row: Row<Diagnosis>}) => {
    const router = useRouter();
    const diagnosis = row.original;
    const { } = useDiagnosis({ autoFetch: false, clientId: diagnosis.client_id });

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
                        onClick={() => router.push(`medical-record/${diagnosis.id}`)}
                        className="hover:bg-indigo-100 hover:text-indigo-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
                    >
                        <Eye className="h-4 w-4" />
                        <span className="text-sm font-medium">Bekijken</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => router.push(`medical-record/${diagnosis.id}/update`)}
                        className="hover:bg-indigo-100 hover:text-indigo-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
                    >
                        <Edit2 className="h-4 w-4" />
                        <span className="text-sm font-medium">Bewerken</span>
                    </DropdownMenuItem>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                            className="hover:bg-red-100 hover:text-red-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
                        >
                            <Trash className="h-4 w-4" />
                            <span className="text-sm font-medium">Verwijderen</span>
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
                        <span className="text-lg font-semibold">Diagnose verwijderen</span>
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        Weet u zeker dat u dit diagnose record wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="w-full grid grid-cols-2 gap-2 space-x-0">
                    <AlertDialogCancel className="w-full border-none ring-0 bg-indigo-200 px-2 py-1 text-indigo-500 hover:bg-indigo-400 hover:text-white transition-colors ml-0 space-x-0">
                        Annuleren
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            // Add your delete logic here
                        }}
                        className="w-full border-none ring-0 bg-red-200 px-2 py-1 text-red-500 hover:bg-red-500 hover:text-white transition-colors ml-0 space-x-0"
                    >
                        Verwijderen
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}