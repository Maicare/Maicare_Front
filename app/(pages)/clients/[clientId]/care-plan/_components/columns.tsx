import { Badge } from "@/components/ui/badge";
import { CarePlan } from "@/types/care-plan.types";
import { formatDateToDutch } from "@/utils/timeFormatting";
import { ColumnDef } from "@tanstack/table-core";
import { Activity, ArrowUpDown, Brain, Briefcase, CalendarCheck, CheckCircle2, Clock, HandCoins, HeartPulse, Home, Network, Scale, TrendingDown, TrendingUp, Users, Utensils, Wrench, XCircle } from "lucide-react";
import { JSX } from "react";
// Define the domain icons mapping
const domainIcons: Record<string, JSX.Element> = {
    "Financiën": <HandCoins className="h-5 w-5" />,
    "Werk & Opleiding": <Briefcase className="h-5 w-5" />,
    "Tijdsbesteding": <Clock className="h-5 w-5" />,
    "Huisvesting": <Home className="h-5 w-5" />,
    "Huishoudelijke Relaties": <Users className="h-5 w-5" />,
    "Geestelijke Gezondheid": <Brain className="h-5 w-5" />,
    "Lichamelijke Gezondheid": <HeartPulse className="h-5 w-5" />,
    "Middelengebruik": <Activity className="h-5 w-5" />,
    "Basale ADL": <Utensils className="h-5 w-5" />,
    "Instrumentele ADL": <Wrench className="h-5 w-5" />,
    "Sociaal Netwerk": <Network className="h-5 w-5" />,
    "Sociale Participatie": <CalendarCheck className="h-5 w-5" />,
    "Justitie": <Scale className="h-5 w-5" />,
};

// Define the level colors
const levelColors: Record<number, string> = {
    1: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    2: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
    3: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    4: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    5: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100",
};

export const columns: ColumnDef<CarePlan>[] = [
    {
        accessorKey: "topic_name",
        header: ({ column }) => {
            return (
                <button
                    className="flex items-center gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Domain
                    <ArrowUpDown className="h-4 w-4" />
                </button>
            );
        },
        cell: ({ row }) => {
            const domain = row.getValue("topic_name") as string;
            return (
                <div className="flex items-center gap-3 font-medium">
                    {domainIcons[domain] || <Activity className="h-5 w-5" />}
                    {domain}
                </div>
            );
        },
    },
    {
        accessorKey: "current_level",
        header: "Current Level",
        cell: ({ row }) => {
            const level = row.getValue("current_level") as number;
            const initialLevel = row.getValue("initial_level") as number;
            const improvement = level > initialLevel;

            return (
                <div className="flex items-center gap-3">
                    <Badge className={`${levelColors[level]} text-sm font-semibold`}>
                        Level {level}
                    </Badge>
                    {level !== initialLevel && (
                        improvement ? (
                            <TrendingUp className="h-5 w-5 text-green-500" />
                        ) : (
                            <TrendingDown className="h-5 w-5 text-red-500" />
                        )
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "initial_level",
        header: "Initial Level",
        cell: ({ row }) => {
            const level = row.getValue("initial_level") as number;
            return (
                <Badge className={`${levelColors[level]} text-sm font-semibold`}>
                    Level {level}
                </Badge>
            );
        },
    },
    {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ row }) => {
            const isActive = row.getValue("is_active") as boolean;
            return (
                <div className="flex items-center gap-2">
                    {isActive ? (
                        <>
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <span className="text-green-600 dark:text-green-400">Active</span>
                        </>
                    ) : (
                        <>
                            <XCircle className="h-5 w-5 text-red-500" />
                            <span className="text-red-600 dark:text-red-400">Inactive</span>
                        </>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "start_date",
        header: "Start Date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("start_date"));
            return formatDateToDutch(date,true) || "Not specified";
        },
    },
    {
        accessorKey: "end_date",
        header: "End Date",
        cell: ({ row }) => {
            const date = row.getValue("end_date")
                ? new Date(row.getValue("end_date"))
                : null;
            return date ? formatDateToDutch(date,true) : "Ongoing";
        },
    },
    
];