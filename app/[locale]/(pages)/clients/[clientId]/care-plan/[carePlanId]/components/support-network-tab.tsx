"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCarePlan } from '@/hooks/care-plan/use-care-plan';
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SupportNetwork } from '@/types/care-plan.types';
import UpsertSupportNetworkSheet from './upsert-support-network-sheet';
import { useState } from 'react';
import { CreateSupportNetwork } from '@/schemas/plan-care.schema';
import { Id } from '@/common/types/types';
import PrimaryButton from '@/common/components/PrimaryButton';
import { Trash2 } from 'lucide-react';


const SupportNetworkTab = () => {
    const { carePlanId } = useParams();
    const { data: supportNetwork, createSupportNetwork, deleteSupportNetwork, updateSupportNetwork } = useCarePlan({
        supportNetwork: true,
        carePlanId: carePlanId as string
    });
    const [openId, setOpenId] = useState<Id | null>(null);

    const hadleCreate = async (values: CreateSupportNetwork) => {
        try {
            await createSupportNetwork(values, {
                displayProgress: true,
                displaySuccess: true,
            });
            setOpenId(null);
        } catch (error) {
            console.error(error);
        }
    };
    const handleUpdate = async (values: CreateSupportNetwork, id: Id) => {
        try {
            await updateSupportNetwork(values, id, {
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
            await deleteSupportNetwork(id, {
                displayProgress: true,
                displaySuccess: true,
            });
        } catch (error) {
            console.error(error);
        }
    };
    // Get initials for avatar
    const getInitials = (name: string) => {
        return name
            .split(/[\s-/]+/)
            .map(part => part.charAt(0))
            .filter(char => char.match(/[A-Za-z]/))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Color based on role type
    const getRoleColor = (role: string) => {
        if (role.includes('Counselor') || role.includes('Advisor')) {
            return {
                bg: 'bg-blue-50',
                border: 'border-blue-200',
                text: 'text-blue-800',
                accent: 'bg-blue-100'
            };
        } else if (role.includes('Coordinator') || role.includes('Manager')) {
            return {
                bg: 'bg-purple-50',
                border: 'border-purple-200',
                text: 'text-purple-800',
                accent: 'bg-purple-100'
            };
        } else if (role.includes('Family') || role.includes('Household')) {
            return {
                bg: 'bg-green-50',
                border: 'border-green-200',
                text: 'text-green-800',
                accent: 'bg-green-100'
            };
        } else {
            return {
                bg: 'bg-teal-50',
                border: 'border-teal-200',
                text: 'text-teal-800',
                accent: 'bg-teal-100'
            };
        }
    };


    if (!supportNetwork) return null;

    return (
        <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-500 to-blue-300">
                <CardTitle className='flex items-center justify-between text-white'>
                    <div className="flex items-center space-x-3">
                        <h2 className="text-xl font-bold">Support Network</h2>
                    </div>
                    <UpsertSupportNetworkSheet
                        mode="create"
                        handleCreate={hadleCreate}
                        isOpen={openId === -1}
                        handleOpen={(o) => setOpenId(o ? -1 : null)}
                    />
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {(supportNetwork as SupportNetwork[]).map((support: SupportNetwork) => {
                    const colors = getRoleColor(support.role_title);

                    return (
                        <Card key={support.support_network_id} className={`mt-6 w-full ${colors.bg} border ${colors.border} shadow-sm hover:shadow-md transition-all duration-200 group`}>
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex items-start gap-3">
                                        <Avatar className={`${colors.accent} border ${colors.border}`}>
                                            <AvatarFallback className={`font-medium ${colors.text}`}>
                                                {getInitials(support.role_title)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <CardTitle className={`text-lg font-bold ${colors.text}`}>
                                                {support.role_title}
                                            </CardTitle>
                                            <div className="text-xs text-gray-500 mt-1">
                                                ID: {support.support_network_id}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <UpsertSupportNetworkSheet
                                            mode="update"
                                            supportNetwork={support}
                                            handleUpdate={handleUpdate}
                                            handleCreate={hadleCreate}
                                            isOpen={openId === support.support_network_id}
                                            handleOpen={(o) => setOpenId(o ? support.support_network_id : null)}
                                        />
                                        <PrimaryButton
                                            text=""
                                            icon={Trash2}
                                            onClick={() => handleDelete(support.support_network_id)}
                                            animation='animate-bounce'
                                            className="bg-red-500 text-white hover:bg-red-600"
                                        />
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="flex items-center gap-5 ml-3">
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
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-gray-600">
                                            Responsibilities
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            {support.responsibility_description}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </CardContent>
        </Card>
    );
}
export default SupportNetworkTab