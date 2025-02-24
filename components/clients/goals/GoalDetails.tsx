import IconButton from "@/components/common/Buttons/IconButton";
import Loader from "@/components/common/loader";
import Panel from "@/components/common/Panel/Panel";
import PencilSquare from "@/components/icons/PencilSquare";
import { useGoal } from "@/hooks/goal/use-goal";
import { GoalWithObjectives } from "@/types/goals.types";
import { LEVEL_OPTIONS } from "@/types/maturity-matrix.types";
import { cn, getTailwindClasses } from "@/utils/cn";
import { dateFormat } from "@/utils/timeFormatting";
import { TrashIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";


const GoalDetails = ({ assessmentId, clientId, goalId }: { assessmentId: string, clientId: string, goalId: string }) => {
    const { readOne } = useGoal({ autoFetch: false, clientId: parseInt(clientId), assessmentId: parseInt(assessmentId) });
    const [goal, setGoal] = useState<GoalWithObjectives | null>(null);
    useEffect(() => {
        const fetchGoal = async (id: number) => {
            const data = await readOne(id);
            setGoal(data);
        };
        if (goalId) fetchGoal(+goalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [goalId]);
    if (!goal) return <Loader />;
    return (
        <>
            <Panel
                title="Goal Details"
                containerClassName="px-7 py-4"
                sideActions={
                    <div className="flex gap-4">
                        <Link href={`/clients/${clientId}/goals/${assessmentId}/objectives/${goalId}/edit`}>
                            <IconButton>
                                <PencilSquare className="w-5 h-5" />
                            </IconButton>
                        </Link>
                        <IconButton
                            buttonType="Danger"
                            onClick={() => { }}
                            disabled={false}
                            isLoading={false}
                        >
                            <TrashIcon className="w-5 h-5" />
                        </IconButton>
                    </div>
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="w-full">
                        <p className="">Target Level</p>
                        <div className="border-2 border-gray-300 rounded-md p-2 text-graydark">
                            <span className={cn(getTailwindClasses(goal.target_level))}>{LEVEL_OPTIONS.find(it => it.value === goal.target_level.toString())?.label || "Niet Beschikbaar"}</span>
                        </div>
                    </div>
                    <div className="w-full">
                        <p className="">Creation Date</p>
                        <div className="border-2 border-gray-300 rounded-md p-2 text-graydark">
                            {dateFormat(goal.created_at) || "Niet Beschikbaar"}
                        </div>
                    </div>
                    <div className="w-full">
                        <p className="">Start Date</p>
                        <div className="border-2 border-gray-300 rounded-md p-2 text-graydark">
                            {dateFormat(goal.start_date) || "Niet Beschikbaar"}
                        </div>
                    </div>
                    <div className="w-full">
                        <p className="">Status</p>
                        <div className="border-2 border-gray-300 rounded-md p-2 text-graydark">
                            {goal.status ? "Active" : "Inactive"}
                        </div>
                    </div>
                    <div className="w-full">
                        <p className="">Target Date</p>
                        <div className="border-2 border-gray-300 rounded-md p-2 text-graydark">
                            {dateFormat(goal.target_date) || "Niet Beschikbaar"}
                        </div>
                    </div>
                    <div className="w-full">
                        <p className="">Completion Date</p>
                        <div className="border-2 border-gray-300 rounded-md p-2 text-graydark">
                            {dateFormat(goal.completion_date) || "Niet Beschikbaar"}
                        </div>
                    </div>
                </div>
                <div className="w-full mt-4">
                    <p className="">Description</p>
                    <div className="border-2 border-gray-300 rounded-md p-2 text-graydark">
                        {goal.description || "Niet Beschikbaar"}
                    </div>
                </div>
            </Panel>
            <Panel title={"Objectives"} className="mt-4 px-7 py-4">
                <div className="grid grid-cols-1 gap-4">
                    {goal.objectives.map((objective, index) => (
                        <Panel
                            title={`Objective ${index + 1}`}
                            key={index}
                            className={cn("px-7 py-4 mt-4")}
                            sideActions={
                                <div className="flex gap-4">
                                    <Link href={`/clients/${clientId}/goals/${assessmentId}/objectives/${goalId}/objective/${objective.id}/edit`}>
                                        <IconButton>
                                            <PencilSquare className="w-5 h-5" />
                                        </IconButton>
                                    </Link>
                                    <IconButton
                                        buttonType="Danger"
                                        onClick={() => { }}
                                        disabled={false}
                                        isLoading={false}
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </IconButton>
                                </div>
                            }
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="w-full">
                                    <p className="">Due Date</p>
                                    <div className="border-2 border-gray-300 rounded-md p-2 text-graydark">
                                        {dateFormat(objective.due_date) || "Niet Beschikbaar"}
                                    </div>
                                </div>
                                <div className="w-full">
                                    <p className="">Completion Date</p>
                                    <div className="border-2 border-gray-300 rounded-md p-2 text-graydark">
                                        {dateFormat(objective.completion_date) || "Niet Beschikbaar"}
                                    </div>
                                </div>
                                <div className="w-full">
                                    <p className="">Status</p>
                                    <div className="border-2 border-gray-300 rounded-md p-2 text-graydark">
                                        {objective.status ? "Active" : "Inactive"}
                                    </div>
                                </div>
                            </div>
                            <div className="w-full">
                                <p className="">Description</p>
                                <div className="border-2 border-gray-300 rounded-md p-2 text-graydark">
                                    {objective.objective_description || "Niet Beschikbaar"}
                                </div>
                            </div>
                        </Panel>
                    ))}
                </div>
            </Panel>
        </>
    );
}

export default GoalDetails