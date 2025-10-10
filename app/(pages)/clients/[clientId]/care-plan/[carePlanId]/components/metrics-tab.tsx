"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {  Trash2 } from 'lucide-react';
import { useCarePlan } from '@/hooks/care-plan/use-care-plan';
import { useParams } from 'next/navigation';
import { SuccessMetric } from '@/types/care-plan.types';
import { Badge } from '@/components/ui/badge';
import UpsertSuccessMetricSheet from './upsert-success-metric-sheet';
import { useState } from 'react';
import { Id } from '@/common/types/types';
import { CreateSuccessMetric } from '@/schemas/plan-care.schema';
import PrimaryButton from '@/common/components/PrimaryButton';

const MetricsTab = () => {
    const { carePlanId } = useParams();
    const { data: successMetrics, createSuccessMetric, updateSuccessMetric, deleteSuccessMetric } = useCarePlan({
        successMetrics: true,
        carePlanId: carePlanId as string
    });
    const [openId, setOpenId] = useState<Id | null>(null);

    const handleCreate = async (values: CreateSuccessMetric) => {
        try {
            await createSuccessMetric(values, {
                displayProgress: true,
                displaySuccess: true,
            });
            setOpenId(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = async (values: CreateSuccessMetric, id: Id) => {
        try {
            await updateSuccessMetric(values, id, {
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
            await deleteSuccessMetric(id, {
                displayProgress: true,
                displaySuccess: true,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const generatedPlan = successMetrics as SuccessMetric[]; // Adjust type as necessary
    return (
        <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-300">
                <CardTitle className='flex items-center justify-between text-white'>
                    <div className="flex items-center space-x-3">
                        <h2 className="text-xl font-bold">Metrics</h2>
                    </div>
                    <UpsertSuccessMetricSheet
                        mode="create"
                        handleCreate={handleCreate}
                        isOpen={openId === -1}
                        handleOpen={(o) => setOpenId(o ? -1 : null)}
                    />
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {(generatedPlan || []).map((metric: SuccessMetric) => (
                    <Card key={metric.metric_id} className="mt-6 w-full bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-200 group">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start gap-2">
                                <div className="space-y-2">
                                    <CardTitle className="text-xl font-bold text-blue-800">
                                        {metric.metric_name}
                                    </CardTitle>
                                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                                        #{metric.metric_id}
                                    </Badge>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <UpsertSuccessMetricSheet
                                        mode="update"
                                        successMetric={metric}
                                        handleUpdate={handleUpdate}
                                        handleCreate={handleCreate}
                                        isOpen={openId === metric.metric_id}
                                        handleOpen={(o) => setOpenId(o ? metric.metric_id : null)}
                                    />
                                    <PrimaryButton
                                        text=""
                                        icon={Trash2}
                                        onClick={() => handleDelete(metric.metric_id)}
                                        animation='animate-bounce'
                                        className="bg-red-500 text-white hover:bg-red-600"
                                    />
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* Measurement Method */}
                            <div className="bg-blue-300/50 p-3 rounded-lg border border-blue-100">
                                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                                    Measurement Method
                                </p>
                                <p className="text-sm text-blue-800/90">
                                    {metric.measurement_method}
                                </p>
                            </div>

                            {/* Current Status */}
                            <div className="bg-white p-3 rounded-lg border border-teal-100 shadow-sm">
                                <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-1">
                                    Current Status
                                </p>
                                {metric.current_value ? (
                                    <p className="text-sm text-gray-800">
                                        {metric.current_value}
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">
                                        Not yet measured
                                    </p>
                                )}
                            </div>

                            {/* Target */}
                            <div className="bg-teal-300/50 p-3 rounded-lg border border-teal-100">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider">
                                        Target
                                    </p>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-500">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M16 8s-4-4-8-4-8 4-8 4" />
                                        <path d="M8 16s4 4 8 4 8-4 8-4" />
                                        <line x1="12" y1="2" x2="12" y2="4" />
                                        <line x1="12" y1="20" x2="12" y2="22" />
                                        <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
                                        <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
                                        <line x1="2" y1="12" x2="4" y2="12" />
                                        <line x1="20" y1="12" x2="22" y2="12" />
                                        <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
                                        <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-teal-800">
                                    {metric.target_value}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
    )
}

export default MetricsTab