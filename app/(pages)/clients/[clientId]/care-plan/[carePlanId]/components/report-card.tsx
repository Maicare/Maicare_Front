"use client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import {
    AlertTriangle,
    Trophy,
    TrendingUp,
    Edit as EditIcon,
    User,
    Calendar,
    Trash2,
    Pencil,
    MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PrimaryButton from "@/common/components/PrimaryButton";
import { useParams } from "next/navigation";
import { useCarePlan } from "@/hooks/care-plan/use-care-plan";
import { useState } from "react";
import { CreateReport } from "@/schemas/plan-care.schema";
import UpsertReportSheet from "./upsert-report-sheet";

type Report = {
    care_plan_id: number;
    created_at: string;
    created_by_first_name: string;
    created_by_last_name: string;
    id: number;
    is_critical: boolean;
    report_content: string;
    report_type: 'progress' | 'concern' | 'achievement' | 'modification';
};

export function ReportCard({ report }: { report: Report }) {
    const cardStyles = {
        progress: {
            bg: "bg-blue-50 dark:bg-blue-900/30",
            border: "border-blue-200 dark:border-blue-800",
            icon: <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
            badge: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        },
        concern: {
            bg: "bg-rose-50 dark:bg-rose-900/30",
            border: "border-rose-200 dark:border-rose-800",
            icon: <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />,
            badge: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
        },
        achievement: {
            bg: "bg-emerald-50 dark:bg-emerald-900/30",
            border: "border-emerald-200 dark:border-emerald-800",
            icon: <Trophy className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
            badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
        },
        modification: {
            bg: "bg-amber-50 dark:bg-amber-900/30",
            border: "border-amber-200 dark:border-amber-800",
            icon: <EditIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
            badge: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
        },
    };

    const styles = cardStyles[report.report_type];
    const { carePlanId } = useParams();

    const { updateReport, deleteReport } = useCarePlan({
        carePlanId: carePlanId as string
    });
    const [openId, setOpenId] = useState<number | null>(null);

    const handleUpdateReport = async (values: CreateReport, id: number) => {
        try {
            await updateReport(values, id, {
                displayProgress: true,
                displaySuccess: true,
            });
            setOpenId(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteReport = async (id: number) => {
        try {
            await deleteReport(id, {
                displayProgress: true,
                displaySuccess: true,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={cn(
            "rounded-lg border p-4 shadow-sm transition-all hover:shadow-md relative group flex flex-col gap-2",
            styles.bg,
            styles.border
        )}>
            {/* Action buttons - appear on hover */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <UpsertReportSheet
                    mode="update"
                    handleUpdate={handleUpdateReport}
                    report={report}
                    isOpen={openId === report.id}
                    handleOpen={(o) => setOpenId(o ? report.id : null)}
                    objectiveId={report.id} // Assuming you need to pass the report ID as objectiveId
                />
                <PrimaryButton
                    text=""
                    onClick={()=>handleDeleteReport(report.id)}
                    icon={Trash2}
                    className="bg-red-500 text-white hover:bg-red-600"
                    animation="animate-bounce"
                />
            </div>

            <div className="flex items-center gap-3 pr-8">
                <div className="self-start rounded-full p-2 bg-white dark:bg-gray-800 shadow-sm">
                    {styles.icon}
                </div>

                <div className="flex-1 w-full">
                    <div className="flex items-center gap-2">
                        <h3 className="font-medium capitalize truncate">
                            {report.report_type}
                        </h3>
                        {report.is_critical && (
                            <Badge className={cn(
                                "text-xs font-normal",
                                "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200 hover:bg-rose-200 dark:hover:bg-rose-800",
                            )}>
                                Critical
                            </Badge>
                        )}
                    </div>

                    <p className="text-sm text-muted-foreground mt-4">
                        {report.report_content}
                    </p>
                </div>
            </div>

            <div className="mt-auto flex items-end justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">
                        {report.created_by_first_name} {report.created_by_last_name}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span>
                        {new Date(report.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                </div>
            </div>
        </div>
    );
}