import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useI18n } from '@/lib/i18n/client';
import { AutomaticReportItem } from '@/types/automatic-report.types'
import { formatDateToDutch } from '@/utils/timeFormatting';
import { AlarmClock, AlertTriangle, Edit2, MoreVertical, Sparkle, Trash } from 'lucide-react'
import React from 'react'

type Props = {
    automaticReport: AutomaticReportItem;
    index: number;
}

const AutomaticReport = ({ automaticReport, index }: Props) => {
    const t = useI18n();
    return (
        <div className={
            "w-full rounded-lg relative bg-white mt-7 shadow-md px-4 py-3 pt-8 flex flex-col justify-between"}>
            <div className="">
                {/* Icon with dynamic color */}
                <div className={"w-14 h-14 flex items-center justify-center rounded-full absolute -top-7 left-7 translate-x-1/4 shadow-md bg-indigo-500 shadow-indigo-400"}>
                    <Sparkle className="w-9 h-9 text-white" />
                </div>

                {/* Header with date */}
                <div className="flex items-center justify-between">
                    <h1 className="text-base mt-2 flex items-center gap-1 font-medium p-1 border-b-2 border-cyan-400 text-cyan-500">Rapporten {index + 1}</h1>
                    <AlertDialog>
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white">
                                <DropdownMenuLabel>{t("common.actions")}</DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={() => { }}
                                    className="hover:bg-indigo-100 hover:text-indigo-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
                                >
                                    <Edit2 className="h-4 w-4" />
                                    <span className="text-sm font-medium">{t("common.edit")}</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <AlertDialogTrigger asChild>

                                    <DropdownMenuItem
                                        className="bg-red-100 hover:bg-red-200 hover:text-red-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
                                    >
                                        <Trash className="h-4 w-4" />
                                        <span className="text-sm font-medium">{t("common.delete")}</span>
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
                                    <span className="text-lg font-semibold">{t("clients.reports.deleteReport")}</span>
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-center">
                                    {t("clients.reports.deleteMessage")}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="w-full grid grid-cols-2 gap-2 space-x-0">
                                <AlertDialogCancel className="w-full border-none ring-0 bg-indigo-200 px-2 py-1 text-indigo-500 hover:bg-indigo-400 hover:text-white transition-colors ml-0 space-x-0">Annuleren</AlertDialogCancel>
                                <AlertDialogAction onClick={() => { }} className="w-full border-none ring-0 bg-red-200 px-2 py-1 text-red-500 hover:bg-red-500 hover:text-white transition-colors ml-0 space-x-0">Bevestigen</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

                {/* Content */}
                <p className="mt-4 text-sm">{automaticReport.report_text}</p>

            </div>
            <div className="">
                <Separator className="my-2" />

                {/* Footer with author and emotional state */}
                <div className="flex items-center w-full justify-between">
                    <span className={"flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md border bg-green-100 border-green-400 text-green-500"}>
                        <AlarmClock className="h-4 w-4" />
                        <span>{formatDateToDutch(automaticReport.start_date, true)}</span>
                    </span>
                    <span className={"flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md border bg-yellow-100 border-yellow-400 text-yellow-500"}>
                        <AlarmClock className="h-4 w-4" />
                        <span>{formatDateToDutch(automaticReport.end_date, true)}</span>
                    </span>

                </div>
            </div>
        </div>
    )
}

export default AutomaticReport