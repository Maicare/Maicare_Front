"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useCarePlan } from '@/hooks/care-plan/use-care-plan';
import { CarePlanOverview, Objective } from '@/types/care-plan.types';
import { useParams } from 'next/navigation'
import UpsertOverviewSheet from './upsert-overview-sheet';
import { UpdateOverview } from '@/schemas/plan-care.schema';
import { useState } from 'react';

const OverviewTab = () => {
    const {carePlanId} = useParams();
    const {data:overview,updateOverview} = useCarePlan({
        overview: true,
        carePlanId: carePlanId as string
    });
    const {data:objectives} = useCarePlan({
        objectives: true,
        carePlanId: carePlanId as string
    });
    const [open, setOpen] = useState(false);
    const handleUpdateOverview = async (values: UpdateOverview) => {
        try {
            await updateOverview(values, {
                displayProgress: true,
                displaySuccess: true,
            });
        } catch (error) {
            console.error(error);
        }
    };
    if (!objectives || !overview) return null;
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-blue-900 text-lg">Korte Termijn</CardTitle>
                        <CardDescription className="text-blue-700">
                            {(objectives as Objective).short_term_goals.length} doelstellingen
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="text-xs text-blue-600">
                        1-3 maanden
                    </CardFooter>
                </Card>
                <Card className="bg-purple-50 border-purple-200">
                    <CardHeader>
                        <CardTitle className="text-purple-900 text-lg">Middellange Termijn</CardTitle>
                        <CardDescription className="text-purple-700">
                            {(objectives as Objective).medium_term_goals.length} doelstellingen
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="text-xs text-purple-600">
                        3-6 maanden
                    </CardFooter>
                </Card>
                <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                        <CardTitle className="text-green-900 text-lg">Lange Termijn</CardTitle>
                        <CardDescription className="text-green-700">
                            {(objectives as Objective).long_term_goals.length} doelstellingen
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="text-xs text-green-600">
                        6-12 maanden
                    </CardFooter>
                </Card>
            </div>

            <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardHeader>
                    <CardTitle className='flex items-center justify-between'>
                        <p>Plan Samenvatting</p>
                        <UpsertOverviewSheet
                            mode="update"
                            handleCreate={handleUpdateOverview}
                            handleUpdate={handleUpdateOverview}
                            isOpen={open}
                            handleOpen={(o) => {setOpen(o);}}
                            overview={{
                                assessment_summary: (overview as CarePlanOverview).assessment_summary || '',
                            }}
                        />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-700 leading-relaxed">{(overview as CarePlanOverview).assessment_summary}</p>
                </CardContent>
            </Card>
        </div>
    )
}

export default OverviewTab