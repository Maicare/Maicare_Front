"use client";
import { Any } from '@/common/types/types';
import LinkButton from '@/components/common/Buttons/LinkButton';
import PaginatedTable from '@/components/common/PaginatedTable/PaginatedTable';
import Panel from '@/components/common/Panel/Panel';
import { useAssessment } from '@/hooks/assessment/use-assessment';
import { AssessmentResponse } from '@/types/assessment.types';
import { LEVEL_OPTIONS } from '@/types/maturity-matrix.types';
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
        cell: (info: Any) => LEVEL_OPTIONS.find(it => it.value === info.getValue().toString())?.label || "Niet Beschikbaar",
      },
      {
        accessorKey: "initial_level",
        header: () => "Initial Level",
        cell: (info: Any) => LEVEL_OPTIONS.find(it => it.value === info.getValue().toString())?.label || "Niet Beschikbaar",
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