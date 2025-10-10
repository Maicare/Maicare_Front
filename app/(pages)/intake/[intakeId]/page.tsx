"use client";
import { useRouter } from "next/navigation";
import { PermissionsObjects } from "@/common/data/permission.data";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import React, { useState, useEffect } from "react";
import Loader from "@/components/common/loader";
import { useIntake } from "@/hooks/intake/use-intake";
import { useParams } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import Button from "@/components/common/Buttons/Button";
import { GuardianDetailsType, IntakeFormType } from "@/types/intake.types";

const ClientPage = () => {
    const router = useRouter();
    const params = useParams();
    const intakeId = params?.intakeId?.toString();

    const { readOne, isLoading, updateUrgency } = useIntake({});
    const [intake, setIntake] = useState<IntakeFormType | null>(null);
    const [urgencyScore, setUrgencyScore] = useState<number>(0);
    const [urgencyLoading, setUrgencyLoading] = useState<boolean>(false);

    useEffect(() => {
        if (intakeId) {
            const fetchIntake = async () => {
                const response = await readOne(intakeId);
                console.log("Opgehaalde intake:", response);
                setIntake(response as unknown as IntakeFormType);
                // initialiseer urgentie score van opgehaalde intake
                setUrgencyScore((response as unknown as IntakeFormType).urgency_score || 0);
            };
            fetchIntake();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [intakeId]);

    if (isLoading || !intake) {
        return <Loader />;
    }

    const handleUpdateUrgency = async () => {
        try {
            console.log(`Bijwerken urgentie score naar ${urgencyScore} voor intake ID ${intake.id}`);
            setUrgencyLoading(true);
            await updateUrgency(intake.id!, urgencyScore);
            setUrgencyLoading(false);
        } catch (error) {
            console.error("Fout bij bijwerken urgentie score:", error);
            setUrgencyLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">
            {/* Terug Knop */}
            <Button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                onClick={() => router.push('/intake')}
            >
                Terug
            </Button>

            <h1 className="text-3xl font-bold mb-4">
                Intake Details voor {intake.first_name} {intake.last_name}
            </h1>

            {/* Persoonlijke Informatie */}
            <div className="bg-white shadow rounded p-6">
                <h2 className="text-xl font-semibold mb-3">Persoonlijke Informatie</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <strong>Geboortedatum:</strong>
                        <p>{new Date(intake.date_of_birth).toLocaleDateString("nl-NL")}</p>
                    </div>
                    <div>
                        <strong>Nationaliteit:</strong>
                        <p>{intake.nationality}</p>
                    </div>
                    <div>
                        <strong>BSN:</strong>
                        <p>{intake.bsn}</p>
                    </div>
                    <div>
                        <strong>Geslacht:</strong>
                        <p>{intake.gender}</p>
                    </div>
                </div>
            </div>

            {/* Contact & Adres Informatie */}
            <div className="bg-white shadow rounded p-6">
                <h2 className="text-xl font-semibold mb-3">Contact & Adres</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <strong>Adres:</strong>
                        <p>{intake.address}</p>
                    </div>
                    <div>
                        <strong>Stad:</strong>
                        <p>{intake.city}</p>
                    </div>
                    <div>
                        <strong>Postcode:</strong>
                        <p>{intake.postal_code}</p>
                    </div>
                    <div>
                        <strong>Telefoonnummer:</strong>
                        <p>{intake.phone_number}</p>
                    </div>
                    <div className="sm:col-span-2">
                        <strong>E-mail:</strong>
                        <p>{intake.email}</p>
                    </div>
                </div>
            </div>

            {/* Aanbieder & Doorverwijzing info */}
            <div className="bg-white shadow rounded p-6">
                <h2 className="text-xl font-semibold mb-3">Aanbieder & Doorverwijzing</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <strong>Naam Doorverwijzer:</strong>
                        <p>{intake.referrer_name}</p>
                    </div>
                    <div>
                        <strong>Organisatie Doorverwijzer:</strong>
                        <p>{intake.referrer_organization}</p>
                    </div>
                    <div>
                        <strong>Functie Doorverwijzer:</strong>
                        <p>{intake.referrer_function}</p>
                    </div>
                    <div>
                        <strong>Telefoon Doorverwijzer:</strong>
                        <p>{intake.referrer_phone}</p>
                    </div>
                    <div className="sm:col-span-2">
                        <strong>E-mail Doorverwijzer:</strong>
                        <p>{intake.referrer_email}</p>
                    </div>
                </div>
            </div>

            {/* Registratie & Zorg Details */}
            <div className="bg-white shadow rounded p-6">
                <h2 className="text-xl font-semibold mb-3">Registratie & Zorg Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <strong>Registratie Type:</strong>
                        <p>{intake.registration_type}</p>
                    </div>
                    <div>
                        <strong>Reden Registratie:</strong>
                        <p>{intake.registration_reason}</p>
                    </div>
                    <div>
                        <strong>Wet Type:</strong>
                        <p>{intake.law_type}</p>
                    </div>
                    <div>
                        <strong>Startdatum Indicatie:</strong>
                        <p>{new Date(intake.indication_start_date).toLocaleDateString("nl-NL")}</p>
                    </div>
                    <div>
                        <strong>Einddatum Indicatie:</strong>
                        <p>{new Date(intake.indication_end_date).toLocaleDateString("nl-NL")}</p>
                    </div>
                </div>
            </div>

            {/* Voogd Details */}
            {intake.guardian_details && intake.guardian_details.length > 0 && (
                <div className="bg-white shadow rounded p-6">
                    <h2 className="text-xl font-semibold mb-3">Voogd Details</h2>
                    {intake.guardian_details.map((guardian: GuardianDetailsType, index: number) => (
                        <div key={index} className="border-b last:border-0 pb-2 mb-2">
                            <p>
                                <strong>
                                    {guardian.first_name} {guardian.last_name}
                                </strong>
                            </p>
                            <p>
                                <strong>Telefoon:</strong> {guardian.phone_number}
                            </p>
                            <p>
                                <strong>E-mail:</strong> {guardian.email}
                            </p>
                            <p>
                                <strong>Adres:</strong> {guardian.address}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Risico's */}
            <div className="bg-white shadow rounded p-6">
                <h2 className="text-xl font-semibold mb-3">Risco Factoren</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {intake.risk_self_harm && (
                        <div>
                            <AlertTriangle className="w-5 h-5 inline-block text-red-500 mr-1" />
                            <span>Zelfbeschadiging: Hoog Alarm</span>
                        </div>
                    )}
                    {intake.risk_weapon_possession && (
                        <div>
                            <AlertTriangle className="w-5 h-5 inline-block text-red-500 mr-1" />
                            <span>Wapenbezit: Hoog Alarm</span>
                        </div>
                    )}
                    {intake.risk_drug_dealing && (
                        <div>
                            <AlertTriangle className="w-5 h-5 inline-block text-red-500 mr-1" />
                            <span>Drugshandel: Hoog Alarm</span>
                        </div>
                    )}
                    {intake.risk_aggression && (
                        <div>
                            <AlertTriangle className="w-5 h-5 inline-block text-red-500 mr-1" />
                            <span>Agressie: Hoog Alarm</span>
                        </div>
                    )}
                    {intake.risk_suicidality && (
                        <div>
                            <AlertTriangle className="w-5 h-5 inline-block text-red-500 mr-1" />
                            <span>Suïcidaliteit: Hoog Alarm</span>
                        </div>
                    )}
                    {intake.risk_running_away && (
                        <div>
                            <AlertTriangle className="w-5 h-5 inline-block text-red-500 mr-1" />
                            <span>Weglopen: Hoog Alarm</span>
                        </div>
                    )}
                </div>
                {intake.other_risks && (
                    <div className="mt-2">
                        <strong>Andere Risico&apos;s:</strong>
                        <p>{intake.other_risks}</p>
                    </div>
                )}
            </div>

            {/* Urgentie Score Update */}
            <div className="bg-white shadow rounded p-6">
                <h2 className="text-xl font-semibold mb-3">Urgentie Score</h2>
                <div className="flex flex-col space-y-2">
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={urgencyScore}
                        onChange={(e) => setUrgencyScore(Number(e.target.value))}
                        className="w-full"
                    />
                    <p>Huidige urgentie: {urgencyScore}/10</p>
                    <Button
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={handleUpdateUrgency}
                        isLoading={urgencyLoading}
                    >
                        Urgentie Score Bijwerken
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default withAuth(
    withPermissions(ClientPage, {
        redirectUrl: Routes.Common.NotFound,
        requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Voeg correcte permissie toe
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);