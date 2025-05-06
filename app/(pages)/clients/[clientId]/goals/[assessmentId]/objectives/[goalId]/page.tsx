"use client";
import Loader from '@/components/common/loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGoal } from '@/hooks/goal/use-goal';
import { Goal } from '@/types/goals.types';
import { Calendar, Clock, Flag, Pencil, Target, Text, Trash, Variable } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ObjectivesDetails from './_components/ObjectivesDetails';
import { Badge } from '@/components/ui/badge';
import { dateFormat } from '@/utils/timeFormatting';
import { cn, getTailwindClasses } from '@/utils/cn';
import PencilSquare from '@/components/icons/PencilSquare';
import TrashIcon from '@/components/icons/TrashIcon';
import { CreateGoal } from '@/schemas/goal.schema';
import UpsertGoalSheet from '../../_components/UpsertGoalSheet';
import PrimaryButton from '@/common/components/PrimaryButton';

const ObjectivePage = () => {
  const { assessmentId, clientId, goalId } = useParams();
  const { readOne, updateOne } = useGoal({
    autoFetch: false,
    clientId: parseInt(clientId as string),
    assessmentId: parseInt(assessmentId as string),
  });
  const [goal, setGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const fetchGoal = async (id: number) => {
      setIsLoading(true);
      const data = await readOne(id);
      setGoal(data);
      setIsLoading(false);
    };
    if (goalId) {
      fetchGoal(+goalId);
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalId]);

  const handleUpdate = async (values: CreateGoal) => {
    console.log("Update Clicked")
    setIsEditOpen(false);
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-4 p-8">
        <Loader />
        <p className="text-sm font-medium text-slate-500 animate-pulse">
          Loading objective details...
        </p>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-4 p-8">
        <div className="max-w-md w-full space-y-4 text-center">
          <div className="flex flex-col items-center gap-3">
            <Flag className="h-12 w-12 text-slate-300" />
            <h1 className="text-xl font-semibold text-slate-600">
              Objective Not Found
            </h1>
            <p className="text-sm text-slate-500">
              The requested objective doesn't exist or may have been removed.
            </p>
          </div>

          <Separator className="my-4" />

          <Button
            variant="ghost"
            className="text-indigo-500 hover:bg-indigo-50"
            onClick={() => window.history.back()}
          >
            ← Return to previous page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600">
          <Variable size={24} className="text-indigo-400" /> Goal
        </h1>
      </div>
      <div className="grid grid-col-1 gap-4">
        <Card className="bg-cyan-600/20 backdrop-blur-sm shadow-sm rounded-md">
          <CardHeader className="flex flex-row items-center justify-between p-6">
            <CardTitle>Goal Details</CardTitle>
            <div className="flex gap-2">
              <UpsertGoalSheet
                mode="update"
                isOpen={isEditOpen}
                handleOpen={setIsEditOpen}
                goal={goal!}
                handleCreate={() => { }}
                handleUpdate={handleUpdate}
              />
              <PrimaryButton
                text="Delete"
                icon={Trash}
                onClick={() => console.log("Delete")}
                animation='none'
                className="bg-red-400 text-white hover:bg-red-500"
              />
            </div>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {/* Status */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <div className="rounded-md border border-indigo-700 p-3 text-sm">
                <Badge variant={goal.status === 'pending' ? 'secondary' : 'default'}>
                  {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                </Badge>
              </div>
            </div>

            {/* Creation Date */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Creation Date</p>
              <div className="rounded-md border border-indigo-700 p-3 text-sm">
                {dateFormat(goal.created_at) || "N/A"}
              </div>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Start Date</p>
              <div className="rounded-md border border-indigo-700 p-3 text-sm">
                {dateFormat(goal.start_date) || "N/A"}
              </div>
            </div>

            {/* Target Level */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Target Level</p>
              <div className="rounded-md border border-indigo-700 p-3 text-sm">
                <Badge variant="outline" className={cn(getTailwindClasses(goal.target_level))}>
                  Level {goal.target_level}
                </Badge>
              </div>
            </div>

            {/* Target Date */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Target Date</p>
              <div className="rounded-md border border-indigo-700 p-3 text-sm">
                {dateFormat(goal.target_date) || "N/A"}
              </div>
            </div>

            {/* Completion Date */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Completion Date</p>
              <div className="rounded-md border border-indigo-700 p-3 text-sm flex items-center gap-2">
                {goal.completion_date.startsWith('0001') ? (
                  <>
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-400">Ongoing</span>
                  </>
                ) : (
                  dateFormat(goal.completion_date)
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 col-span-full">
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <div className="rounded-md border border-indigo-700 p-3 text-sm whitespace-pre-wrap">
                {goal.description || "No description provided"}
              </div>
            </div>
          </CardContent>
        </Card>
        <ObjectivesDetails
          clientId={clientId as string}
          assessmentId={assessmentId as string}
          goalId={goalId as string}
        />
      </div>
    </div>
  );
};

export default ObjectivePage;
