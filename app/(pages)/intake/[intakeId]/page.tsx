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
import ModalActionButton from "@/components/common/Buttons/ModalActionButton";
import { Dialog } from "@headlessui/react";
import InputControl from "@/common/components/InputControl";
import SelectControlled from "@/common/components/SelectControlled";
import FormCombobox from "@/common/components/Combobox";
import { useContact } from "@/hooks/contact/use-contact";
import { useLocation } from "@/hooks/location/use-location";
import { FormProvider, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { User, Phone, MapPin, BookOpen, ShieldAlert, Users, Calendar, ClipboardList, FileCheck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Reusable info row
const InfoRow = ({ label, value }: { label: string; value: string | React.ReactNode }) => (
    <div className="flex items-center w-full py-2.5 border-b border-slate-100 dark:border-strokedark last:border-b-0">
        <p className="w-[40%] text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-800 dark:text-white">{value || '-'}</p>
    </div>
);

// Reusable card
const DetailCard = ({ icon: Icon, title, subtitle, children, className = "", delay = 0 }: {
    icon: React.ElementType;
    title: string;
    subtitle: string;
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        className={`w-full rounded-2xl border border-white/20 bg-white/70 backdrop-blur-md shadow-xl dark:border-strokedark dark:bg-boxdark/80 ${className} hover:shadow-2xl transition-shadow duration-300`}
    >
        <div className="border-b border-stroke/50 px-6 py-5 dark:border-strokedark/50">
            <h3 className="flex items-center gap-3 font-bold text-slate-800 dark:text-white text-lg">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Icon size={20} />
                </div>
                {title}
            </h3>
            <p className="mt-1 text-xs text-slate-400 font-medium tracking-wide uppercase">{subtitle}</p>
        </div>
        <div className="px-6 py-5">
            {children}
        </div>
    </motion.div>
);

const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
        scheduled: { label: "Gepland", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
        completed: { label: "Voltooid", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
        cancelled: { label: "Geannuleerd", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
        pending: { label: "In Afwachting", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
        in_progress: { label: "Bezig", className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300" },
    };
    const badge = map[status] || { label: status || "Onbekend", className: "bg-gray-100 text-gray-800" };
    return <span className={`px-2.5 py-0.5 rounded-sm text-xs font-medium ${badge.className}`}>{badge.label}</span>;
};

// ============================================================
// STEP 1: Intake Form (POST /intake_form)
// ============================================================
type IntakeCreationForm = {
    date_of_intake: string;
    care_type: string;
    intake_participants: string[];
    family_situation: string;
    psychological_state: string;
    self_sufficiency: number;
    goals: string;
    risk_assessment: string;
    intake_conclusion: string;
    intake_conclusion_notes: string;
    signature: string;
};

// ============================================================
// STEP 2: Outcome Form
// ============================================================
type OutcomeForm = {
    outcome: string;
    urgency_level: string;
    report_summary: string;
    risk_assessment: string;
    // client_details for accepted
    client_gender: string;
    client_date_of_birth: string;
    client_living_situation: string;
    client_bsn_number: string;
    client_first_name: string;
    client_last_name: string;
    client_phone_number: string;
    client_email: string;
    source: string;
    filenumber: string;
    sender_id: string;
    location_id: string;
};

const IntakeDetailPage = () => {
    const router = useRouter();
    const params = useParams();
    const intakeId = params?.intakeId?.toString();

    const { readOne, isLoading, sendIntakeForm, updateIntakeOutcome } = useIntake({});
    const [intake, setIntake] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const { contacts } = useContact(searchTerm); // Fetch contacts for the Sender dropdown with search
    const [processing, setProcessing] = useState(false);
    const [showIntakeModal, setShowIntakeModal] = useState(false);
    const [showOutcomeModal, setShowOutcomeModal] = useState(false);
    const [selectedOutcome, setSelectedOutcome] = useState<string>("");
    const { locations: availableLocations } = useLocation({ autoFetch: true });

    const intakeMethods = useForm<IntakeCreationForm>({
        defaultValues: {
            date_of_intake: "",
            care_type: "",
            intake_participants: [],
            family_situation: "",
            psychological_state: "",
            self_sufficiency: 3,
            goals: "",
            risk_assessment: "",
            intake_conclusion: "",
            intake_conclusion_notes: "",
            signature: "",
        }
    });

    const outcomeMethods = useForm<OutcomeForm>({
        defaultValues: {
            outcome: "",
            urgency_level: "medium",
            report_summary: "",
            risk_assessment: "",
            client_gender: "",
            client_date_of_birth: "",
            client_living_situation: "",
            client_bsn_number: "",
            client_first_name: "",
            client_last_name: "",
            client_phone_number: "",
            client_email: "",
            source: "",
            filenumber: "",
            sender_id: "",
            location_id: "",
        }
    });

    const watchedOutcome = outcomeMethods.watch("outcome");

    useEffect(() => {
        if (intakeId) {
            const fetchIntake = async () => {
                const response = await readOne(intakeId);
                setIntake(response);
                // Pre-fill outcome form with client data from intake
                if (response) {
                    const r = response as any;
                    outcomeMethods.reset({
                        outcome: "",
                        urgency_level: "medium",
                        report_summary: "",
                        risk_assessment: "",
                        client_gender: r.client_gender || "",
                        client_date_of_birth: r.application_date || "",
                        client_living_situation: "",
                        client_bsn_number: r.client_bsn_number || "",
                        client_first_name: r.client_first_name || "",
                        client_last_name: r.client_last_name || "",
                        client_phone_number: r.client_phone_number || "",
                        client_email: r.client_email || "",
                        source: "intake_form",
                        filenumber: "",
                        sender_id: "",
                        location_id: "",
                    });
                }
            };
            fetchIntake();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [intakeId]);

    if (isLoading || !intake) {
        return <Loader />;
    }

    // Determine which step we're on based on intake status
    const isIntakeCompleted = intake.status === "completed";
    const hasIntakeConclusion = intake.intake_conclusion && intake.intake_conclusion !== "";

    const handleCreateIntake = async (data: IntakeCreationForm) => {
        setProcessing(true);
        try {
            const payload = {
                registration_form_id: intake.registration_form_id,
                date_of_intake: dayjs(data.date_of_intake).toISOString(),
                care_type: data.care_type,
                intake_participants: data.intake_participants,
                family_situation: data.family_situation,
                psychological_state: data.psychological_state,
                self_sufficiency: Number(data.self_sufficiency),
                goals: data.goals,
                risk_assessment: data.risk_assessment,
                intake_conclusion: data.intake_conclusion,
                intake_conclusion_notes: data.intake_conclusion_notes,
                signature: data.signature,
            };
            await sendIntakeForm(payload);
            setShowIntakeModal(false);
            // Refresh
            const updated = await readOne(intakeId!);
            setIntake(updated);
        } catch (error) {
            console.error("Failed to create intake", error);
        } finally {
            setProcessing(false);
        }
    };

    const handleOutcomeSubmit = async (data: OutcomeForm) => {
        if (!intake.id) return;
        setProcessing(true);
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let payload: any = {
                outcome: data.outcome,
                report_summary: data.report_summary,
            };

            if (data.outcome === "accepted") {
                payload = {
                    ...payload,
                    urgency_level: data.urgency_level,
                    risk_assessment: data.risk_assessment,
                    client_details: {
                        gender: data.client_gender,
                        date_of_birth: data.client_date_of_birth,
                        living_situation: data.client_living_situation,
                        bsn_number: data.client_bsn_number,
                        first_name: data.client_first_name,
                        last_name: data.client_last_name,
                        phone_number: data.client_phone_number,
                        email: data.client_email,
                        source: data.source,
                        filenumber: data.filenumber,
                        sender_id: data.sender_id || undefined,
                        location_id: data.location_id ? Number(data.location_id) : undefined,
                    }
                };
            }

            await updateIntakeOutcome(intake.id, payload);
            setShowOutcomeModal(false);
            // Refresh
            const updated = await readOne(intakeId!);
            setIntake(updated);
        } catch (error) {
            console.error("Failed to update outcome", error);
        } finally {
            setProcessing(false);
        }
    };

    const renderBoolean = (val: boolean | null | undefined) => val ? "Ja" : "Nee";

    return (
        <div className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Intake Details</h1>
                <p className="text-sm">Dashboard / <span className="font-medium text-indigo-500 hover:cursor-pointer" onClick={() => router.push('/intake')}>Intakes</span> / <span className="font-medium text-indigo-500">Details</span></p>
            </div>

            {/* Status Banner */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full rounded-2xl border border-primary/20 bg-gradient-to-r from-white to-primary/5 shadow-lg dark:from-boxdark dark:to-primary/10 px-8 py-6"
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute -inset-1 rounded-full bg-primary/20 animate-pulse"></div>
                            {getStatusBadge(intake.status)}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
                                {intake.client_first_name} {intake.client_last_name}
                            </h2>
                            <p className="text-sm text-slate-400 flex items-center gap-1">
                                <MapPin size={14} /> Intake traject
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Step 1: Show "Intake Uitvoeren" if intake hasn't been completed yet */}
                        {!hasIntakeConclusion && (
                            <ModalActionButton onClick={() => setShowIntakeModal(true)} actionType="CONFIRM" className="rounded-xl px-6 py-2.5 shadow-primary/20 hover:shadow-primary/40 transition-all font-semibold">
                                <ClipboardList size={18} className="mr-2 inline" />
                                Intake Uitvoeren
                            </ModalActionButton>
                        )}
                        {/* Step 2: Show outcome buttons only after intake is completed */}
                        {hasIntakeConclusion && !isIntakeCompleted && (
                            <div className="flex flex-wrap gap-2">
                                <ModalActionButton onClick={() => { setSelectedOutcome("rejected"); outcomeMethods.setValue("outcome", "rejected"); setShowOutcomeModal(true); }} actionType="DANGER" className="rounded-xl px-5 font-semibold">
                                    Afwijzen
                                </ModalActionButton>
                                <ModalActionButton onClick={() => { setSelectedOutcome("further_investigation"); outcomeMethods.setValue("outcome", "further_investigation"); setShowOutcomeModal(true); }} actionType="CANCEL" className="rounded-xl px-5 font-semibold">
                                    Nader Onderzoek
                                </ModalActionButton>
                                <ModalActionButton onClick={() => { setSelectedOutcome("accepted"); outcomeMethods.setValue("outcome", "accepted"); setShowOutcomeModal(true); }} actionType="CONFIRM" className="rounded-xl px-6 font-semibold shadow-primary/20 hover:shadow-primary/40 transition-all">
                                    <FileCheck size={18} className="mr-2 inline" />
                                    Accepteren
                                </ModalActionButton>
                            </div>
                        )}
                        {isIntakeCompleted && (
                            <div className="flex items-center gap-2 text-green-500 font-medium bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full border border-green-200 dark:border-green-800/30">
                                <FileCheck size={16} />
                                <span className="text-sm">Intake is succesvol afgerond.</span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Detail Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-2">
                <DetailCard delay={0.1} icon={User} title="Cliënt Informatie" subtitle="Persoonlijke gegevens van de cliënt">
                    <InfoRow label="Naam" value={`${intake.client_first_name || ''} ${intake.client_last_name || ''}`} />
                    <InfoRow label="BSN" value={intake.client_bsn_number} />
                    <InfoRow label="Geslacht" value={intake.client_gender} />
                    <InfoRow label="Nationaliteit" value={intake.client_nationality} />
                    <InfoRow label="Aanmeldingsdatum" value={dayjs(intake.application_date).format("DD-MM-YYYY")} />
                </DetailCard>

                <DetailCard delay={0.2} icon={Phone} title="Contactgegevens" subtitle="Contactinformatie van de cliënt">
                    <InfoRow label="E-mailadres" value={intake.client_email} />
                    <InfoRow label="Telefoonnummer" value={intake.client_phone_number} />
                    <InfoRow label="Straat" value={`${intake.client_street || ''} ${intake.client_house_number || ''}`} />
                    <InfoRow label="Postcode" value={intake.client_postal_code} />
                    <InfoRow label="Stad" value={intake.client_city} />
                </DetailCard>

                <DetailCard delay={0.3} icon={MapPin} title="Verwijzer Informatie" subtitle="Informatie over de verwijzende instantie">
                    <InfoRow label="Naam" value={`${intake.referrer_first_name || ''} ${intake.referrer_last_name || ''}`} />
                    <InfoRow label="Organisatie" value={intake.referrer_organization} />
                    <InfoRow label="Functie" value={intake.referrer_job_title} />
                    <InfoRow label="Telefoonnummer" value={intake.referrer_phone_number} />
                    <InfoRow label="E-mailadres" value={intake.referrer_email} />
                </DetailCard>

                <DetailCard delay={0.4} icon={Users} title="Voogd 1" subtitle="Gegevens van de eerste voogd / ouder">
                    <InfoRow label="Naam" value={`${intake.guardian1_first_name || ''} ${intake.guardian1_last_name || ''}`} />
                    <InfoRow label="Relatie" value={intake.guardian1_relationship} />
                    <InfoRow label="Telefoonnummer" value={intake.guardian1_phone_number} />
                    <InfoRow label="E-mailadres" value={intake.guardian1_email} />
                </DetailCard>

                {intake.guardian2_first_name && (
                    <DetailCard delay={0.5} icon={Users} title="Voogd 2" subtitle="Gegevens van de tweede voogd / ouder">
                        <InfoRow label="Naam" value={`${intake.guardian2_first_name} ${intake.guardian2_last_name}`} />
                        <InfoRow label="Relatie" value={intake.guardian2_relationship} />
                        <InfoRow label="Telefoonnummer" value={intake.guardian2_phone_number} />
                        <InfoRow label="E-mailadres" value={intake.guardian2_email} />
                    </DetailCard>
                )}

                <DetailCard delay={0.6} icon={BookOpen} title="Onderwijs & Werk" subtitle="Onderwijs- en werkinformatie">
                    <InfoRow label="Inschrijving" value={renderBoolean(intake.education_currently_enrolled)} />
                    <InfoRow label="Niveau" value={typeof intake.education_level === 'object' ? intake.education_level?.client_education_level_enum : intake.education_level} />
                    <InfoRow label="Instelling" value={intake.education_institution} />
                    <InfoRow label="Mentor" value={intake.education_mentor_name} />
                    <InfoRow label="In dienst" value={renderBoolean(intake.work_currently_employed)} />
                    <InfoRow label="Werkgever" value={intake.work_current_employer} />
                </DetailCard>

                {/* Intake Results Card - only shows after intake is performed */}
                {hasIntakeConclusion && (
                    <DetailCard delay={0.7} icon={Calendar} title="Intake Resultaten" subtitle="Resultaten van de uitgevoerde intake">
                        <InfoRow label="Intakedatum" value={intake.date_of_intake ? dayjs(intake.date_of_intake).format("DD-MM-YYYY HH:mm") : '-'} />
                        <InfoRow label="Zorgtype" value={intake.care_type || '-'} />
                        <InfoRow label="Gezinssituatie" value={intake.family_situation || '-'} />
                        <InfoRow label="Psychologische Staat" value={intake.psychological_state || '-'} />
                        <InfoRow label="Zelfredzaamheid" value={intake.self_sufficiency !== null && intake.self_sufficiency !== undefined ? `${intake.self_sufficiency}/5` : '-'} />
                        <InfoRow label="Doelen" value={intake.goals || '-'} />
                        <InfoRow label="Conclusie" value={intake.intake_conclusion || '-'} />
                        <InfoRow label="Notities" value={intake.intake_conclusion_notes || '-'} />
                    </DetailCard>
                )}

                <DetailCard delay={0.8} icon={ShieldAlert} title="Zorgbehoeften & Risico's" subtitle="Zorgbehoeften en risicofactoren" className="md:col-span-2 xl:col-span-1">
                    <div className="flex flex-wrap gap-2 mb-4 pt-1">
                        {intake.care_protected_living && <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200/50">Beschermd Wonen</span>}
                        {intake.care_assisted_independent_living && <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200/50">Begeleid Zelfstandig Wonen</span>}
                        {intake.care_room_training_center && <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200/50">Kamer Trainingscentrum</span>}
                        {intake.care_ambulatory_guidance && <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200/50">Ambulante Begeleiding</span>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {intake.risk_aggressive_behavior && <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-lg dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200/50">Agressief gedrag</span>}
                        {intake.risk_suicidal_selfharm && <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-lg dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200/50">Suïcidaal / Zelfbeschadiging</span>}
                        {intake.risk_substance_abuse && <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-lg dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200/50">Middelenmisbruik</span>}
                        {intake.risk_psychiatric_issues && <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-lg dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200/50">Psychiatrische problemen</span>}
                        {intake.risk_criminal_history && <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-lg dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200/50">Crimineel verleden</span>}
                        {intake.risk_flight_behavior && <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-lg dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200/50">Vluchtgedrag</span>}
                        {intake.risk_weapon_possession && <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-lg dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200/50">Wapenbezit</span>}
                        {intake.risk_sexual_behavior && <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-lg dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200/50">Seksueel gedrag</span>}
                        {intake.risk_day_night_rhythm && <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-lg dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200/50">Verstoord dag/nacht ritme</span>}
                        {intake.risk_other && <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-lg dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200/50">Overig: {intake.risk_other_description}</span>}
                    </div>
                    {intake.risk_additional_notes && (
                        <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-tighter mb-1">Aanvullende Notities</h5>
                            <p className="text-sm text-slate-600 dark:text-slate-300 italic">{intake.risk_additional_notes}</p>
                        </div>
                    )}
                </DetailCard>
            </div>

            {/* ====================================================== */}
            {/* MODAL: Step 1 — Create Intake (POST /intake_form) */}
            {/* ====================================================== */}
            <AnimatePresence>
                {(showIntakeModal || showOutcomeModal) && (
                    <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm transition-opacity" />
                )}
            </AnimatePresence>

            <Dialog
                open={showIntakeModal}
                onClose={() => setShowIntakeModal(false)}
                className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-2xl rounded-3xl bg-white p-8 dark:bg-boxdark shadow-2xl overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/50 to-primary" />

                    <Dialog.Panel className="max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
                        <Dialog.Title className="text-2xl font-black text-slate-800 dark:text-white mb-1">
                            Intake Uitvoeren
                        </Dialog.Title>
                        <p className="text-sm text-slate-400 mb-8">Vul de details van het intakegesprek in om door te gaan.</p>

                        <FormProvider {...intakeMethods}>
                            <form onSubmit={intakeMethods.handleSubmit(handleCreateIntake)} className="text-left flex flex-col gap-5">
                                <InputControl name="date_of_intake" label="Datum van Intake" type="datetime-local" required />
                                <SelectControlled
                                    name="care_type"
                                    label="Zorgtype"
                                    options={[
                                        { label: "Selecteer zorgtype", value: "" },
                                        { label: "Beschermd Wonen", value: "protected_living" },
                                        { label: "Trainingscentrum", value: "training_center" },
                                        { label: "Begeleid Zelfstandig Wonen", value: "supported_independent_living" },
                                        { label: "Ambulante Begeleiding", value: "ambulatory_support" },
                                        { label: "Anders", value: "other" },
                                    ]}
                                    required
                                />
                                <div className="mb-4">
                                    <label className="mb-2.5 block font-medium text-black dark:text-white">Deelnemers Intake</label>
                                    <div className="flex flex-col gap-2">
                                        {[
                                            { value: 'client', label: 'Cliënt' },
                                            { value: 'referrer', label: 'Verwijzer' },
                                            { value: 'parents/guardians', label: 'Ouders / Voogden' },
                                            { value: 'care_coordinator', label: 'Zorgcoördinator' },
                                            { value: 'other', label: 'Anders' }
                                        ].map(participant => (
                                            <label key={participant.value} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    value={participant.value}
                                                    {...intakeMethods.register("intake_participants")}
                                                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                />
                                                <span className="text-sm text-slate-700 dark:text-slate-300">
                                                    {participant.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <SelectControlled
                                    name="family_situation"
                                    label="Gezinssituatie"
                                    options={[
                                        { label: "Selecteer gezinssituatie", value: "" },
                                        { label: "Alleenstaand", value: "single" },
                                        { label: "Getrouwd", value: "married" },
                                        { label: "Gescheiden", value: "divorced" },
                                        { label: "Weduwe/Weduwnaar", value: "widowed" },
                                        { label: "Uit elkaar", value: "separated" },
                                        { label: "Samenwonend", value: "cohabiting" },
                                        { label: "Anders", value: "other" },
                                        { label: "Niet gespecificeerd", value: "not_specified" },
                                    ]}
                                />
                                <SelectControlled
                                    name="psychological_state"
                                    label="Psychologische Staat"
                                    options={[
                                        { label: "Selecteer psychologische staat", value: "" },
                                        { label: "Stabiel", value: "stable" },
                                        { label: "Angstig", value: "anxious" },
                                        { label: "Depressief", value: "depressed" },
                                        { label: "Gestrest", value: "stressed" },
                                        { label: "Getraumatiseerd", value: "traumatized" },
                                        { label: "In crisis / Directe zorg nodig", value: "in_crisis" },
                                        { label: "Kritiek / Ernstige psychische nood", value: "critical" },
                                        { label: "Verbeterend", value: "improving" },
                                        { label: "Onder evaluatie", value: "under_evaluation" },
                                        { label: "Niet gespecificeerd", value: "not_specified" },
                                    ]}
                                />
                                <div>
                                    <label className="mb-2.5 block font-medium text-black dark:text-white">Zelfredzaamheid (0-5)</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="5"
                                        {...intakeMethods.register("self_sufficiency")}
                                        className="w-full"
                                    />
                                    <p className="text-sm text-slate-400 mt-1">Score: {intakeMethods.watch("self_sufficiency")}/5</p>
                                </div>
                                <InputControl name="goals" label="Doelen" type="text" placeholder="bijv. Verbetering sociale vaardigheden" />
                                <InputControl name="risk_assessment" label="Risicobeoordeling" type="text" placeholder="bijv. Laag risico" />
                                <SelectControlled
                                    name="intake_conclusion"
                                    label="Intake Conclusie"
                                    options={[
                                        { label: "Selecteer conclusie", value: "" },
                                        { label: "Geschikt voor zorg", value: "suitable" },
                                        { label: "Niet geschikt voor zorg", value: "unsuitable" },
                                        { label: "Nader onderzoek nodig", value: "further_investigation" },
                                        { label: "Mogelijke plaatsingsdatum", value: "possible_palcement_date" },
                                        { label: "Anders", value: "other" },
                                    ]}
                                    required
                                />
                                <InputControl name="intake_conclusion_notes" label="Conclusie Notities" type="text" placeholder="bijv. Cliënt past goed bij het programma" />
                                <InputControl name="signature" label="Handtekening" type="text" placeholder="bijv. Ondertekend door intakecoördinator" />

                                <div className="-mx-3 flex flex-wrap gap-y-4 justify-center mt-4">
                                    <div className="w-full px-3 2xsm:w-1/2 flex">
                                        <ModalActionButton onClick={() => setShowIntakeModal(false)} actionType="CANCEL" className="w-full" type="button">Annuleren</ModalActionButton>
                                    </div>
                                    <div className="w-full px-3 2xsm:w-1/2">
                                        <ModalActionButton actionType="CONFIRM" className="w-full" type="submit" isLoading={processing} loadingText="Bezig...">Intake Opslaan</ModalActionButton>
                                    </div>
                                </div>
                            </form>
                        </FormProvider>
                    </Dialog.Panel>
                </motion.div>
            </Dialog>

            {/* MODAL: Step 2 — Outcome (PUT /intake_form/{id}/outcome) */}
            <Dialog
                open={showOutcomeModal}
                onClose={() => setShowOutcomeModal(false)}
                className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="relative w-full max-w-2xl rounded-3xl bg-white p-8 dark:bg-boxdark shadow-2xl overflow-hidden"
                >
                    <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${selectedOutcome === 'accepted' ? 'from-green-400 to-green-600' : selectedOutcome === 'rejected' ? 'from-red-400 to-red-600' : 'from-amber-400 to-amber-600'}`} />

                    <Dialog.Panel className="max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
                        <Dialog.Title className="text-2xl font-black text-slate-800 dark:text-white mb-1">
                            {selectedOutcome === "accepted" && "Cliënt Accepteren"}
                            {selectedOutcome === "rejected" && "Intake Afwijzen"}
                            {selectedOutcome === "further_investigation" && "Nader Onderzoek"}
                        </Dialog.Title>
                        <p className="text-sm text-slate-400 mb-8">Bevestig de uitkomst van het intake-traject.</p>

                        <FormProvider {...outcomeMethods}>
                            <form onSubmit={outcomeMethods.handleSubmit(handleOutcomeSubmit)} className="text-left flex flex-col gap-5">
                                <InputControl name="report_summary" label="Rapportage Samenvatting" type="text" placeholder="Samenvatting van de beslissing" required />

                                {/* Only show detailed fields for acceptance */}
                                {watchedOutcome === "accepted" && (
                                    <>
                                        <SelectControlled
                                            name="urgency_level"
                                            label="Urgentieniveau"
                                            options={[
                                                { label: "Laag", value: "low" },
                                                { label: "Gemiddeld", value: "medium" },
                                                { label: "Hoog", value: "high" },
                                                { label: "Kritiek", value: "critical" },
                                            ]}
                                            required
                                        />
                                        <InputControl name="risk_assessment" label="Risicobeoordeling" type="text" placeholder="bijv. Laag risico" />

                                        <div className="border-t border-stroke dark:border-strokedark pt-4 mt-2">
                                            <h4 className="font-bold text-slate-800 dark:text-white mb-3">Cliëntgegevens (wordt aangemaakt als Cliënt)</h4>
                                            <div className="flex flex-col gap-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <InputControl name="client_first_name" label="Voornaam" type="text" required />
                                                    <InputControl name="client_last_name" label="Achternaam" type="text" required />
                                                </div>
                                                <InputControl name="client_email" label="E-mailadres" type="email" required />
                                                <InputControl name="client_phone_number" label="Telefoonnummer" type="text" required />
                                                <InputControl name="client_bsn_number" label="BSN Nummer" type="text" required />
                                                <InputControl name="client_date_of_birth" label="Geboortedatum" type="date" required />
                                                <SelectControlled
                                                    name="client_gender"
                                                    label="Geslacht"
                                                    options={[
                                                        { label: "Selecteer", value: "" },
                                                        { label: "Man", value: "male" },
                                                        { label: "Vrouw", value: "female" },
                                                        { label: "Anders", value: "other" },
                                                        { label: "Niet gespecificeerd", value: "not_specified" },
                                                    ]}
                                                    required
                                                />
                                                <SelectControlled
                                                    name="client_living_situation"
                                                    label="Woonsituatie"
                                                    options={[
                                                        { label: "Selecteer", value: "" },
                                                        { label: "Thuis", value: "home" },
                                                        { label: "Pleegzorg", value: "foster_care" },
                                                        { label: "Jeugdzorginstelling", value: "youth_care_institution" },
                                                        { label: "Anders", value: "other" },
                                                    ]}
                                                    required
                                                />
                                                <InputControl name="source" label="Bron (Source)" type="text" placeholder="bijv. intake_form" />
                                                <InputControl name="filenumber" label="Dossiernummer (File Number)" type="text" />
                                                <FormCombobox
                                                    id="sender_id"
                                                    label="Zender / Verwijzer (Sender)"
                                                    value={outcomeMethods.watch("sender_id")}
                                                    onChange={(val: string) => outcomeMethods.setValue("sender_id", val)}
                                                    handleQueryChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                                    options={(contacts?.results || []).map((c: any) => ({
                                                        label: c.name || "Onbekend",
                                                        value: { id: String(c.id), name: c.name || "Onbekend" }
                                                    }))}
                                                    displayValue={(val: any) => val?.name || ""}
                                                    renderOption={(option: any) => option.label}
                                                />
                                                <FormCombobox
                                                    id="location_id"
                                                    label="Locatie (Location)"
                                                    value={outcomeMethods.watch("location_id")}
                                                    onChange={(val: string) => outcomeMethods.setValue("location_id", val)}
                                                    handleQueryChange={() => { }} // Simple array filter handled by locations hook usually, but here we just show what's loaded
                                                    options={(availableLocations || []).map((l: any) => ({
                                                        label: l.name || "Onbekend",
                                                        value: { id: String(l.id), name: l.name || "Onbekend" }
                                                    }))}
                                                    displayValue={(val: any) => val?.name || ""}
                                                    renderOption={(option: any) => option.label}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="-mx-3 flex flex-wrap gap-y-4 justify-center mt-4">
                                    <div className="w-full px-3 2xsm:w-1/2 flex">
                                        <ModalActionButton onClick={() => setShowOutcomeModal(false)} actionType="CANCEL" className="w-full" type="button">Annuleren</ModalActionButton>
                                    </div>
                                    <div className="w-full px-3 2xsm:w-1/2">
                                        <ModalActionButton
                                            actionType={selectedOutcome === "rejected" ? "DANGER" : "CONFIRM"}
                                            className="w-full"
                                            type="submit"
                                            isLoading={processing}
                                            loadingText="Bezig..."
                                        >
                                            {selectedOutcome === "accepted" && "Accepteren & Cliënt Aanmaken"}
                                            {selectedOutcome === "rejected" && "Afwijzen"}
                                            {selectedOutcome === "further_investigation" && "Nader Onderzoek Instellen"}
                                        </ModalActionButton>
                                    </div>
                                </div>
                            </form>
                        </FormProvider>
                    </Dialog.Panel>
                </motion.div>
            </Dialog>
        </div>
    );
};

export default withAuth(
    withPermissions(IntakeDetailPage, {
        redirectUrl: Routes.Common.NotFound,
        requiredPermissions: PermissionsObjects.ViewEmployee,
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);
