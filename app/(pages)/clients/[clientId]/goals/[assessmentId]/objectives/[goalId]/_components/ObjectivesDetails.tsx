"use client";

import LargeErrorMessage from "@/components/common/Alerts/LargeErrorMessage";
import Loader from "@/components/common/loader";
import { DataTable } from "@/components/employee/table/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGoal } from "@/hooks/goal/use-goal";
import {  SquareCheck } from "lucide-react";
import { Row } from "@tanstack/table-core";
import { GoalWithObjectives } from "@/types/goals.types";
import { useState, useEffect } from "react";
import { getColumns, ObjectiveRow } from "./columns";
import UpsertObjectiveSheet, { CreateObjectiveForm } from "./UpsertObjectiveSheet";

const ObjectivesDetails = ({
  assessmentId,
  clientId,
  goalId,
}: {
  clientId: string;
  assessmentId: string;
  goalId: string;
}) => {

  const { readOne, createObjective } = useGoal({
    autoFetch: false,
    clientId: parseInt(clientId),
    assessmentId: parseInt(assessmentId),
  });

  const [objectives, setObjectives] = useState<ObjectiveRow[]>([]);
  const [loadingObjs, setLoadingObjs] = useState(true);
  const [errorObjs, setErrorObjs] = useState<Error | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!goalId) return;
    setLoadingObjs(true);

    async function fetchObjectives() {
      try {
        const data: GoalWithObjectives = await readOne(parseInt(goalId));
        if (data.objectives) {
          const sorted = data.objectives
            .slice()
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            );
          setObjectives(sorted);
        }
      } catch (err) {
        setErrorObjs(err as Error);
      } finally {
        setLoadingObjs(false);
      }
    }

    fetchObjectives();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalId]);

  const handleRowClick = (_row: Row<ObjectiveRow>) => {
    // router.push(
    //   `/clients/${clientId}/goals/${assessmentId}/objectives/${row.original.id}`
    // );
  };

  const handleCreate = async (values: CreateObjectiveForm) => {
    try {
      await createObjective(+goalId!, [{...values,due_date:values.due_date.toISOString().split("T")[0]}], { displayProgress: true, displaySuccess: true });
    } catch (error) {
      console.error({ error });
    }
  };

  const handleEdit = (obj: ObjectiveRow) => {
    console.log("edit", obj);
  };
  const handleDelete = (id: number) => {
    console.log("delete", id);
  };

  return (
    <Card className="bg-transparent border-none shadow-none rounded-md p-0">
      <CardHeader className="flex flex-row items-center justify-between p-0 pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <SquareCheck className="text-indigo-400" />
          Goal&apos;s Objectives
        </CardTitle>
        <div className="flex gap-2">
          <UpsertObjectiveSheet
            isOpen={open}
            handleCreate={handleCreate}
            handleOpen={setOpen}
            handleUpdate={() => { }}
            handleGenerate={() => { }}
            mode="create"
          />
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 p-0">
        {loadingObjs ? (
          <div className="flex items-center justify-center w-full h-full">
            <Loader />
          </div>
        ) : errorObjs ? (
          <div className="flex items-center justify-center w-full h-full">
            <LargeErrorMessage
              firstLine="Ops! Error occurred"
              secondLine={errorObjs.message}
            />
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 gap-4">
            <DataTable
              columns={getColumns(handleEdit, handleDelete)}
              data={objectives}
              onRowClick={handleRowClick}
              className="dark:bg-[#18181b] dark:border-black"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ObjectivesDetails;
