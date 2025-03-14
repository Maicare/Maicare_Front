"use client";
import { PermissionsObjects } from "@/common/data/permission.data";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import React, { useState } from 'react';
import { Calendar, AlertTriangle, PhoneCall, Mail, UserPlus, ChevronDown } from 'lucide-react';
import { useIntake } from "@/hooks/intake/use-intake";
import Loader from "@/components/common/loader";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Buttons/Button";
import LargeErrorMessage from "@/components/common/Alerts/LargeErrorMessage";
import InputUncontrol from "@/common/components/InputUncontrol";

interface Intake {
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
    const [sortBy, setSortBy] = useState('urgency_score');
    const [search, setSearch] = useState('');
    const [moveLoading, setMoveLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const { intakes, isLoading, moveToWaitingList } = useIntake({
        autoFetch: true,
        sort_by: sortBy,
        search,
        page: currentPage
    });

    // Define mapping for risk flags to display label
    const riskMapping = [
        { key: 'risk_aggression', label: 'Agressie' },
        { key: 'risk_suicidality', label: 'Suïcidaliteit' },
        { key: 'risk_running_away', label: 'Weglopen' },
        { key: 'risk_self_harm', label: 'Zelfbeschadiging' },
        { key: 'risk_weapon_possession', label: 'Wapenbezit' },
        { key: 'risk_drug_dealing', label: 'Drugshandel' }
    ];

    const getUrgencyColor = (score: number): string => {
        if (score >= 8) return 'bg-red-100 text-red-800';
        if (score >= 5) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    const acceptClient = async (clientId: string) => {
        try {
            setMoveLoading(true);
            await moveToWaitingList(clientId);
            setMoveLoading(false);
        } catch (error) {
            setMoveLoading(false);
            console.error(error);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Intakebeheer</h1>
                {!isLoading && <p className="text-gray-600">
                    {intakes?.count} cliënten op de wachtlijst
                </p>}
            </div>

            <div className="flex flex-wrap gap-4 mb-6 flex justify-between items-center">
                <div className="flex items-center">
                    <InputUncontrol
                        placeholder="Zoek cliënten ..."
                        type="search"
                        className="min-w-60"
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                    />
                </div>

                <div className="relative z-20 flex justify-between items-center">
                    <label htmlFor="sortBy" className="mr-2 font-medium whitespace-nowrap">Sorteer op:</label>
                    <select
                        id="sortBy"
                        className="relative z-20 w-full appearance-none rounded-lg border border-stroke bg-white py-4 px-5 pr-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="created_at">Wachttijd</option>
                        <option value="urgency_score">Urgentiescore</option>
                    </select>
                    <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2 pointer-events-none">
                        <ChevronDown />
                    </span>
                </div>
            </div>

            <div className="rounded-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
                    {isLoading && (
                        <div className="col-span-full flex justify-center items-center">
                            <Loader />
                        </div>
                    )}
                    {!isLoading && (!intakes || intakes.results.length === 0) ? <LargeErrorMessage
                        firstLine={"Oeps!"}
                        secondLine={
                            "Het lijkt erop dat er geen inlaten zijn die voldoen aan uw zoekcriteria."
                        }
                    /> : ''}
                    {intakes && intakes.results.length > 0 && intakes.results.map(client => (
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
                                    <span>{client.time_since_submission?.split(" ")[0]} dagen sinds inzending</span>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 flex-1">
                                <h4 className="font-medium mb-2">Risicofactoren:</h4>
                                <div className="space-y-1">
                                    {riskMapping.filter(risk => client[risk.key as keyof Intake]).map(risk => (
                                        <div key={risk.key} className="flex items-center text-sm">
                                            <AlertTriangle className="w-4 h-4 mr-1 text-red-500" />
                                            <span><strong>{risk.label}</strong></span>
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
                                        onClick={() => acceptClient(client.id?.toString() ?? "0")}
                                        isLoading={moveLoading}
                                    >
                                        <UserPlus className="w-4 h-4 mr-1" />
                                        Verplaats naar wachtlijst
                                    </Button>
                                    <Button
                                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                                        onClick={() => router.push(`/intake/${client.id}`)}
                                    >
                                        Bekijk details
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center mt-6">
                <Button
                    className="px-4 py-2"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                >
                    Vorige
                </Button>
                <span>Pagina {currentPage}</span>
                <Button
                    className="px-4 py-2"
                    disabled={!intakes || !intakes.next}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                >
                    Volgende
                </Button>
            </div>
        </div>
    );
};

export default withAuth(
    withPermissions(ClientsPage, {
        redirectUrl: Routes.Common.NotFound,
        requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Voeg de correcte permissie toe
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);
