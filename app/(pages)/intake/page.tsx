"use client";
import { PermissionsObjects } from "@/common/data/permission.data";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import React, { useState } from 'react';
import { Calendar, AlertTriangle, PhoneCall, Mail, UserPlus } from 'lucide-react';
import { useIntake } from "@/hooks/intake/use-intake";
import Loader from "@/components/common/loader";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Buttons/Button";

interface Client {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    created_at: string;
    urgency_score: number;
    risk_aggression: boolean;
    risk_suicidality: boolean;
    risk_running_away: boolean;
    risk_self_harm: boolean;
    risk_weapon_possession: boolean;
    risk_drug_dealing: boolean;
}

const ClientsPage = () => {
    const router = useRouter();
    const [sortBy, setSortBy] = useState('waiting_time');
    const [filterUrgent, setFilterUrgent] = useState(false);
    const [moveLoading, setMoveLoading] = useState(false);

    const { intakes, isLoading, moveToWaitingList } = useIntake({})

    // Define mapping for risk flags to display label
    const riskMapping = [
        { key: 'risk_aggression', label: 'Aggression' },
        { key: 'risk_suicidality', label: 'Suicidality' },
        { key: 'risk_running_away', label: 'Running Away' },
        { key: 'risk_self_harm', label: 'Self Harm' },
        { key: 'risk_weapon_possession', label: 'Weapon Possession' },
        { key: 'risk_drug_dealing', label: 'Drug Dealing' }
    ];

    const getUrgencyColor = (score: number): string => {
        if (score >= 8) return 'bg-red-100 text-red-800';
        if (score >= 5) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    const sortedClients = [...(intakes?.results || [])].sort((a, b) => {
        if (sortBy === 'waiting_time') {
            return new Date(a.created_at ?? '').getTime() - new Date(b.created_at ?? '').getTime();
        }
        if (sortBy === 'urgency') {
            return (b.urgency_score ?? 0) - (a.urgency_score ?? 0);
        }
        return 0;
    });

    const filteredClients = filterUrgent
        ? sortedClients.filter(client => (client.urgency_score ?? 0) >= 7)
        : sortedClients;

    const acceptClient = async (clientId: string) => {
        try {
            setMoveLoading(true);
            await moveToWaitingList(clientId)
            setMoveLoading(false);
        } catch (error) {
            setMoveLoading(false);
            console.error(error);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Waitlist Management</h1>
                <p className="text-gray-600">
                    {filteredClients.length} clients currently on waitlist
                </p>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center">
                    <label htmlFor="sortBy" className="mr-2 font-medium">Sort by:</label>
                    <select
                        id="sortBy"
                        className="border rounded p-2"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="waiting_time">Waiting Time</option>
                        <option value="urgency">Urgency Score</option>
                    </select>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="filterUrgent"
                        checked={filterUrgent}
                        onChange={(e) => setFilterUrgent(e.target.checked)}
                        className="mr-2"
                    />
                    <label htmlFor="filterUrgent" className="font-medium">Show urgent cases only</label>
                </div>
            </div>

            <div className="rounded-lg overflow-hidden">
                {/* Add items-stretch to force all grid items to have equal height */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
                    {filteredClients.map(client => (
                        // Make each card a flex container that grows to fill the grid cell
                        <div key={client.id} className="bg-white shadow-md flex flex-col border rounded-lg overflow-hidden shadow-sm">
                            <div className="p-4 border-b">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-lg">{client.first_name} {client.last_name}</h3>
                                    {client.urgency_score && client.urgency_score > 0 ? <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(client.urgency_score ?? 0)}`}
                                    >
                                        Score: {client.urgency_score}/10
                                    </span> : ""}
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-600">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    <span>{client.time_since_submission?.split(" ")[0]} days since submition</span>
                                </div>
                            </div>

                            {/*
                              Updated risk factors section: iterates over riskMapping
                              and displays only risks that are true as "High Alert"
                            */}
                            <div className="p-4 bg-gray-50 flex-1">
                                <h4 className="font-medium mb-2">Risk Factors:</h4>
                                <div className="space-y-1">
                                    {riskMapping.filter(risk => client[risk.key as keyof Client]).map(risk => (
                                        <div key={risk.key} className="flex items-center text-sm">
                                            <AlertTriangle className="w-4 h-4 mr-1 text-red-500" />
                                            <span> <strong>{risk.label}</strong></span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 border-t bg-white">
                                <div className="flex flex-col gap-2 text-sm">
                                    <div className="flex items-center">
                                        <Mail className="w-4 h-4 mr-2 text-gray-500" />
                                        <a href={`mailto:${client.email}`} className="text-blue-600 hover:underline">{client.email}</a>
                                    </div>
                                    <div className="flex items-center">
                                        <PhoneCall className="w-4 h-4 mr-2 text-gray-500" />
                                        <a href={`tel:${client.phone_number}`} className="text-blue-600 hover:underline">{client.phone_number}</a>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t bg-gray-50">
                                <div className="flex justify-between">
                                    <Button
                                        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center text-sm"
                                        onClick={() => acceptClient(client.id ?? "0")}
                                        isLoading={moveLoading}
                                    >
                                        <UserPlus className="w-4 h-4 mr-1" />
                                        Move to waiting list
                                    </Button>
                                    <Button
                                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                                        onClick={() => router.push(`/intake/${client.id}`)}
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default withAuth(
    withPermissions(ClientsPage, {
        redirectUrl: Routes.Common.NotFound,
        requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permission
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);
