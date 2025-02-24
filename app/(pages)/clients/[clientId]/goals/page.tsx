"use client";
import { Any } from '@/common/types/types';
import LinkButton from '@/components/common/Buttons/LinkButton';
import PaginatedTable from '@/components/common/PaginatedTable/PaginatedTable';
import Panel from '@/components/common/Panel/Panel';
import { useAssessment } from '@/hooks/assessment/use-assessment';
import { AssessmentResponse } from '@/types/assessment.types';
import { LEVEL_OPTIONS } from '@/types/maturity-matrix.types';
import { cn } from '@/utils/cn';
import { fullDateFormat } from '@/utils/timeFormatting';
import { ColumnDef } from '@tanstack/table-core';
import { CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react'

const GoalPage = () => {
  const { clientId } = useParams();
  const [page, setPage] = useState<number>(1);
  const { assessments, isLoading, error } = useAssessment({ autoFetch: true, clientId: parseInt(clientId as string), page, page_size: 10 });
  const router = useRouter();
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
  const columnDef = useMemo<ColumnDef<AssessmentResponse>[]>(() => {
    return [
      {
        accessorKey: "topic_name",
        header: () => "Domein",
        cell: (info) => info.getValue() || "",
      },
      {
        accessorKey: "start_date",
        header: () => "Start Date",
        cell: (info: Any) => fullDateFormat(info.getValue() as string) || "Niet Beschikbaar",
      },
      {
        accessorKey: "current_level",
        header: () => "Current Level",
        cell: (info: Any) =>{ 
          const level = info.getValue() as number;
          const classes = getTailwindClasses(level);
          return (
          <span className={cn("p-2",classes)}>{LEVEL_OPTIONS.find(it => it.value === info.getValue().toString())?.label || "Niet Beschikbaar"}</span>
        )
        },
      },
      {
        accessorKey: "initial_level",
        header: () => "Initial Level",
        cell: (info: Any) =>{ 
          const level = info.getValue() as number;
          const classes = getTailwindClasses(level);
          return (
          <span className={cn(classes)}>{LEVEL_OPTIONS.find(it => it.value === info.getValue().toString())?.label || "Niet Beschikbaar"}</span>
        )
        },
      },
      {
        accessorKey: "end_date",
        header: () => "End Date",
        cell: (info: Any) => fullDateFormat(info.getValue() as string) || "Niet Beschikbaar",
      },
      {
        accessorKey: "is_active",
        header: "Active",
        cell: (info) => {
          if (info.getValue() === false) {
            return (
              <XCircleIcon className="text-red-500 w-8 h-8" />
            )
          }
          return (
            <CheckCircleIcon className="text-green-500 w-8 h-8" />
          )
        }
      },
    ];
  }, []);

  const handleRowClick = (assessment: AssessmentResponse) => {
    router.push(`goals/${assessment.id}`);
  };
  return (
    <>
      {/* <ConfirmationModal
        title="Bevestiging Verwijderen"
        message="Weet u zeker dat u dit document wilt verwijderen?"
        buttonMessage="Verwijderen"
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        isLoading={deleting}
        action={() => {
          onSubmit();
        }}
      /> */}

      <Panel
        title={`Doelen`}
        sideActions={
          <LinkButton
            text={"Nieuw Doelen"}
            href={`/clients/${clientId}/goals/new`}
          />
        }
      >
        {assessments && assessments.results && (
          <PaginatedTable
            onRowClick={handleRowClick}
            data={assessments}
            columns={columnDef}
            page={page ?? 1}
            isFetching={isLoading}
            onPageChange={(page) => setPage(page)}
          />
        )}
        {error && (
          <p role="alert" className="text-red-600">
            Er is een fout opgetreden.
          </p>
        )}
      </Panel>
    </>
  );
}

export default GoalPage