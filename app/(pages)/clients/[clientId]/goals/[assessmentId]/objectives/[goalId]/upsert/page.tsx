"use client";

import ObjectiveForm from "@/components/clients/goals/ObjectiveForm";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import IconButton from "@/components/common/Buttons/IconButton";
import { useGoal } from "@/hooks/goal/use-goal";
import { CreateObjective } from "@/types/goals.types";
import { Stars } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
const InitialValues: CreateObjective = {
  due_date: "",
  objective_description: "",
};
const GoalUpsertPage = () => {
  const { assessmentId, clientId, goalId } = useParams();
  const [initialValues] = useState<CreateObjective>(InitialValues);
  const { generateObjective } = useGoal({ autoFetch: false, assessmentId: +assessmentId!, clientId: +clientId! });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [objectives, setObjectives] = useState<CreateObjective[]>([]);
  const handleUpdate = (id: number, updated: CreateObjective) => {
    if (objectives[id]) {
      objectives[id] = updated;
      setObjectives([...objectives]);
    }
  };
  const handleDelete = (id: number) => {
    if (objectives[id]) {
      objectives.splice(id, 1);
      setObjectives([...objectives]);
    }
  }
  return (
    <div>
      <Breadcrumb pageName="Nieuw doelstelling" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center">
              <h3 className="font-medium text-slate-800  dark:text-white">
                Creëer een Nieuw doelstelling
              </h3>
              <IconButton
                disabled={loading}
                isLoading={loading}
                onClick={async () => {
                  try {
                    setLoading(true);
                    const objectives = await generateObjective(+goalId!, { displayProgress: true, displaySuccess: true });
                    setObjectives(objectives);
                  } catch (_error) {
                    setError("Er is een fout opgetreden bij het genereren van doelstellingen");
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <Stars size={24} />
              </IconButton>

            </div>
            {
              error && <div className="text-red-500 p-4">{error}</div>
            }
            <ObjectiveForm clientId={clientId as string} assessmentId={assessmentId as string} goalId={goalId as string} initialValues={initialValues} objectives={objectives} updateObjective={handleUpdate} deleteObjective={handleDelete} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoalUpsertPage