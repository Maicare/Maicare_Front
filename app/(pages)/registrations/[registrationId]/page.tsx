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

// interface ReregistrationViewProps {
//   registration: Registration
//   onBack?: () => void
// }

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
                firstLine="Registration Not Found"
                secondLine="The requested registration could not be found."
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
        { name: "Aggressive behavior", value: registration.risk_aggressive_behavior },
        { name: "Criminal history", value: registration.risk_criminal_history },
        { name: "Psychiatric issues", value: registration.risk_psychiatric_issues },
        { name: "Substance abuse", value: registration.risk_substance_abuse },
        { name: "Suicidal/self-harm", value: registration.risk_suicidal_selfharm },
        { name: "Weapon possession", value: registration.risk_weapon_possession },
        { name: "Sexual behavior", value: registration.risk_sexual_behavior },
        { name: "Flight behavior", value: registration.risk_flight_behavior },
        { name: "Day/night rhythm", value: registration.risk_day_night_rhythm },
        { name: "Other", value: registration.risk_other, description: registration.risk_other_description },
    ].filter(factor => factor.value)

    // Care types
    const careTypes = [
        { name: "Ambulatory Guidance", value: registration.care_ambulatory_guidance, color: "bg-purple-100 text-purple-800" },
        { name: "Assisted Living", value: registration.care_assisted_independent_living, color: "bg-blue-100 text-blue-800" },
        { name: "Protected Living", value: registration.care_protected_living, color: "bg-green-100 text-green-800" },
        { name: "Training Center", value: registration.care_room_training_center, color: "bg-amber-100 text-amber-800" },
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
                Back to registrations
            </Button>

            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {registration.client_first_name} {registration.client_last_name}
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge className={statusColor}>
                            {registration.form_status}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                            Applied on {new Date(registration.application_date).toLocaleDateString()}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <PrimaryButton
                        text="Edit"
                        icon={Edit}
                        onClick={() => router.push(`/registrations/${registration.id}/update`)}
                        animation="animate-bounce"
                    />
                    <AcceptRegistrationDialog
                        isStatusLoading={isStatusLoading}
                        handleAcceptRegistration={handleUpdateStatus}
                    />

                    <PrimaryButton
                        text="Reject"
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
                                Client Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="bg-white grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                                <p>{registration.client_first_name} {registration.client_last_name}</p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-muted-foreground">BSN Number</h3>
                                <p>{registration.client_bsn_number}</p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Gender</h3>
                                <p>{registration.client_gender}</p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Nationality</h3>
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
                                <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                                <div className="flex items-center gap-2">
                                    <Home className="h-4 w-4" />
                                    <span>
                                        {registration.client_street} {registration.client_house_number}<br />
                                        {registration.client_postal_code} {registration.client_city}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <h3 className="text-sm font-medium text-muted-foreground">Client Goals</h3>
                                <p className="whitespace-pre-line">{registration.client_goals}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Care Information */}
                    <Card className="border-2 border-purple-100">
                        <CardHeader className="bg-purple-50">
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-purple-600" />
                                Care Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="bg-white pt-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Requested Care Types</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {careTypes.map((type, index) => (
                                            <Badge key={index} className={type.color}>
                                                {type.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium text-muted-foreground">Reregistration Reason</h3>
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
                                    Risk Assessment ({registration.risk_count} factors)
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
                                            <h3 className="text-sm font-medium text-muted-foreground">Additional Notes</h3>
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
                                Guardian Information
                            </CardTitle>
                            <CardDescription className="text-purple-600">
                                Emergency contacts and legal guardians
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="bg-white grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                            {/* Guardian 1 Section */}
                            <div className="space-y-4 p-4 bg-purple-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-purple-600" />
                                    <h3 className="font-medium text-purple-700">Primary Guardian</h3>
                                </div>

                                {registration.guardian1_first_name ? (
                                    <>
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-medium text-purple-500">Full Name</h4>
                                            <p className="font-medium">
                                                {registration.guardian1_first_name} {registration.guardian1_last_name}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="text-xs font-medium text-purple-500">Relationship</h4>
                                            <p>{registration.guardian1_relationship || 'Not specified'}</p>
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="text-xs font-medium text-purple-500">Contact</h4>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-purple-600" />
                                                <span>{registration.guardian1_phone_number || 'Not provided'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-purple-600" />
                                                <span>{registration.guardian1_email || 'Not provided'}</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-purple-500 italic">No primary guardian information provided</p>
                                )}
                            </div>

                            {/* Guardian 2 Section */}
                            <div className="space-y-4 p-4 bg-purple-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-purple-600" />
                                    <h3 className="font-medium text-purple-700">Secondary Guardian</h3>
                                </div>

                                {registration.guardian2_first_name ? (
                                    <>
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-medium text-purple-500">Full Name</h4>
                                            <p className="font-medium">
                                                {registration.guardian2_first_name} {registration.guardian2_last_name}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="text-xs font-medium text-purple-500">Relationship</h4>
                                            <p>{registration.guardian2_relationship || 'Not specified'}</p>
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="text-xs font-medium text-purple-500">Contact</h4>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-purple-600" />
                                                <span>{registration.guardian2_phone_number || 'Not provided'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-purple-600" />
                                                <span>{registration.guardian2_email || 'Not provided'}</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-purple-500 italic">No secondary guardian information provided</p>
                                )}
                            </div>

                            {/* Emergency Contact Note */}
                            <div className="md:col-span-2 p-3 bg-purple-100 rounded-lg flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-purple-700">
                                    In case of emergency, please contact the primary guardian first.
                                    If unavailable, contact the secondary guardian.
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
                                Referrer Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="bg-white pt-6 space-y-4">
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Referrer</h3>
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
                                <h3 className="text-sm font-medium text-muted-foreground">Signature</h3>
                                <p>
                                    {registration.referrer_signature ? (
                                        <Badge className="bg-green-100 text-green-800">Signed</Badge>
                                    ) : (
                                        <Badge variant="outline">Pending signature</Badge>
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
                                Education Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="bg-white pt-6 space-y-4">
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Current Enrollment</h3>
                                <p>
                                    {registration.education_currently_enrolled ? (
                                        <Badge className="bg-green-100 text-green-800">Currently enrolled</Badge>
                                    ) : (
                                        <Badge variant="outline">Not enrolled</Badge>
                                    )}
                                </p>
                            </div>
                            {registration.education_level && (
                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium text-muted-foreground">Level</h3>
                                    <p>{registration.education_level}</p>
                                </div>
                            )}
                            {registration.education_institution && (
                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium text-muted-foreground">Institution</h3>
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
                                    <h3 className="text-sm font-medium text-muted-foreground">Additional Notes</h3>
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
                                Work Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="bg-white pt-6 space-y-4">
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Current Employed</h3>
                                <p>
                                    {registration.work_current_employer ? (
                                        <Badge className="bg-green-100 text-green-800">Currently Employed</Badge>
                                    ) : (
                                        <Badge variant="outline">Not employed</Badge>
                                    )}
                                </p>
                            </div>
                            {registration.work_current_position && (
                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium text-muted-foreground">Position</h3>
                                    <p>{registration.work_current_position}</p>
                                </div>
                            )}
                            {registration.work_current_employer && (
                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium text-muted-foreground">Employer</h3>
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
                                        <span>{new Date(registration.work_start_date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            )}
                            {registration.work_additional_notes && (
                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium text-muted-foreground">Additional Notes</h3>
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
                                Submitted Documents
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
                                            <span>No Documents Uploaded</span>
                                        </div>
                                    )}
                                {registration.document_diagnosis && (
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-indigo-500" />
                                        <span>Diagnosis Report</span>
                                    </div>
                                )}
                                {registration.document_education_report && (
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-indigo-500" />
                                        <span>Education Report</span>
                                    </div>
                                )}
                                {registration.document_psychiatric_report && (
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-indigo-500" />
                                        <span>Psychiatric Report</span>
                                    </div>
                                )}
                                {registration.document_referral && (
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-indigo-500" />
                                        <span>Referral Document</span>
                                    </div>
                                )}
                                {registration.document_action_plan && (
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-indigo-500" />
                                        <span>Action Plan</span>
                                    </div>
                                )}
                                {registration.document_safety_plan && (
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-indigo-500" />
                                        <span>Safety Plan</span>
                                    </div>
                                )}
                                {registration.document_id_copy && (
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-indigo-500" />
                                        <span>ID Copy</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="bg-white">
                            <Button variant="outline" className="w-full">
                                Download All Documents
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
        requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permission
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);