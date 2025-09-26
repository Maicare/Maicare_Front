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
                console.log("Fetched intake:", response);
                setIntake(response as unknown as IntakeFormType);
                // initialize urgency score from fetched intake
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
            console.log(`Updating urgency score to ${urgencyScore} for intake ID ${intake.id}`);
            setUrgencyLoading(true);
            await updateUrgency(intake.id!, urgencyScore);
            setUrgencyLoading(false);
        } catch (error) {
            console.error("Error updating urgency score:", error);
            setUrgencyLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">
            {/* Back Button */}
            <Button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                onClick={() => router.push('/intake')}
            >
                Back
            </Button>

            <h1 className="text-3xl font-bold mb-4">
                Intake Details for {intake.first_name} {intake.last_name}
            </h1>

            {/* Personal Information */}
            <div className="bg-white shadow rounded p-6">
                <h2 className="text-xl font-semibold mb-3">Personal Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <strong>Date of Birth:</strong>
                        <p>{new Date(intake.date_of_birth).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <strong>Nationality:</strong>
                        <p>{intake.nationality}</p>
                    </div>
                    <div>
                        <strong>BSN:</strong>
                        <p>{intake.bsn}</p>
                    </div>
                    <div>
                        <strong>Gender:</strong>
                        <p>{intake.gender}</p>
                    </div>
                </div>
            </div>

            {/* Contact & Address Information */}
            <div className="bg-white shadow rounded p-6">
                <h2 className="text-xl font-semibold mb-3">Contact & Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <strong>Address:</strong>
                        <p>{intake.address}</p>
                    </div>
                    <div>
                        <strong>City:</strong>
                        <p>{intake.city}</p>
                    </div>
                    <div>
                        <strong>Postal Code:</strong>
                        <p>{intake.postal_code}</p>
                    </div>
                    <div>
                        <strong>Phone Number:</strong>
                        <p>{intake.phone_number}</p>
                    </div>
                    <div className="sm:col-span-2">
                        <strong>Email:</strong>
                        <p>{intake.email}</p>
                    </div>
                </div>
            </div>

            {/* Provider & Referral info */}
            <div className="bg-white shadow rounded p-6">
                <h2 className="text-xl font-semibold mb-3">Provider & Referral</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <strong>Referrer Name:</strong>
                        <p>{intake.referrer_name}</p>
                    </div>
                    <div>
                        <strong>Referrer Organization:</strong>
                        <p>{intake.referrer_organization}</p>
                    </div>
                    <div>
                        <strong>Referrer Function:</strong>
                        <p>{intake.referrer_function}</p>
                    </div>
                    <div>
                        <strong>Referrer Phone:</strong>
                        <p>{intake.referrer_phone}</p>
                    </div>
                    <div className="sm:col-span-2">
                        <strong>Referrer Email:</strong>
                        <p>{intake.referrer_email}</p>
                    </div>
                </div>
            </div>

            {/* Registration & Care Details */}
            <div className="bg-white shadow rounded p-6">
                <h2 className="text-xl font-semibold mb-3">Registration & Care Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <strong>Registration Type:</strong>
                        <p>{intake.registration_type}</p>
                    </div>
                    <div>
                        <strong>Registration Reason:</strong>
                        <p>{intake.registration_reason}</p>
                    </div>
                    <div>
                        <strong>Legal/Law Type:</strong>
                        <p>{intake.law_type}</p>
                    </div>
                    <div>
                        <strong>Indication Start Date:</strong>
                        <p>{new Date(intake.indication_start_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <strong>Indication End Date:</strong>
                        <p>{new Date(intake.indication_end_date).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            {/* Guardian Details */}
            {intake.guardian_details && intake.guardian_details.length > 0 && (
                <div className="bg-white shadow rounded p-6">
                    <h2 className="text-xl font-semibold mb-3">Guardian Details</h2>
                    {intake.guardian_details.map((guardian: GuardianDetailsType, index: number) => (
                        <div key={index} className="border-b last:border-0 pb-2 mb-2">
                            <p>
                                <strong>
                                    {guardian.first_name} {guardian.last_name}
                                </strong>
                            </p>
                            <p>
                                <strong>Phone:</strong> {guardian.phone_number}
                            </p>
                            <p>
                                <strong>Email:</strong> {guardian.email}
                            </p>
                            <p>
                                <strong>Address:</strong> {guardian.address}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Risks */}
            <div className="bg-white shadow rounded p-6">
                <h2 className="text-xl font-semibold mb-3">Risk Factors</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {intake.risk_self_harm && (
                        <div>
                            <AlertTriangle className="w-5 h-5 inline-block text-red-500 mr-1" />
                            <span>Self Harm: High Alert</span>
                        </div>
                    )}
                    {intake.risk_weapon_possession && (
                        <div>
                            <AlertTriangle className="w-5 h-5 inline-block text-red-500 mr-1" />
                            <span>Weapon Possession: High Alert</span>
                        </div>
                    )}
                    {intake.risk_drug_dealing && (
                        <div>
                            <AlertTriangle className="w-5 h-5 inline-block text-red-500 mr-1" />
                            <span>Drug Dealing: High Alert</span>
                        </div>
                    )}
                    {intake.risk_aggression && (
                        <div>
                            <AlertTriangle className="w-5 h-5 inline-block text-red-500 mr-1" />
                            <span>Aggression: High Alert</span>
                        </div>
                    )}
                    {intake.risk_suicidality && (
                        <div>
                            <AlertTriangle className="w-5 h-5 inline-block text-red-500 mr-1" />
                            <span>Suicidality: High Alert</span>
                        </div>
                    )}
                    {intake.risk_running_away && (
                        <div>
                            <AlertTriangle className="w-5 h-5 inline-block text-red-500 mr-1" />
                            <span>Running Away: High Alert</span>
                        </div>
                    )}
                </div>
                {intake.other_risks && (
                    <div className="mt-2">
                        <strong>Other Risks:</strong>
                        <p>{intake.other_risks}</p>
                    </div>
                )}
            </div>

            {/* Urgency Score Update */}
            <div className="bg-white shadow rounded p-6">
                <h2 className="text-xl font-semibold mb-3">Urgency Score</h2>
                <div className="flex flex-col space-y-2">
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={urgencyScore}
                        onChange={(e) => setUrgencyScore(Number(e.target.value))}
                        className="w-full"
                    />
                    <p>Current urgency: {urgencyScore}/10</p>
                    <Button
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={handleUpdateUrgency}
                        isLoading={urgencyLoading}
                    >
                        Update Urgency Score
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default withAuth(
    withPermissions(ClientPage, {
        redirectUrl: Routes.Common.NotFound,
        requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permission
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);
