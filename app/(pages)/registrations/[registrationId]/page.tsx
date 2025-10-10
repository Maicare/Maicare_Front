"use client"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    ArrowLeft,
    Mail,
    Phone,
    Home,
    School,
    Shield,
    AlertTriangle,
    FileText,
    User,
    ClipboardList,
    XCircle,
    Edit,
    Calendar,
    AlertCircle
} from "lucide-react"
import { Registration } from "@/types/registration.types"
import { useParams, useRouter } from "next/navigation"
import { useRegistration } from "@/hooks/registration/use-registration"
import { useEffect, useState } from "react"
import { Id } from "@/common/types/types"
import { ViewRegistrationSkeleton } from "./_components/view-registration-skeleton"
import LargeErrorMessage from "@/components/common/Alerts/LargeErrorMessage"
import PrimaryButton from "@/common/components/PrimaryButton"
import { AcceptRegistrationDialog } from "./_components/accept-registration-dialog"
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth"
import withPermissions from "@/common/hocs/with-permissions"
import Routes from "@/common/routes"
import { PermissionsObjects } from "@/common/data/permission.data"

function ReregistrationView() {
    const router = useRouter();
    const { registrationId } = useParams();
    const { readOne, updateStatus } = useRegistration({ autoFetch: false });
    const [registration, setRegistration] = useState<Registration | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [isStatusLoading, setStatusIsLoading] = useState(false);

    useEffect(() => {
        const fetchRegistration = async (id: Id) => {
            setIsLoading(true);
            const data = await readOne(id);
            setRegistration(data);
            setIsLoading(false);
        }
        if (registrationId) fetchRegistration(+registrationId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [registrationId, isStatusLoading]);

    if (isLoading) {
        return <ViewRegistrationSkeleton />
    }
    if (!registration) {
        return (
            <LargeErrorMessage
                firstLine="Aanmelding Niet Gevonden"
                secondLine="De opgevraagde aanmelding kon niet worden gevonden."
            />
        )
    }

    // Status badge color
    const statusColor = {
        pending: "bg-amber-100 text-amber-800",
        approved: "bg-green-100 text-green-800",
        rejected: "bg-red-100 text-red-800",
    }[registration.form_status] || "bg-gray-100 text-gray-800"

    // Risk factors
    const riskFactors = [
        { name: "Agressief gedrag", value: registration.risk_aggressive_behavior },
        { name: "Strafblad", value: registration.risk_criminal_history },
        { name: "Psychiatrische problemen", value: registration.risk_psychiatric_issues },
        { name: "Verslavingsproblematiek", value: registration.risk_substance_abuse },
        { name: "Suïcidaal/zelfbeschadigend gedrag", value: registration.risk_suicidal_selfharm },
        { name: "Wapenbezit", value: registration.risk_weapon_possession },
        { name: "Seksueel grensoverschrijdend gedrag", value: registration.risk_sexual_behavior },
        { name: "Vluchtgedrag", value: registration.risk_flight_behavior },
        { name: "Dag-nachtritme", value: registration.risk_day_night_rhythm },
        { name: "Overig", value: registration.risk_other, description: registration.risk_other_description },
    ].filter(factor => factor.value)

    // Care types
    const careTypes = [
        { name: "Ambulante Begeleiding", value: registration.care_ambulatory_guidance, color: "bg-purple-100 text-purple-800" },
        { name: "Begeleid Zelfstandig Wonen", value: registration.care_assisted_independent_living, color: "bg-blue-100 text-blue-800" },
        { name: "Beschermd Wonen", value: registration.care_protected_living, color: "bg-green-100 text-green-800" },
        { name: "Trainingscentrum", value: registration.care_room_training_center, color: "bg-amber-100 text-amber-800" },
    ].filter(type => type.value)

    const handleUpdateStatus = async (date: string,location:string,type:string) => {
        try {
            setStatusIsLoading(true);
            await updateStatus(registration.id,{status:"approved",date,location,type}, { displaySuccess: true, displayProgress: true });
        } catch (error) {
            console.log(error);
        } finally {
            setStatusIsLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <Button variant="outline" onClick={() => { router.back() }} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Terug naar aanmeldingen
            </Button>

            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {registration.client_first_name} {registration.client_last_name}
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge className={statusColor}>
                            {registration.form_status === 'pending' && 'In afwachting'}
                            {registration.form_status === 'approved' && 'Goedgekeurd'}
                            {registration.form_status === 'rejected' && 'Afgewezen'}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                            Aangemeld op {new Date(registration.application_date).toLocaleDateString('nl-NL')}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <PrimaryButton
                        text="Bewerken"
                        icon={Edit}
                        onClick={() => router.push(`/registrations/${registration.id}/update`)}
                        animation="animate-bounce"
                    />
                    <AcceptRegistrationDialog
                        isStatusLoading={isStatusLoading}
                        handleAcceptRegistration={handleUpdateStatus}
                    />

                    <PrimaryButton
                        text="Afwijzen"
                        animation="animate-bounce"
                        icon={XCircle}
                        disabled={isStatusLoading}
                        className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={async () => {
                            try {
                                setStatusIsLoading(true);
                                await updateStatus(registration.id, {status:"rejected"}, { displaySuccess: true, displayProgress: true });
                            } catch (error) {
                                console.log(error);
                            } finally {
                                setStatusIsLoading(false);
                            }
                        }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Client Information */}
                    <Card className="border-2 border-blue-100">
                        <CardHeader className="bg-blue-50">
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-blue-600" />
                                Cliëntinformatie
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="bg-white grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Volledige Naam</h3>
                                <p>{registration.client_first_name} {registration.client_last_name}</p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-muted-foreground">BSN-nummer</h3>
                                <p>{registration.client_bsn_number}</p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Geslacht</h3>
                                <p>{registration.client_gender}</p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Nationaliteit</h3>
                                <p>{registration.client_nationality}</p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Contact</h3>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    <span>{registration.client_email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    <span>{registration.client_phone_number}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Adres</h3>
                                <div className="flex items-center gap-2">
                                    <Home className="h-4 w-4" />
                                    <span>
                                        {registration.client_street} {registration.client_house_number}<br />
                                        {registration.client_postal_code} {registration.client_city}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <h3 className="text-sm font-medium text-muted-foreground">Doelen Cliënt</h3>
                                <p className="whitespace-pre-line">{registration.client_goals}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Care Information */}
                    <Card className="border-2 border-purple-100">
                        <CardHeader className="bg-purple-50">
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-purple-600" />
                                Zorginformatie
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="bg-white pt-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Gevraagde Zorgvormen</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {careTypes.map((type, index) => (
                                            <Badge key={index} className={type.color}>
                                                {type.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium text-muted-foreground">Reden van Aanmelding</h3>
                                    <p className="whitespace-pre-line">{registration.application_reason}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Risk Assessment */}
                    {riskFactors.length > 0 && (
                        <Card className="border-2 border-red-100">
                            <CardHeader className="bg-red-50">
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                    Risico-inventarisatie ({registration.risk_count} factoren)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="bg-white pt-6">
                                <div className="space-y-2">
                                    {riskFactors.map((factor, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className="flex-shrink-0 h-5 w-5 text-red-500 mt-0.5">
                                                <AlertTriangle className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{factor.name}</p>
                                                {factor.description && (
                                                    <p className="text-sm text-muted-foreground">{factor.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {registration.risk_additional_notes && (
                                        <div className="mt-4 space-y-1">
                                            <h3 className="text-sm font-medium text-muted-foreground">Aanvullende Opmerkingen</h3>
                                            <p className="whitespace-pre-line">{registration.risk_additional_notes}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    <Card className="border-2 border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="bg-purple-50 rounded-t-lg">
                            <CardTitle className="flex items-center gap-2 text-purple-800">
                                <Shield className="h-5 w-5 text-purple-600" />
                                Wettelijk Vertegenwoordiger
                            </CardTitle>
                            <CardDescription className="text-purple-600">
                                Noodcontacten en wettelijk vertegenwoordigers
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="bg-white grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                            {/* Guardian 1 Section */}
                            <div className="space-y-4 p-4 bg-purple-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-purple-600" />
                                    <h3 className="font-medium text-purple-700">Primaire Vertegenwoordiger</h3>
                                </div>

                                {registration.guardian1_first_name ? (
                                    <>
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-medium text-purple-500">Volledige Naam</h4>
                                            <p className="font-medium">
                                                {registration.guardian1_first_name} {registration.guardian1_last_name}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="text-xs font-medium text-purple-500">Relatie</h4>
                                            <p>{registration.guardian1_relationship || 'Niet gespecificeerd'}</p>
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="text-xs font-medium text-purple-500">Contact</h4>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-purple-600" />
                                                <span>{registration.guardian1_phone_number || 'Niet opgegeven'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-purple-600" />
                                                <span>{registration.guardian1_email || 'Niet opgegeven'}</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-purple-500 italic">Geen informatie over primaire vertegenwoordiger</p>
                                )}
                            </div>

                            {/* Guardian 2 Section */}
                            <div className="space-y-4 p-4 bg-purple-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-purple-600" />
                                    <h3 className="font-medium text-purple-700">Secundaire Vertegenwoordiger</h3>
                                </div>

                                {registration.guardian2_first_name ? (
                                    <>
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-medium text-purple-500">Volledige Naam</h4>
                                            <p className="font-medium">
                                                {registration.guardian2_first_name} {registration.guardian2_last_name}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="text-xs font-medium text-purple-500">Relatie</h4>
                                            <p>{registration.guardian2_relationship || 'Niet gespecificeerd'}</p>
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="text-xs font-medium text-purple-500">Contact</h4>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-purple-600" />
                                                <span>{registration.guardian2_phone_number || 'Niet opgegeven'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-purple-600" />
                                                <span>{registration.guardian2_email || 'Niet opgegeven'}</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-purple-500 italic">Geen informatie over secundaire vertegenwoordiger</p>
                                )}
                            </div>

                            {/* Emergency Contact Note */}
                            <div className="md:col-span-2 p-3 bg-purple-100 rounded-lg flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-purple-700">
                                    Neem in geval van nood eerst contact op met de primaire vertegenwoordiger.
                                    Indien niet bereikbaar, contacteer de secundaire vertegenwoordiger.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Referrer Information */}
                    <Card className="border-2 border-green-100">
                        <CardHeader className="bg-green-50">
                            <CardTitle className="flex items-center gap-2">
                                <ClipboardList className="h-5 w-5 text-green-600" />
                                Informatie Verwijzer
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="bg-white pt-6 space-y-4">
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Verwijzer</h3>
                                <p>
                                    {registration.referrer_first_name} {registration.referrer_last_name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {registration.referrer_job_title}, {registration.referrer_organization}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Contact</h3>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    <span>{registration.referrer_email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    <span>{registration.referrer_phone_number}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Handtekening</h3>
                                <p>
                                    {registration.referrer_signature ? (
                                        <Badge className="bg-green-100 text-green-800">Ondertekend</Badge>
                                    ) : (
                                        <Badge variant="outline">Handtekening ontbreekt</Badge>
                                    )}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Education Information */}
                    <Card className="border-2 border-amber-100">
                        <CardHeader className="bg-amber-50">
                            <CardTitle className="flex items-center gap-2">
                                <School className="h-5 w-5 text-amber-600" />
                                Opleidingsinformatie
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="bg-white pt-6 space-y-4">
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Huidige Inschrijving</h3>
                                <p>
                                    {registration.education_currently_enrolled ? (
                                        <Badge className="bg-green-100 text-green-800">Ingeschreven</Badge>
                                    ) : (
                                        <Badge variant="outline">Niet ingeschreven</Badge>
                                    )}
                                </p>
                            </div>
                            {registration.education_level && (
                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium text-muted-foreground">Niveau</h3>
                                    <p>{registration.education_level}</p>
                                </div>
                            )}
                            {registration.education_institution && (
                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium text-muted-foreground">Opleidingsinstelling</h3>
                                    <p>{registration.education_institution}</p>
                                </div>
                            )}
                            {registration.education_mentor_name && (
                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium text-muted-foreground">Mentor</h3>
                                    <p>{registration.education_mentor_name}</p>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail className="h-4 w-4" />
                                        <span>{registration.education_mentor_email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Phone className="h-4 w-4" />
                                        <span>{registration.education_mentor_phone}</span>
                                    </div>
                                </div>
                            )}
                            {registration.education_additional_notes && (
                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium text-muted-foreground">Aanvullende Opmerkingen</h3>
                                    <p className="whitespace-pre-line">{registration.education_additional_notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    {/* Work Information */}
                    <Card className="border-2 border-yellow-100">
                        <CardHeader className="bg-yellow-50">
                            <CardTitle className="flex items-center gap-2">
                                <School className="h-5 w-5 text-yellow-600" />
                                Werkinformatie
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="bg-white pt-6 space-y-4">
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Huidige Werkzaamheden</h3>
                                <p>
                                    {registration.work_current_employer ? (
                                        <Badge className="bg-green-100 text-green-800">Werkzaam</Badge>
                                    ) : (
                                        <Badge variant="outline">Niet werkzaam</Badge>
                                    )}
                                </p>
                            </div>
                            {registration.work_current_position && (
                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium text-muted-foreground">Functie</h3>
                                    <p>{registration.work_current_position}</p>
                                </div>
                            )}
                            {registration.work_current_employer && (
                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium text-muted-foreground">Werkgever</h3>
                                    <p>{registration.work_current_employer}</p>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail className="h-4 w-4" />
                                        <span>{registration.work_employer_email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Phone className="h-4 w-4" />
                                        <span>{registration.work_employer_phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>{new Date(registration.work_start_date).toLocaleDateString('nl-NL')}</span>
                                    </div>
                                </div>
                            )}
                            {registration.work_additional_notes && (
                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium text-muted-foreground">Aanvullende Opmerkingen</h3>
                                    <p className="whitespace-pre-line">{registration.work_additional_notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Documents */}
                    <Card className="border-2 border-indigo-100">
                        <CardHeader className="bg-indigo-50">
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-indigo-600" />
                                Ingediende Documenten
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="bg-white pt-6">
                            <div className="space-y-3">
                                {(!registration.document_referral &&
                                    !registration.document_diagnosis &&
                                    !registration.document_education_report &&
                                    !registration.document_psychiatric_report &&
                                    !registration.document_action_plan &&
                                    !registration.document_safety_plan &&
                                    !registration.document_id_copy
                                ) && (
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-4 w-4 text-indigo-500" />
                                            <span>Geen Documenten Geüpload</span>
                                        </div>
                                    )}
                                {registration.document_diagnosis && (
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-indigo-500" />
                                        <span>Diagnoserapport</span>
                                    </div>
                                )}
                                {registration.document_education_report && (
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-indigo-500" />
                                        <span>Onderwijsrapport</span>
                                    </div>
                                )}
                                {registration.document_psychiatric_report && (
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-indigo-500" />
                                        <span>Psychiatrisch Rapport</span>
                                    </div>
                                )}
                                {registration.document_referral && (
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-indigo-500" />
                                        <span>Verwijzingsdocument</span>
                                    </div>
                                )}
                                {registration.document_action_plan && (
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-indigo-500" />
                                        <span>Actieplan</span>
                                    </div>
                                )}
                                {registration.document_safety_plan && (
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-indigo-500" />
                                        <span>Veiligheidsplan</span>
                                    </div>
                                )}
                                {registration.document_id_copy && (
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-indigo-500" />
                                        <span>Kopie Identiteitsbewijs</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="bg-white">
                            <Button variant="outline" className="w-full">
                                Alle Documenten Downloaden
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
export default withAuth(
    withPermissions(ReregistrationView, {
        redirectUrl: Routes.Common.NotFound,
        requiredPermissions: PermissionsObjects.ViewRegistrationForm,
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);