import { Any } from "@/common/types/types";
import LinkButton from "@/components/common/Buttons/LinkButton";
import PaginatedTable from "@/components/common/PaginatedTable/PaginatedTable";
import Panel from "@/components/common/Panel/Panel";
import { useGoal } from "@/hooks/goal/use-goal";
import { Goal } from "@/types/goals.types";
import { LEVEL_OPTIONS } from "@/types/maturity-matrix.types";
import { cn } from "@/utils/cn";
import { fullDateFormat } from "@/utils/timeFormatting";
import { ColumnDef } from "@tanstack/table-core";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";


const AssessmentGoals = ({ assessmentId, clientId }: { assessmentId: string, clientId: string }) => {
    const [page, setPage] = useState<number>(1);
    const { goals, isLoading, error } = useGoal({ autoFetch: true, clientId: parseInt(clientId), assessmentId: parseInt(assessmentId), page, page_size: 10 });
    const getTailwindClasses = (level: number) => {
        switch (level) {
          case 1:
            return "bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300";
          case 2:
            return "bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-yellow-900 dark:text-yellow-300";
          case 3:
            return "bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300";
          case 4:
            return "bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-blue-900 dark:text-blue-300";
          case 5:
            return "bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-purple-900 dark:text-purple-300";
          default:
            return "bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300";
        }
      };
    const columnDef = useMemo<ColumnDef<Goal>[]>(() => {
        return [
            {
                accessorKey: "description",
                header: () => "Description",
                cell: (info) => (info.getValue() as string ?? "").split(' ').slice(0, 5).join(' ') + " ..." || "",
            },
            {
                accessorKey: "start_date",
                header: () => "Start Date",
                cell: (info: Any) => fullDateFormat(info.getValue() as string) || "Niet Beschikbaar",
            },
            {
                accessorKey: "target_level",
                header: () => "Target Level",
                cell: (info: Any) => {
                    const level = info.getValue() as number;
                    const classes = getTailwindClasses(level);
                    return (
                        <span className={cn(classes)}>{LEVEL_OPTIONS.find(it => it.value === info.getValue().toString())?.label || "Niet Beschikbaar"}</span>
                    )
                },
            },
            {
                accessorKey: "completion_date",
                header: () => "Completion Date",
                cell: (info: Any) => fullDateFormat(info.getValue() as string) || "Niet Beschikbaar",
            },
            {
                accessorKey: "target_date",
                header: () => "Target Date",
                cell: (info: Any) => fullDateFormat(info.getValue() as string) || "Niet Beschikbaar",
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: (info) => info.getValue() || "",
            },
        ];
    }, []);
    const router = useRouter();

    return (
        <Panel
            title={`Doelen`}
            className="mt-4"
            sideActions={
                <LinkButton
                    text={"Nieuw Doelen"}
                    href={`/clients/${clientId}/goals/new`}
                />
            }
        >
            {goals && goals.results && (
                <PaginatedTable
                    data={goals}
                    columns={columnDef}
                    page={page ?? 1}
                    isFetching={isLoading}
                    onPageChange={(page) => setPage(page)}
                    onRowClick={(goal) => { router.push(`/clients/${clientId}/goals/${assessmentId}/objectives/${goal.id}`) }}
                />
            )}
            {error && (
                <p role="alert" className="text-red-600">
                    Er is een fout opgetreden.
                </p>
            )}
        </Panel>
    )
}

export default AssessmentGoals