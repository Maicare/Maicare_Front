import { Any } from "@/common/types/types";
import LinkButton from "@/components/common/Buttons/LinkButton";
import PaginatedTable from "@/components/common/PaginatedTable/PaginatedTable";
import Panel from "@/components/common/Panel/Panel";
import { useGoal } from "@/hooks/goal/use-goal";
import { Goal } from "@/types/goals.types";
import { LEVEL_OPTIONS } from "@/types/maturity-matrix.types";
import { cn, getTailwindClasses } from "@/utils/cn";
import { fullDateFormat } from "@/utils/timeFormatting";
import { ColumnDef } from "@tanstack/table-core";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";


const AssessmentGoals = ({ assessmentId, clientId }: { assessmentId: string, clientId: string }) => {
    const [page, setPage] = useState<number>(1);
    const { goals, isLoading, error } = useGoal({ autoFetch: true, clientId: parseInt(clientId), assessmentId: parseInt(assessmentId), page, page_size: 10 });
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