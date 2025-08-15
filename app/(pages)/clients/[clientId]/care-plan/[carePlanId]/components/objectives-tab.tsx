"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCarePlan } from '@/hooks/care-plan/use-care-plan';
import {  Objective, ObjectiveAction, ObjectiveTermGoal } from '@/types/care-plan.types';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Hourglass, Trash2 } from 'lucide-react';
import UpsertObjectiveSheet from './upsert-objective-sheet';
import { useState } from 'react';
import { Id } from '@/common/types/types';
import { CreateAction, CreateObjective } from '@/schemas/plan-care.schema';
import PrimaryButton from '@/common/components/PrimaryButton';
import UpsertActionSheet from './upsert-action-sheet';

const statusColors = {
    "not_started": "bg-gray-100 text-gray-700 border-gray-300",
    "in_progress": "bg-blue-100 text-blue-700 border-blue-300",
    "completed": "bg-green-100 text-green-700 border-green-300",
    "draft": "bg-yellow-100 text-yellow-700 border-yellow-300"
};

const termColors = {
    shortTerm: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800'
    },
    mediumTerm: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-800'
    },
    longTerm: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800'
    }
};

const ObjectivesTab = () => {
    const { goalId } = useParams();
    const { data: objectives,createObjective,updateObjective,deleteObjective,createAction,updateAction,deleteAction } = useCarePlan({
        objectives: true,
        carePlanId: goalId as string
    });

    const [openId, setOpenId] = useState<Id | null>(null);

    const handleCreate = async (values: CreateObjective) => {
        try {
            await createObjective(values, {
                displayProgress: true,
                displaySuccess: true,
            });
            setOpenId(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = async (values: CreateObjective, id: Id) => {
        try {
            await updateObjective(values, id, {
                displayProgress: true,
                displaySuccess: true,
            });
            setOpenId(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: Id) => {
        try {
            await deleteObjective(id, {
                displayProgress: true,
                displaySuccess: true,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateAction = async (values: CreateAction, objectiveId: Id) => {
        try {
            console.log("creating action for objectiveId:", objectiveId);
            console.log("values:", values);
            await createAction(values, objectiveId, {
                displayProgress: true,
                displaySuccess: true,
            });
            setOpenId(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateAction = async (values: CreateAction, actionId: Id) => {
        try {
            await updateAction(values, actionId, {
                displayProgress: true,
                displaySuccess: true,
            });
            setOpenId(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteAction = async (actionId: Id) => {
        try {
            await deleteAction(actionId, {
                displayProgress: true,
                displaySuccess: true,
            });
        } catch (error) {
            console.error(error);
        }
    };

    type Group =
    | { key: 'shortTerm'; label: string; color: string; data: ObjectiveTermGoal[], term: 'short_term' }
    | { key: 'mediumTerm'; label: string; color: string; data: ObjectiveTermGoal[], term: 'medium_term' }
    | { key: 'longTerm'; label: string; color: string; data: ObjectiveTermGoal[], term: 'long_term' };
    
    function transformObjectives(objectives?: Objective): Group[] {
        return [
            {
                key: 'shortTerm',
                label: 'Korte Termijn (1–3 maanden)',
                color: 'blue',
                data: objectives?.short_term_goals || [],
                term: 'short_term'
            },
            {
                key: 'mediumTerm',
                label: 'Middellange Termijn (3–6 maanden)',
                color: 'purple',
                data: objectives?.medium_term_goals || [],
                term: 'medium_term'
            },
            {
                key: 'longTerm',
                label: 'Lange Termijn (6–12 maanden)',
                color: 'green',
                data: objectives?.long_term_goals || [],
                term: 'long_term'
            },
        ];
    }
    const typed = transformObjectives(objectives as Objective);
    const getStatusColor = (status: keyof typeof statusColors) => {
        return statusColors[status] || "bg-gray-100 text-gray-700";
    };
    
    return (
        <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg">
                <CardTitle className='flex items-center justify-between text-white'>
                    <span>Doelstellingen</span>
                    <UpsertObjectiveSheet
                        mode="create"
                        handleCreate={handleCreate}
                        isOpen={openId === -1}
                        handleOpen={(o) => setOpenId(o ? -1 : null)}
                    />
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6 bg-gray-50 rounded-b-lg">
                {typed.map((section) => (
                    <div key={section.key} className={`p-4 rounded-lg ${termColors[section.key].bg} ${termColors[section.key].border} border-l-4`}>
                        <h3 className={`text-xl font-bold mb-4 ${termColors[section.key].text}`}>
                            {section.label}
                        </h3>
                        {section.data.length === 0 ? (
                            <div className="text-center py-6 text-gray-500">
                                Geen doelstellingen toegevoegd
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {section.data.map((objectiveTermGoal: ObjectiveTermGoal) => (
                                    <Card key={objectiveTermGoal.objective_id} className={`shadow-sm hover:shadow-md transition-shadow ${termColors[section.key].border} border-l-4`}>
                                        <CardHeader className="pb-2">
                                            <div className="flex items-start justify-between">
                                                <CardTitle className="text-lg">{objectiveTermGoal.title}</CardTitle>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className={`${getStatusColor(objectiveTermGoal.status)} border`}>
                                                        {objectiveTermGoal.status === 'not_started' ? 'Niet gestart' : objectiveTermGoal.status.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase())}
                                                    </Badge>
                                                    <div className="flex gap-1 ml-2">
                                                        <UpsertObjectiveSheet
                                                            mode="update"
                                                            objective={{
                                                                description: objectiveTermGoal.description,
                                                                objective_id: objectiveTermGoal.objective_id,
                                                                status: objectiveTermGoal.status,
                                                                timeframe: section.term,
                                                                title: objectiveTermGoal.title
                                                            }}
                                                            handleUpdate={handleUpdate}
                                                            handleCreate={handleCreate}
                                                            isOpen={openId === objectiveTermGoal.objective_id}
                                                            handleOpen={(o) => setOpenId(o ? objectiveTermGoal.objective_id : null)}
                                                        />
                                                        <PrimaryButton
                                                            text=""
                                                            icon={Trash2}
                                                            onClick={() => handleDelete(objectiveTermGoal.objective_id)}
                                                            animation='animate-bounce'
                                                            className="bg-red-500 text-white hover:bg-red-600"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-2">
                                            <p className="text-gray-700 mb-4">{objectiveTermGoal.description}</p>
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <div className="flex justify-between items-center mb-3">
                                                    <h5 className="font-medium text-gray-900">Specifieke Acties:</h5>
                                                    <UpsertActionSheet
                                                        mode="create"
                                                        handleCreate={handleCreateAction}
                                                        objectiveId={objectiveTermGoal.objective_id}
                                                        isOpen={openId === -objectiveTermGoal.objective_id}
                                                        handleOpen={(o) => setOpenId(o ? -objectiveTermGoal.objective_id : null)}
                                                    />
                                                </div>
                                                {objectiveTermGoal.actions.length === 0 ? (
                                                    <div className="text-center py-3 text-gray-400 text-sm">
                                                        Geen acties toegevoegd
                                                    </div>
                                                ) : (
                                                    <ul className="space-y-3">
                                                        {objectiveTermGoal.actions.map((action: ObjectiveAction, index: number) => (
                                                            <li key={index} className="flex items-start justify-between group">
                                                                <div className="flex items-start space-x-2">
                                                                    {action.is_completed ? (
                                                                        <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                                                                    ) : (
                                                                        <Hourglass className="text-yellow-500 mt-0.5 flex-shrink-0" size={16} />
                                                                    )}
                                                                    <div>
                                                                        <span className="text-sm text-gray-800">{action.action_description}</span>
                                                                        {action.notes && (
                                                                            <span className="block text-xs text-gray-500 italic mt-1">({action.notes})</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <UpsertActionSheet
                                                                        mode="update"
                                                                        action={action}
                                                                        handleUpdate={handleUpdateAction}
                                                                        handleCreate={handleCreateAction}
                                                                        isOpen={openId === action.action_id+1000_000}
                                                                        handleOpen={(o) => setOpenId(o ? action.action_id+1000_000 : null)}
                                                                        objectiveId={objectiveTermGoal.objective_id}
                                                                    />
                                                                    <PrimaryButton
                                                                        text=""
                                                                        icon={Trash2}
                                                                        onClick={() => handleDeleteAction(action.action_id)}
                                                                        animation='animate-bounce'
                                                                        className="bg-red-500 text-white hover:bg-red-600"
                                                                    />
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

export default ObjectivesTab