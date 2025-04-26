"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { EMOTIONAL_STATE_OPTIONS, REPORT_TYPE_RECORD } from "@/types/reports.types";
import { cn } from "@/utils/cn";
import {
    AlarmClock,
    Sun,
    Moon,
    Sunset,
    Clock,
    Users,
    ClipboardList,
    BookOpen,
    HelpCircle,
    LucideIcon,
    Edit2,
    Trash,
    AlertTriangle,
    MoreVertical
} from "lucide-react";



// 2. Report type icons (unchanged)
export const REPORT_TYPE_ICONS: Record<keyof typeof REPORT_TYPE_RECORD, LucideIcon> = {
    morning_report: Sun,
    evening_report: Sunset,
    night_report: Moon,
    shift_report: Clock,
    one_to_one_report: Users,
    process_report: ClipboardList,
    contact_journal: BookOpen,
    other: HelpCircle
};



type ColorKey = "orange" | "blue" | "purple" | "indigo" | "green" | "teal" | "cyan" | "gray" | "yellow" | "red";

// Then define COLOR_CLASSES with all needed colors
const COLOR_CLASSES: Record<ColorKey, {
    bg: string;
    shadow: string;
    text: string;
    bgLight: string;
    border: string;
    bgFallback: string;
}> = {
    orange: {
        bg: 'bg-orange-300',
        shadow: 'shadow-orange-300',
        text: 'text-orange-700',
        bgLight: 'bg-orange-50',
        border: 'border-orange-200',
        bgFallback: 'bg-orange-500'
    },
    blue: {
        bg: 'bg-blue-300',
        shadow: 'shadow-blue-300',
        text: 'text-blue-700',
        bgLight: 'bg-blue-50',
        border: 'border-blue-200',
        bgFallback: 'bg-blue-500'
    },
    purple: {
        bg: 'bg-purple-300',
        shadow: 'shadow-purple-300',
        text: 'text-purple-700',
        bgLight: 'bg-purple-50',
        border: 'border-purple-200',
        bgFallback: 'bg-purple-500'
    },
    indigo: {
        bg: 'bg-indigo-300',
        shadow: 'shadow-indigo-300',
        text: 'text-indigo-700',
        bgLight: 'bg-indigo-50',
        border: 'border-indigo-200',
        bgFallback: 'bg-indigo-500'
    },
    green: {
        bg: 'bg-green-300',
        shadow: 'shadow-green-300',
        text: 'text-green-700',
        bgLight: 'bg-green-50',
        border: 'border-green-200',
        bgFallback: 'bg-green-500'
    },
    teal: {
        bg: 'bg-teal-300',
        shadow: 'shadow-teal-300',
        text: 'text-teal-700',
        bgLight: 'bg-teal-50',
        border: 'border-teal-200',
        bgFallback: 'bg-teal-500'
    },
    cyan: {
        bg: 'bg-cyan-300',
        shadow: 'shadow-cyan-300',
        text: 'text-cyan-700',
        bgLight: 'bg-cyan-50',
        border: 'border-cyan-200',
        bgFallback: 'bg-cyan-500'
    },
    gray: {
        bg: 'bg-gray-300',
        shadow: 'shadow-gray-300',
        text: 'text-gray-700',
        bgLight: 'bg-gray-50',
        border: 'border-gray-200',
        bgFallback: 'bg-gray-500'
    },
    yellow: {
        bg: 'bg-yellow-300',
        shadow: 'shadow-yellow-300',
        text: 'text-yellow-700',
        bgLight: 'bg-yellow-50',
        border: 'border-yellow-200',
        bgFallback: 'bg-yellow-500'
    },
    red: {
        bg: 'bg-red-300',
        shadow: 'shadow-red-300',
        text: 'text-red-700',
        bgLight: 'bg-red-50',
        border: 'border-red-200',
        bgFallback: 'bg-red-500'
    }
};

// Now update your mappings to use ColorKey
const EMOTIONAL_STATE_COLORS: Record<
    typeof EMOTIONAL_STATE_OPTIONS[number]['value'],
    ColorKey
> = {
    excited: "green",
    happy: "teal",
    sad: "blue",
    normal: "gray",
    anxious: "yellow",
    depressed: "indigo",
    angry: "red"
};

const REPORT_TYPE_COLORS: Record<keyof typeof REPORT_TYPE_RECORD, ColorKey> = {
    morning_report: "orange",
    evening_report: "purple",
    night_report: "indigo",
    shift_report: "green",
    one_to_one_report: "teal",
    process_report: "cyan",
    contact_journal: "blue",
    other: "gray"
};

type ReportType = keyof typeof REPORT_TYPE_RECORD;
type EmotionalState = typeof EMOTIONAL_STATE_OPTIONS[number]['value'];

type Props = {
    reportType: ReportType;
    createdAt: Date;
    content: string;
    author: {
        name: string;
        avatar?: string;
    };
    emotionalState?: EmotionalState;
    className?: string;
    handleDelete: () => void;
    handleUpdate: () => void;
};

const ReportCard = ({
    reportType,
    createdAt,
    content,
    author,
    emotionalState,
    className,
    handleDelete,
    handleUpdate
}: Props) => {
    // Get the appropriate color scheme
    const baseColor = REPORT_TYPE_COLORS[reportType];
    const emotionColor = emotionalState ? EMOTIONAL_STATE_COLORS[emotionalState] : null;
    const activeColor = emotionColor || baseColor;
    const colors = COLOR_CLASSES[activeColor];

    // Get related data
    const Icon = REPORT_TYPE_ICONS[reportType];
    const reportLabel = REPORT_TYPE_RECORD[reportType];
    const emotionalStateLabel = EMOTIONAL_STATE_OPTIONS.find(
        state => state.value === emotionalState
    )?.label;

    // Format date
    const formattedDate = new Intl.DateTimeFormat('nl-NL', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(createdAt);

    return (
        <div className={cn(
            "w-full rounded-lg relative bg-white mt-7 shadow-md px-4 py-3 pt-8 flex flex-col justify-between",
            className
        )}>
            <div className="">
                {/* Icon with dynamic color */}
                <div className={cn(
                    "w-14 h-14 flex items-center justify-center rounded-full absolute -top-7 left-7 translate-x-1/4 shadow-md",
                    colors.bg,
                    colors.shadow
                )}>
                    <Icon className="w-9 h-9 text-white" />
                </div>

                {/* Header with date */}
                <div className="flex items-center justify-between">
                    <h1 className="text-lg">{reportLabel}</h1>
                    <span className={cn(
                        "flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md border",
                        colors.text,
                        colors.bgLight,
                        colors.border
                    )}>
                        <AlarmClock className="h-4 w-4" />
                        <span>{formattedDate}</span>
                    </span>
                </div>

                {/* Content */}
                <p className="mt-4 text-sm">{content}</p>

            </div>
            <div className="">
                <Separator className="my-2" />

                {/* Footer with author and emotional state */}
                <div className="flex items-center gap-2 w-full">
                    <div className="flex items-center justify-between w-full" >
                        <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={author.avatar} alt={author.name} />
                                <AvatarFallback className={colors.bgFallback}>
                                    {author.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{author.name}</span>
                        </div>

                        {emotionalState && (
                            <span className={cn(
                                "flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md border",
                                colors.text,
                                colors.bgLight,
                                colors.border
                            )}>
                                <span>{emotionalStateLabel}</span>
                            </span>
                        )}
                    </div>
                    <AlertDialog>
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white">
                                <DropdownMenuLabel>Acties</DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={handleUpdate}
                                    className="hover:bg-indigo-100 hover:text-indigo-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
                                >
                                    <Edit2 className="h-4 w-4" />
                                    <span className="text-sm font-medium">Bewerken</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <AlertDialogTrigger asChild>

                                    <DropdownMenuItem
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
                                    <span className="text-lg font-semibold">Rapport verwijderen</span>
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-center">
                                    Weet u zeker dat u dit rapport wilt verwijderen?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="w-full grid grid-cols-2 gap-2 space-x-0">
                                <AlertDialogCancel className="w-full border-none ring-0 bg-indigo-200 px-2 py-1 text-indigo-500 hover:bg-indigo-400 hover:text-white transition-colors ml-0 space-x-0">Annuleren</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="w-full border-none ring-0 bg-red-200 px-2 py-1 text-red-500 hover:bg-red-500 hover:text-white transition-colors ml-0 space-x-0">Bevestigen</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div>
    );
};

export default ReportCard;