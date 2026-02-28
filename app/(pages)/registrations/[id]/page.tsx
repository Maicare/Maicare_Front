"use client";
import React, { useEffect, useState } from "react";
import { useRegistration } from "@/hooks/registration/use-registration";
import { Registration } from "@/types/registration.types";
import Loader from "@/components/common/loader";
import { useRouter, useParams } from "next/navigation";
import ModalActionButton from "@/components/common/Buttons/ModalActionButton";
import { useSnackbar } from "notistack";
import { Dialog } from "@headlessui/react";
import InputControl from "@/common/components/InputControl";
import { FormProvider, useForm } from "react-hook-form";
import SelectControlled from "@/common/components/SelectControlled";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import { InfoIcon, User, Phone, MapPin, BookOpen, ShieldAlert, Users, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ApprovalSchema = yup.object().shape({
    intake_appointment_date: yup.string().required("Intake datum is verplicht"),
    intake_appointment_location: yup.string().required("Intake locatie is verplicht"),
    admission_type: yup.string().oneOf(['crisis_admission', 'regular_placement'], "Ongeldig type opname").required("Type opname is verplicht")
});

type ApprovalFormType = {
    intake_appointment_date: string;
    intake_appointment_location: string;
    admission_type: "crisis_admission" | "regular_placement" | "";
};

// Reusable info row component
const InfoRow = ({ label, value }: { label: string; value: string | React.ReactNode }) => (
    <div className="flex items-center w-full py-2.5 border-b border-slate-100 dark:border-strokedark last:border-b-0">
        <p className="w-[40%] text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-800 dark:text-white">{value || '-'}</p>
    </div>
);

// Reusable card component
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

const RegistrationDetail = () => {
    const { readOne, updateRegistrationStatus } = useRegistration();
    const [registration, setRegistration] = useState<Registration | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
    const params = useParams();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    const id = params?.id as string;

    const methods = useForm<ApprovalFormType>({
        resolver: yupResolver(ApprovalSchema) as any,
        defaultValues: {
            intake_appointment_date: "",
            intake_appointment_location: "",
            admission_type: ""
        }
    });

    useEffect(() => {
        if (!id) return;
        const fetchRegistration = async () => {
            try {
                const data = await readOne(id);
                setRegistration(data);
            } catch (error) {
                console.error("Failed to fetch registration", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRegistration();
    }, [id]);

    const handleReject = async () => {
        if (!id) return;
        setProcessing(true);
        try {
            await updateRegistrationStatus(id, { status: "rejected" });
            const updated = await readOne(id);
            setRegistration(updated);
            enqueueSnackbar("Registration rejected", { variant: "info" });
        } catch (error) {
            console.error("Failed to update status", error);
        } finally {
            setProcessing(false);
        }
    };

    const handleApprove = async (data: ApprovalFormType) => {
        if (!id) return;
        setProcessing(true);
        try {
            await updateRegistrationStatus(id, {
                status: "approved",
                intake_appointment_date: dayjs(data.intake_appointment_date).toISOString(),
                intake_appointment_location: data.intake_appointment_location,
                admission_type: data.admission_type as "crisis_admission" | "regular_placement"
            });
            setIsApprovalModalOpen(false);
            const updated = await readOne(id);
            setRegistration(updated);
            enqueueSnackbar("Registration approved and Intake draft created.", { variant: "success" });
        } catch (error) {
            console.error("Failed to approve", error);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <Loader />;
    if (!registration) return <div>Registration not found</div>;

    const renderBoolean = (val: boolean | null | undefined) => val ? "Ja" : "Nee";

    return (
        <div className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Aanmeldingsdetails</h1>
                <p className="text-sm">Dashboard / <span className="font-medium text-indigo-500 hover:cursor-pointer" onClick={() => router.push('/registrations')}>Aanmeldingen</span> / <span className="font-medium text-indigo-500">Details</span></p>
            </div>

            {/* Status & Actions Banner */}
            {(() => {
                const bannerBaseClass = "w-full rounded-2xl border px-8 py-6 shadow-lg backdrop-blur-sm transition-all duration-300";
                switch (registration.status) {
                    case 'pending':
                    case 'in_review':
                        return (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`${bannerBaseClass} border-amber-200 bg-gradient-to-r from-white to-amber-50 dark:from-boxdark dark:to-amber-900/10`}
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="absolute -inset-1 rounded-full bg-amber-400/20 animate-pulse"></div>
                                            <span className="relative flex h-4 w-4 rounded-full bg-amber-500 shadow-sm border-2 border-white dark:border-boxdark"></span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">Actie Vereist: In Afwachting</h3>
                                            <p className="text-sm text-slate-400">Bekijk de gegevens en kies een actie.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <ModalActionButton onClick={handleReject} actionType="DANGER" isLoading={processing} className="rounded-xl px-6 font-semibold">Afwijzen</ModalActionButton>
                                        <ModalActionButton onClick={() => setIsApprovalModalOpen(true)} actionType="CONFIRM" isLoading={processing} className="rounded-xl px-6 font-semibold shadow-primary/20 hover:shadow-primary/40 transition-all">
                                            <Calendar size={18} className="mr-2 inline" />
                                            Goedkeuren &amp; Intake Inplannen
                                        </ModalActionButton>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    case 'approved':
                        return (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`${bannerBaseClass} border-green-200 bg-gradient-to-r from-white to-green-50 dark:from-boxdark dark:to-green-900/10`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">Goedgekeurd</h3>
                                        <p className="text-sm text-slate-400">Deze aanmelding is succesvol verwerkt en het intake traject is gestart.</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    case 'rejected':
                        return (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`${bannerBaseClass} border-red-200 bg-gradient-to-r from-white to-red-50 dark:from-boxdark dark:to-red-900/10`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600">
                                        <AlertCircle size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">Afgewezen</h3>
                                        <p className="text-sm text-slate-400">Deze aanmelding is definitief afgewezen en gesloten.</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    default:
                        return (
                            <div className={`${bannerBaseClass} border-indigo-200 bg-white dark:bg-boxdark`}>
                                <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-lg dark:bg-indigo-900/30 dark:text-indigo-400 capitalize whitespace-nowrap">{registration.status}</span>
                            </div>
                        );
                }
            })()}

            {/* Detail Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-2">
                <DetailCard delay={0.1} icon={User} title="Cliënt Informatie" subtitle="Persoonlijke gegevens van de cliënt">
                    <InfoRow label="Naam" value={`${registration.client_first_name} ${registration.client_last_name}`} />
                    <InfoRow label="BSN" value={registration.client_bsn_number} />
                    <InfoRow label="Geslacht" value={registration.client_gender} />
                    <InfoRow label="Nationaliteit" value={registration.client_nationality} />
                    <InfoRow label="Aanmeldingsdatum" value={dayjs(registration.application_date).format("DD-MM-YYYY")} />
                </DetailCard>

                <DetailCard delay={0.2} icon={Phone} title="Contactgegevens" subtitle="Contactinformatie van de cliënt">
                    <InfoRow label="E-mailadres" value={registration.client_email} />
                    <InfoRow label="Telefoonnummer" value={registration.client_phone_number} />
                    <InfoRow label="Straat" value={`${registration.client_street || ''} ${registration.client_house_number || ''}`} />
                    <InfoRow label="Postcode" value={registration.client_postal_code} />
                    <InfoRow label="Stad" value={registration.client_city} />
                </DetailCard>

                <DetailCard delay={0.3} icon={MapPin} title="Verwijzer Informatie" subtitle="Informatie over de verwijzende instantie">
                    <InfoRow label="Naam" value={`${registration.referrer_first_name || ''} ${registration.referrer_last_name || ''}`} />
                    <InfoRow label="Organisatie" value={registration.referrer_organization} />
                    <InfoRow label="Functie" value={registration.referrer_job_title} />
                    <InfoRow label="Telefoonnummer" value={registration.referrer_phone_number} />
                    <InfoRow label="E-mailadres" value={registration.referrer_email} />
                </DetailCard>

                <DetailCard delay={0.4} icon={Users} title="Voogd 1" subtitle="Gegevens van de eerste voogd / ouder">
                    <InfoRow label="Naam" value={`${registration.guardian1_first_name || ''} ${registration.guardian1_last_name || ''}`} />
                    <InfoRow label="Relatie" value={registration.guardian1_relationship} />
                    <InfoRow label="Telefoonnummer" value={registration.guardian1_phone_number} />
                    <InfoRow label="E-mailadres" value={registration.guardian1_email} />
                </DetailCard>

                {registration.guardian2_first_name && (
                    <DetailCard delay={0.5} icon={Users} title="Voogd 2" subtitle="Gegevens van de tweede voogd / ouder">
                        <InfoRow label="Naam" value={`${registration.guardian2_first_name} ${registration.guardian2_last_name}`} />
                        <InfoRow label="Relatie" value={registration.guardian2_relationship} />
                        <InfoRow label="Telefoonnummer" value={registration.guardian2_phone_number} />
                        <InfoRow label="E-mailadres" value={registration.guardian2_email} />
                    </DetailCard>
                )}

                <DetailCard delay={0.6} icon={BookOpen} title="Onderwijs & Werk" subtitle="Onderwijs- en werkinformatie">
                    <InfoRow label="Inschrijving" value={renderBoolean(registration.education_currently_enrolled)} />
                    <InfoRow label="Niveau" value={registration.education_level} />
                    <InfoRow label="Instelling" value={registration.education_institution} />
                    <InfoRow label="In dienst" value={renderBoolean(registration.work_currently_employed)} />
                    <InfoRow label="Werkgever" value={registration.work_current_employer} />
                </DetailCard>

                <DetailCard delay={0.7} icon={ShieldAlert} title="Zorgbehoeften & Risico's" subtitle="Zorgbehoeften en risicofactoren" className="md:col-span-2 xl:col-span-1">
                    <div className="flex flex-wrap gap-2 mb-4 pt-1">
                        {registration.care_protected_living && <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200/50">Beschermd Wonen</span>}
                        {registration.care_assisted_independent_living && <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200/50">Begeleid Zelfstandig Wonen</span>}
                        {registration.care_room_training_center && <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200/50">Kamer Trainingscentrum</span>}
                        {registration.care_ambulatory_guidance && <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200/50">Ambulante Begeleiding</span>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {registration.risk_aggressive_behavior && <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-lg dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200/50">Agressief gedrag</span>}
                        {registration.risk_suicidal_selfharm && <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-lg dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200/50">Suïcidaal / Zelfbeschadiging</span>}
                        {registration.risk_substance_abuse && <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-lg dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200/50">Middelenmisbruik</span>}
                        {registration.risk_psychiatric_issues && <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-lg dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200/50">Psychiatrische problemen</span>}
                        {registration.risk_criminal_history && <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-lg dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200/50">Crimineel verleden</span>}
                        {registration.risk_flight_behavior && <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-lg dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200/50">Vluchtgedrag</span>}
                        {registration.risk_weapon_possession && <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-lg dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200/50">Wapenbezit</span>}
                        {registration.risk_sexual_behavior && <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-lg dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200/50">Seksueel gedrag</span>}
                        {registration.risk_day_night_rhythm && <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-lg dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200/50">Verstoord dag/nacht ritme</span>}
                        {registration.risk_other && <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-lg dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200/50">Overig: {registration.risk_other_description}</span>}
                    </div>
                    {registration.risk_additional_notes && (
                        <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-tighter mb-1">Aanvullende Notities</h5>
                            <p className="text-sm text-slate-600 dark:text-slate-300 italic">{registration.risk_additional_notes}</p>
                        </div>
                    )}
                </DetailCard>
            </div>

            {/* Approval Modal — uses Dialog directly like ConfirmationModal */}
            <AnimatePresence>
                {isApprovalModalOpen && (
                    <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm transition-opacity" />
                )}
            </AnimatePresence>

            <Dialog
                open={isApprovalModalOpen}
                onClose={() => setIsApprovalModalOpen(false)}
                className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-xl rounded-3xl bg-white p-8 dark:bg-boxdark shadow-2xl overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/50 to-primary" />

                    <Dialog.Panel className="max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
                        <Dialog.Title className="text-2xl font-black text-slate-800 dark:text-white mb-1">
                            Aanmelding Goedkeuren
                        </Dialog.Title>
                        <p className="text-sm text-slate-400 mb-8">Voer de intake details in om de aanmelding goed te keuren.</p>

                        <FormProvider {...methods}>
                            <form onSubmit={methods.handleSubmit(handleApprove)} className="mb-10 text-left flex flex-col gap-5">
                                <InputControl
                                    name="intake_appointment_date"
                                    label="Intake Datum & Tijd"
                                    type="datetime-local"
                                    required
                                />
                                <InputControl
                                    name="intake_appointment_location"
                                    label="Intake Locatie"
                                    type="text"
                                    placeholder="bijv. Hoofdkantoor"
                                    required
                                />
                                <SelectControlled
                                    name="admission_type"
                                    label="Opname Type"
                                    options={[
                                        { label: "Selecteer opname type", value: "" },
                                        { label: "Reguliere Plaatsing", value: "regular_placement" },
                                        { label: "Crisisopname", value: "crisis_admission" }
                                    ]}
                                    required
                                />

                                <div className="-mx-3 flex flex-wrap gap-y-4 justify-center mt-4">
                                    <div className="w-full px-3 2xsm:w-1/2 flex">
                                        <ModalActionButton
                                            onClick={() => setIsApprovalModalOpen(false)}
                                            actionType="CANCEL"
                                            className="w-full"
                                            type="button"
                                        >
                                            Annuleren
                                        </ModalActionButton>
                                    </div>
                                    <div className="w-full px-3 2xsm:w-1/2">
                                        <ModalActionButton
                                            actionType="CONFIRM"
                                            className="w-full"
                                            type="submit"
                                            isLoading={processing}
                                            loadingText="Bezig..."
                                        >
                                            Goedkeuren
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

export default RegistrationDetail;
