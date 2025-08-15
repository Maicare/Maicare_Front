"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCarePlan } from '@/hooks/care-plan/use-care-plan';
import { useParams } from 'next/navigation';
import {  Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Risk } from '@/types/care-plan.types';
import UpsertRiskSheet from './upsert-risk-sheet';
import { useState } from 'react';
import { Id } from '@/common/types/types';
import { CreateRisk } from '@/schemas/plan-care.schema';
import PrimaryButton from '@/common/components/PrimaryButton';
const colorMap = {
    high: {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-800",
        accent: "bg-red-100",
        badge: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
    },
    medium: {
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-800",
        accent: "bg-amber-100",
        badge: "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200",
    },
    low: {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-800",
        accent: "bg-green-100",
        badge: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
    },
};

const RisksTab = () => {
    const { carePlanId } = useParams();
    const { data: risks, createRisk, updateRisk, deleteRisk } = useCarePlan({
        risks: true,
        carePlanId: carePlanId as string
    });
    const [openId, setOpenId] = useState<Id | null>(null);

    const handleCreate = async (values: CreateRisk) => {
        try {
            await createRisk(values, {
                displayProgress: true,
                displaySuccess: true,
            });
            setOpenId(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = async (values: CreateRisk, id: Id) => {
        try {
            await updateRisk(values, id, {
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
            await deleteRisk(id, {
                displayProgress: true,
                displaySuccess: true,
            });
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-400">
                <CardTitle className='flex items-center justify-between text-white'>
                    <div className="flex items-center space-x-3">
                        <h2 className="text-xl font-bold">Risico&apos;s</h2>
                    </div>
                    <UpsertRiskSheet
                        mode="create"
                        handleCreate={handleCreate}
                        isOpen={openId === -1}
                        handleOpen={(o) => setOpenId(o ? -1 : null)}
                    />
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {(risks as Risk[] || []).map((risk: Risk) => {
                    const colors = colorMap[risk.risk_level as keyof typeof colorMap];
                    return (
                        <Card key={risk.risk_id} className={`mt-6 w-full ${colors.bg} border ${colors.border} shadow-sm hover:shadow-md transition-all duration-200 group`}>
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start gap-2">
                                    <CardTitle className={`text-lg font-bold ${colors.text}`}>
                                        {risk.risk_description}
                                    </CardTitle>
                                    <Badge variant="outline" className={colors.badge}>
                                        {risk.risk_level.toUpperCase()}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Mitigation Strategy */}
                                <div className={`${colors.accent} p-3 rounded-lg border ${colors.border}`}>
                                    <div className="flex items-start gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className={`mt-0.5 flex-shrink-0 ${colors.text}`}
                                        >
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        </svg>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider mb-1">
                                                Mitigation Strategy
                                            </p>
                                            <p className="text-sm">
                                                {risk.mitigation_strategy}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Risk ID (subtle) */}
                                <div className="text-xs text-gray-500 flex items-center justify-between mt-2">
                                    <span className="italic">ID: {risk.risk_id}</span>
                                    <div className="flex items-center space-x-2">
                                        <UpsertRiskSheet
                                            mode="update"
                                            risk={risk}
                                            handleUpdate={handleUpdate}
                                            handleCreate={handleCreate}
                                            isOpen={openId === risk.risk_id}
                                            handleOpen={(o) => setOpenId(o ? risk.risk_id : null)}
                                        />
                                        <PrimaryButton
                                            text=""
                                            icon={Trash2}
                                            onClick={() => handleDelete(risk.risk_id)}
                                            animation='animate-bounce'
                                            className="bg-red-500 text-white hover:bg-red-600"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </CardContent>
        </Card>
    );
};

export default RisksTab