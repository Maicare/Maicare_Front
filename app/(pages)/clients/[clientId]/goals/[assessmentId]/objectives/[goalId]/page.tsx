"use client";
import Loader from '@/components/common/loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent,  CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator';
import { useGoal } from '@/hooks/goal/use-goal';
import { Goal } from '@/types/goals.types'
import {  Calendar,  Flag, Pencil, Target, Text, Trash, Variable } from 'lucide-react'
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ObjectivesDetails from './_components/ObjectivesDetails';


const ObjectivePage = () => {
    const { assessmentId, clientId, goalId } = useParams();
    const { readOne } = useGoal({ autoFetch: false, clientId: parseInt(clientId as string), assessmentId: parseInt(assessmentId as string) });
    const [goal, setGoal] = useState<Goal | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const fetchGoal = async (id: number) => {
            setIsLoading(true);
            const data = await readOne(id);
            setGoal(data);
            setIsLoading(false);
        };
        if (goalId) fetchGoal(+goalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [goalId]);
    if (isLoading) {
        return (
            <div className="w-full flex items-center justify-center">
                <Loader />
            </div>
        )
    }
    if (!goal) {
        return (
            <div className="w-full flex items-center justify-center">
                <h1 className='text-lg font-semibold text-slate-600'>No goal found</h1>
            </div>
        )
    }


    
    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'>
                    <Variable size={24} className='text-indigo-400' />  Objective
                </h1>
            </div>
            <div className="grid grid-col-1 gap-4">
                <Card className="w-full bg-white shadow-md dark:bg-slate-800">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-slate-600 dark:text-slate-200 text-lg">
                                name
                            </CardTitle>
                            <div className="flex items-center gap-4">
                                <Button className='w-12 h-12 p-0 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center'>
                                    <Pencil size={16} />
                                </Button>
                                <Button className='w-12 h-12 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center'>
                                    <Trash size={16} />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <Separator />
                    <CardContent className="grid grid-cols-3 gap-4 mt-4">
                        <div className="grid grid-col-1 gap-2">
                            <div className="flex items-center gap-2">
                                <Flag size={16} className='text-slate-500' />
                                <h1 className='text-slate-600 dark:text-slate-200 text-sm font-semibold'>Status</h1>
                            </div>
                            <div className="w-full border-2 border-indigo-500/30 rounded-md p-2">
                                Active
                            </div>
                        </div>
                        <div className="grid grid-col-1 gap-2">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className='text-slate-500' />
                                <h1 className='text-slate-600 dark:text-slate-200 text-sm font-semibold'>Creation Date</h1>
                            </div>
                            <div className="w-full border-2 border-indigo-500/30 rounded-md p-2">
                                some date
                            </div>
                        </div>
                        <div className="grid grid-col-1 gap-2">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className='text-slate-500' />
                                <h1 className='text-slate-600 dark:text-slate-200 text-sm font-semibold'>Start Date</h1>
                            </div>
                            <div className="w-full border-2 border-indigo-500/30 rounded-md p-2">
                                Active
                            </div>
                        </div>
                        <div className="grid grid-col-1 gap-2">
                            <div className="flex items-center gap-2">
                                <Target size={16} className='text-slate-500' />
                                <h1 className='text-slate-600 dark:text-slate-200 text-sm font-semibold'>Target Level</h1>
                            </div>
                            <div className="w-full border-2 border-indigo-500/30 rounded-md p-2">
                                some level
                            </div>
                        </div>
                        <div className="grid grid-col-1 gap-2">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className='text-slate-500' />
                                <h1 className='text-slate-600 dark:text-slate-200 text-sm font-semibold'>Target Date</h1>
                            </div>
                            <div className="w-full border-2 border-indigo-500/30 rounded-md p-2">
                                Active
                            </div>
                        </div>
                        <div className="grid grid-col-1 gap-2">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className='text-slate-500' />
                                <h1 className='text-slate-600 dark:text-slate-200 text-sm font-semibold'>Completion Date</h1>
                            </div>
                            <div className="w-full border-2 border-indigo-500/30 rounded-md p-2">
                                Active
                            </div>
                        </div>
                        <div className="col-span-3 grid grid-col-1 gap-2">
                            <div className="flex items-center gap-2">
                                <Text size={16} className='text-slate-500' />
                                <h1 className='text-slate-600 dark:text-slate-200 text-sm font-semibold'>Description</h1>
                            </div>
                            <div className="w-full border-2 border-indigo-500/30 rounded-md p-2">
                                Active
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <ObjectivesDetails 
                    assessmentId={assessmentId as string}
                    clientId={clientId as string}
                />
            </div>
        </div>
    )
}

export default ObjectivePage