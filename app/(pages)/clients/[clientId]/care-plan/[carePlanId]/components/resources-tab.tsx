"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCarePlan } from '@/hooks/care-plan/use-care-plan';
import { useParams } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { Resource } from '@/types/care-plan.types';
import UpsertResourceSheet from './upsert-resource-sheet';
import { CreateResource } from '@/schemas/plan-care.schema';
import { useState } from 'react';
import { cn } from '@/utils/cn';
import { formatDateToDutch } from '@/utils/timeFormatting';
import { Id } from '@/common/types/types';
import PrimaryButton from '@/common/components/PrimaryButton';



const ResourcesTab = () => {
    const { carePlanId } = useParams();
    const [openId, setOpenId] = useState<Id | null>(null);
    const { data: resources, createResource, deleteResource, updateResource } = useCarePlan({
        resources: true,
        carePlanId: carePlanId as string
    });

    const hadleCreate = async (values: CreateResource) => {
        try {
            await createResource(values, {
                displayProgress: true,
                displaySuccess: true,
            });
            setOpenId(null);
        } catch (error) {
            console.error(error);
        }
    };
    const handleUpdate = async (values: CreateResource, id: Id) => {
        try {
            await updateResource(values, id, {
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
            await deleteResource(id, {
                displayProgress: true,
                displaySuccess: true,
            });
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className="mt-6">
            <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-500 to-blue-300">
                    <CardTitle className='flex items-center justify-between text-white'>
                        <div className="flex items-center space-x-3">
                            <h2 className="text-xl font-bold">Benodigde Hulpbronnen</h2>
                        </div>
                        <UpsertResourceSheet
                            mode="create"
                            handleCreate={hadleCreate}
                            isOpen={openId === -1}
                            handleOpen={(o) => setOpenId(o ? -1 : null)}
                        />
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 mt-6">
                    {(resources as Resource[] || []).map((resource: Resource, index: number) => (
                        <Card
                            key={index}
                            className={`shadow-sm hover:shadow-md transition-shadow bg-green-50 border-green-200 border-l-4`}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="">
                                        <p className={`font-medium text-green-800`}>
                                            {resource.resource_description}
                                        </p>
                                        <div className={cn("flex items-center space-x-2 text-sm text-gray-500 mt-1",resource.is_obtained ? "text-green-400" : "text-red-400")}>
                                            {resource.is_obtained ? formatDateToDutch(resource.obtained_date) : 'Nog niet verkregen'}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <UpsertResourceSheet
                                            mode="update"
                                            resource={resource}
                                            handleUpdate={handleUpdate}
                                            handleCreate={hadleCreate}
                                            isOpen={openId === resource.id}
                                            handleOpen={(o) => setOpenId(o ? resource.id : null)}
                                        />
                                        <PrimaryButton
                                            text=""
                                            icon={Trash2}
                                            onClick={() => handleDelete(resource.id)}
                                            animation='animate-bounce'
                                            className="bg-red-500 text-white hover:bg-red-600"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}

export default ResourcesTab