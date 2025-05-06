"use client";

import LargeErrorMessage from "@/components/common/Alerts/LargeErrorMessage";
import Loader from "@/components/common/loader";
import { DataTable } from "@/components/employee/table/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGoal } from "@/hooks/goal/use-goal";
import { ArrowBigLeft, ArrowBigRight, SquareCheck } from "lucide-react";
import PrimaryButton from "@/common/components/PrimaryButton";
import { Row } from "@tanstack/table-core";
import { GoalWithObjectives, CreateObjective, Goal } from "@/types/goals.types";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { CreateGoal } from "@/schemas/goal.schema";
import UpsertGoalSheet from "../../../_components/UpsertGoalSheet";
import { getColumns, ObjectiveRow } from "./columns";

const ObjectivesDetails = ({
  assessmentId,
  clientId,
  goalId,
}: {
  clientId: string;
  assessmentId: string;
  goalId: string;
}) => {
  const router = useRouter();

  const { readOne, createObjective } = useGoal({
    autoFetch: false,
    clientId: parseInt(clientId),
    assessmentId: parseInt(assessmentId),
  });

  const [objectives, setObjectives] = useState<CreateObjective[]>([]);
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
  }, [goalId]);

  const handleRowClick = (row: Row<Goal>) => {
    // router.push(
    //   `/clients/${clientId}/goals/${assessmentId}/objectives/${row.original.id}`
    // );
  };

  const handleCreate = async (values: CreateGoal) => {
    try {
      const dateOnly = values.target_date.toISOString().split("T")[0];
      const objPayload: CreateObjective = {
        due_date: dateOnly,
        objective_description: values.description,
      };
      await createObjective(parseInt(goalId as string), [objPayload], {
        displayProgress: true,
        displaySuccess: true,
      });
      const updated = await readOne(parseInt(goalId as string));
      // sort again after create
      const sorted = [...updated.objectives].sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      );
      setObjectives(sorted);
    } catch (err) {
      console.log(err);
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
          Goal's Objectives
        </CardTitle>
        <div className="flex gap-2">
          <UpsertGoalSheet
            isOpen={open}
            handleCreate={handleCreate}
            handleOpen={setOpen}
            handleUpdate={() => { }}
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
