"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCarePlan } from '@/hooks/care-plan/use-care-plan';
import { Intervention, InterventionActivity } from '@/types/care-plan.types';
import { Calendar, Trash2, Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import UpsertInterventionSheet from './upsert-intervention-sheet';
import { Id } from '@/common/types/types';
import { useState } from 'react';
import { CreateIntervention } from '@/schemas/plan-care.schema';
import PrimaryButton from '@/common/components/PrimaryButton';

const InterventionsTab = () => {
    const { carePlanId } = useParams();
    const { data: interventions, createIntervention, updateIntervention, deleteIntervention } = useCarePlan({
        interventions: true,
        carePlanId: carePlanId as string
    });
    const [openId, setOpenId] = useState<Id | null>(null);

    const handleCreate = async (values: CreateIntervention) => {
        try {
            await createIntervention(values, {
                displayProgress: true,
                displaySuccess: true,
            });
            setOpenId(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = async (values: CreateIntervention, id: Id) => {
        try {
            await updateIntervention(values, id, {
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
            await deleteIntervention(id, {
                displayProgress: true,
                displaySuccess: true,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const frequencySections = [
        { 
            key: 'daily_activities', 
            label: 'Dagelijkse Activiteiten', 
            icon: Calendar, 
            color: 'blue',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            textColor: 'text-blue-800',
            accentColor: 'bg-blue-500',
            frequency: 'daily' 
        },
        { 
            key: 'weekly_activities', 
            label: 'Wekelijkse Activiteiten', 
            icon: Calendar, 
            color: 'purple',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
            textColor: 'text-purple-800',
            accentColor: 'bg-purple-500',
            frequency: 'weekly' 
        },
        { 
            key: 'monthly_activities', 
            label: 'Maandelijkse Activiteiten', 
            icon: Calendar, 
            color: 'orange',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200',
            textColor: 'text-orange-800',
            accentColor: 'bg-orange-500',
            frequency: 'monthly' 
        }
    ];

    return (
        <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-600">
                <CardTitle className='flex items-center justify-between text-white'>
                    <div className="flex items-center space-x-3">
                        <h2 className="text-xl font-bold">Interventies</h2>
                    </div>
                    <UpsertInterventionSheet
                        mode="create"
                        handleCreate={handleCreate}
                        isOpen={openId === -1}
                        handleOpen={(o) => setOpenId(o ? -1 : null)}
                    />
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8 bg-gray-50">
                {frequencySections.map((section) => (
                    <div key={section.key} className="space-y-4">
                        <div className={`flex items-center justify-between p-3 rounded-lg ${section.bgColor} ${section.borderColor} border-l-4 ${section.accentColor}`}>
                            <div className="flex items-center space-x-3">
                                <section.icon className={`w-6 h-6 text-white`} />
                                <h3 className={`text-lg font-bold text-white`}>{section.label}</h3>
                            </div>
                            <button className="flex items-center space-x-1 text-sm font-medium px-3 py-1 rounded-full bg-white hover:bg-gray-100 transition-colors">
                                <Plus size={16} className={section.textColor} />
                                <span className={section.textColor}>Nieuwe interventie</span>
                            </button>
                        </div>
                        
                        <div className="grid gap-4">
                            {((interventions as Intervention)?.[section.key as keyof Intervention] || []).length === 0 ? (
                                <div className="text-center py-6 text-gray-400 bg-white rounded-lg border border-dashed border-gray-300">
                                    Geen {section.label.toLowerCase()} toegevoegd
                                </div>
                            ) : (
                                ((interventions as Intervention)?.[section.key as keyof Intervention] || []).map((intervention: InterventionActivity, index: number) => (
                                    <Card 
                                        key={index} 
                                        className={`shadow-sm hover:shadow-md transition-shadow ${section.bgColor} ${section.borderColor} border-l-4`}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <p className={`font-medium ${section.textColor}`}>
                                                    {intervention.intervention_description}
                                                </p>
                                                <div className="flex items-center space-x-2">
                                                    <UpsertInterventionSheet
                                                        mode="update"
                                                        intervention={{
                                                            intervention_id: intervention.intervention_id,
                                                            intervention_description: intervention.intervention_description,
                                                            frequency: section.frequency as 'daily' | 'weekly' | 'monthly',
                                                        }}
                                                        handleUpdate={handleUpdate}
                                                        handleCreate={handleCreate}
                                                        isOpen={openId === intervention.intervention_id}
                                                        handleOpen={(o) => setOpenId(o ? intervention.intervention_id : null)}
                                                    />
                                                    <PrimaryButton
                                                        text=""
                                                        icon={Trash2}
                                                        onClick={() => handleDelete(intervention.intervention_id)}
                                                        animation='animate-bounce'
                                                        className="bg-red-500 text-white hover:bg-red-600"
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

export default InterventionsTab;