"use client";
import { Card, CardContent,  CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
    User, Mail, Phone, MapPin, Calendar, VenusAndMars, Building,
    Briefcase, HeartPulse,
    FileText, Clock, Users, 
    CheckCircle, XCircle,  ArrowRight,
    Home, Stethoscope, ClipboardList, BarChart3, TrendingUp,
    Activity, ShieldCheck, Bell, Settings, Search,  Star,  Target, 
    GraduationCap,
    AlertTriangle,
    DownloadIcon,
    EyeIcon,
    UploadIcon,
    Users2
} from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useClient } from '@/hooks/client/use-client';
import { Any, Id } from '@/common/types/types';
import { useReport } from '@/hooks/report/use-report';
import { useIncident } from '@/hooks/incident/use-incident';
import { useEmergencyContact } from '@/hooks/client-network/use-emergency-contact';
import {  Client, ClientStatusHistoryItem } from '@/types/client.types';
import { useDiagnosis } from '@/hooks/diagnosis/use-diagnosis';
import { useInvolvedEmployee } from '@/hooks/client-network/use-involved-employee';
import { useDocument } from '@/hooks/document/use-document';
import { DOCUMENT_LABEL_OPTIONS } from '@/consts';
import AddDocumentDialog from '../documents/_components/AddDocumentDialog';
import DeleteDocumentDialog from '../documents/_components/DeleteDocumentDialog';
import { formatDateToDutch } from '@/utils/timeFormatting';
import bytesToSize from '@/utils/sizeConverter';
import { AddressType } from '@/schemas/clientNew.schema';
import withAuth, { AUTH_MODE } from '@/common/hocs/with-auth';
import withPermissions from '@/common/hocs/with-permissions';
import Routes from '@/common/routes';
import { PermissionsObjects } from '@/common/data/permission.data';

interface Metric {
    label: string;
    value: string;
    change: number;
    icon: React.ReactNode;
    color: string;
}


const Page = () => {
    const { clientId } = useParams();
    const [activeTab, setActiveTab] = useState("overview");
    const [isLoading, setIsLoading] = useState(true);
    const { readOne, readClientAddresses, getStatusHistory } = useClient({ autoFetch: false });
    const [client, setClient] = useState<Client & {
        identity_attachment_ids: string[];
    } | null>(null);
    const { reports } = useReport({ clientId: clientId as string, autoFetch: true });
    const { incidents } = useIncident({ clientId: clientId as string, autoFetch: true });
    const { emergencyContacts } = useEmergencyContact({ clientId: String(clientId), autoFetch: true });
    const [addressesData, setAddressesData] = React.useState<AddressType[]>([]);
    const { diagnosis } = useDiagnosis({ clientId: clientId as string, autoFetch: true });
    const { involvedEmployees } = useInvolvedEmployee({ clientId: String(clientId) })
    const [statusHistory, setStatusHistory] = useState<ClientStatusHistoryItem[]>([]);

    const {
        isLoading: docsLoading,
        documents,
        createOne,
        deleteOne,
    } = useDocument({ autoFetch: true, clientId: clientId as string });

    // modal state + default label preselect
    const [docModalOpen, setDocModalOpen] = useState(false);
    const [defaultSelectedLabel, setDefaultSelectedLabel] = useState<string>("");


    useEffect(() => {
        const fetchClient = async (id: Id) => {
            setIsLoading(true);
            const data = await readOne(id);
            setClient(data);
            setIsLoading(false);
        }

        const fetchAddresses = async () => {
            setIsLoading(true);
            const response = await readClientAddresses(clientId as Id);
            const data = response;
            setAddressesData(data.addresses);
            setIsLoading(false);
        }

        const fetchStatusHistory = async (id: Id) => {
            setIsLoading(true);
            const response = await getStatusHistory(String(id));
            const data = response;
            setStatusHistory(data||[]);
            setIsLoading(false);
        }

        if (clientId) fetchAddresses();
        if (clientId) fetchClient(clientId as Id);
        if (clientId) fetchStatusHistory(clientId as Id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clientId]);

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleAddDocument = async (values: Any) => {
        try {
            const res = await createOne(values, {
                displayProgress: true,
                displaySuccess: true,
            });
            return res;
        } catch (e) {
            console.error(e);
        }
    };

    // download handler (uses backend file URL on doc.file)
    const handleDownloadDocument = async (doc: Any) => {
        try {
            const response = await fetch(doc.file);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = doc.label ? `${doc.label}.pdf` : "document.pdf";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
        }
    };

    // delete handler
    const handleDeleteDocument = async (attachment_uuid: string) => {
        const doc = documents?.results?.find(d => d.attachment_uuid === attachment_uuid);
        if (!doc) {
            alert("Document ongeldig");
            return;
        }
        await deleteOne(doc, { displayProgress: true, displaySuccess: true });
    };

    // derive uploaded vs required
    const uploaded = documents?.results ?? [];
    // const uploadedLabels = uploaded.map(d => d.label).filter(l => l !== "other");
    

    // Status color helper
    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'inactive': return 'bg-slate-100 text-slate-800 border-slate-200';
            case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'review': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    // Severity color helper
    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'low': return 'bg-emerald-100 text-emerald-800';
            case 'medium': return 'bg-amber-100 text-amber-800';
            case 'high': return 'bg-orange-100 text-orange-800';
            case 'critical': return 'bg-red-100 text-red-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    // Priority color helper
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-amber-100 text-amber-800';
            case 'low': return 'bg-emerald-100 text-emerald-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    // Availability color helper
    const getAvailabilityColor = (availability: string) => {
        switch (availability) {
            case 'available': return 'bg-emerald-100 text-emerald-800';
            case 'busy': return 'bg-amber-100 text-amber-800';
            case 'away': return 'bg-slate-100 text-slate-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    // Key metrics data
    const metrics: Metric[] = [
        {
            label: "Treatment Progress",
            value: "75%",
            change: +12,
            icon: <TrendingUp className="w-5 h-5" />,
            color: "text-emerald-600 bg-emerald-50"
        },
        {
            label: "Session Attendance",
            value: "92%",
            change: +5,
            icon: <Activity className="w-5 h-5" />,
            color: "text-blue-600 bg-blue-50"
        },
        {
            label: "Care Compliance",
            value: "88%",
            change: +8,
            icon: <ShieldCheck className="w-5 h-5" />,
            color: "text-violet-600 bg-violet-50"
        },
        {
            label: "Open Tasks",
            value: "3",
            change: -2,
            icon: <Target className="w-5 h-5" />,
            color: "text-amber-600 bg-amber-50"
        }
    ];
    // Helper functions
    const getEducationLevelColor = (level: string) => {
        const colors = {
            primary: "bg-blue-50 text-blue-700",
            secondary: "bg-green-50 text-green-700",
            higher: "bg-purple-50 text-purple-700",
            none: "bg-slate-50 text-slate-700"
        };
        return colors[level as keyof typeof colors] || "bg-slate-50 text-slate-700";
    };

    const getLivingSituationColor = (situation: string) => {
        const colors = {
            home: "bg-green-50 text-green-700",
            foster_care: "bg-amber-50 text-amber-700",
            youth_care_institution: "bg-blue-50 text-blue-700",
            other: "bg-slate-50 text-slate-700"
        };
        return colors[situation as keyof typeof colors] || "bg-slate-50 text-slate-700";
    };

    // Labels
    const educationLevelLabels = {
        primary: "Primary",
        secondary: "Secondary",
        higher: "Higher Education",
        none: "None"
    };

    const livingSituationLabels = {
        home: "Home",
        foster_care: "Foster Care",
        youth_care_institution: "Youth Care Institution",
        other: "Other"
    };

    // Mock data (replace with your actual data)
    // const mockWorkInfo = {
    //     work_currently_employed: true,
    //     work_current_employer: "Tech CompAny Inc.",
    //     work_current_position: "Software Developer",
    //     work_employer_email: "hr@techcompAny.com",
    //     work_employer_phone: "+31 20 123 4567",
    //     work_start_date: new Date("2023-01-15"),
    //     work_additional_notes: "Working remotely 3 days a week"
    // };

    // const mockEducationInfo = {
    //     education_currently_enrolled: true,
    //     education_institution: "University of Amsterdam",
    //     education_level: "higher",
    //     education_mentor_name: "Dr. Sarah Johnson",
    //     education_mentor_email: "s.johnson@uva.nl",
    //     education_mentor_phone: "+31 20 765 4321",
    //     education_additional_notes: "Specializing in Computer Science"
    // };

    const mockLivingSituation = {
        living_situation: "home",
        living_situation_notes: "Living with parents in Amsterdam"
    };
    // Helper functions
    const getIncidentSeverityColor = (severity: string) => {
        const colors = {
            "Low": "bg-green-50 text-green-700",
            "Medium": "bg-yellow-50 text-yellow-700",
            "High": "bg-orange-50 text-orange-700",
            "Critical": "bg-red-50 text-red-700"
        };
        return colors[severity as keyof typeof colors] || "bg-slate-50 text-slate-700";
    };

    // Mock incidents data based on your schema
    // const mockIncidents = [
    //     {
    //         id: "1",
    //         incident_type: "Physical Altercation",
    //         severity_of_incident: "High",
    //         incident_date: new Date("2024-01-15"),
    //         location_name: "Main Facility - Room 101",
    //         employee_name: "Sarah Johnson",
    //         physical_injury: "Minor injuries",
    //         psychological_damage: "Moderate distress",
    //         recurrence_risk: "Medium",
    //         needed_consultation: "Psychologist",
    //         incident_explanation: "Client became agitated during activity and engaged in physical aggression towards staff member.",
    //         incident_taken_measures: "Client was calmed down and moved to quiet room. Incident reported to supervisor.",
    //         accident: false,
    //         violence: true,
    //         self_harm: false,
    //         passing_away: false,
    //         use_prohibited_substances: false,
    //         fire_water_damage: false,
    //         client_absence: false,
    //         reporter_involvement: "Direct witness",
    //         runtime_incident: "15 minutes",
    //         inform_who: ["Supervisor", "Family"],
    //         client_options: ["Quiet room", "Medication review"]
    //     },
    //     {
    //         id: "2",
    //         incident_type: "Fall Accident",
    //         severity_of_incident: "Medium",
    //         incident_date: new Date("2024-01-12"),
    //         location_name: "Garden Area",
    //         employee_name: "Mike Chen",
    //         physical_injury: "Bruises and scrapes",
    //         psychological_damage: "Mild shock",
    //         recurrence_risk: "Low",
    //         needed_consultation: "Medical doctor",
    //         incident_explanation: "Client slipped on wet surface while walking in the garden area during rainy weather.",
    //         incident_taken_measures: "First aid applied, vital signs monitored, medical consultation requested.",
    //         accident: true,
    //         violence: false,
    //         self_harm: false,
    //         passing_away: false,
    //         use_prohibited_substances: false,
    //         fire_water_damage: false,
    //         client_absence: true,
    //         reporter_involvement: "First responder",
    //         runtime_incident: "Immediate",
    //         inform_who: ["Medical team", "Family"],
    //         client_options: ["Rest", "Pain management"]
    //     },
    //     {
    //         id: "3",
    //         incident_type: "Medication Incident",
    //         severity_of_incident: "Critical",
    //         incident_date: new Date("2024-01-10"),
    //         location_name: "Medication Room",
    //         employee_name: "Lisa Rodriguez",
    //         physical_injury: "Allergic reaction",
    //         psychological_damage: "Severe anxiety",
    //         recurrence_risk: "High",
    //         needed_consultation: "Emergency services",
    //         incident_explanation: "Client received incorrect medication dosage due to documentation error.",
    //         incident_taken_measures: "Emergency services called, antihistamines administered, incident reported to quality committee.",
    //         accident: true,
    //         violence: false,
    //         self_harm: false,
    //         passing_away: false,
    //         use_prohibited_substances: false,
    //         fire_water_damage: false,
    //         client_absence: false,
    //         reporter_involvement: "Medication administrator",
    //         runtime_incident: "30 minutes",
    //         inform_who: ["Emergency services", "Management", "Family"],
    //         client_options: ["Hospitalization", "Medication review"]
    //     },
    //     {
    //         id: "4",
    //         incident_type: "Verbal Aggression",
    //         severity_of_incident: "Medium",
    //         incident_date: new Date("2024-01-08"),
    //         location_name: "Common Room",
    //         employee_name: "David Kim",
    //         physical_injury: "None",
    //         psychological_damage: "Emotional distress",
    //         recurrence_risk: "Medium",
    //         needed_consultation: "Behavioral specialist",
    //         incident_explanation: "Client directed verbal abuse towards other residents during group activity.",
    //         incident_taken_measures: "Client removed from situation, de-escalation techniques applied, individual session scheduled.",
    //         accident: false,
    //         violence: true,
    //         self_harm: false,
    //         passing_away: false,
    //         use_prohibited_substances: false,
    //         fire_water_damage: false,
    //         client_absence: false,
    //         reporter_involvement: "Activity facilitator",
    //         runtime_incident: "10 minutes",
    //         inform_who: ["Behavioral team"],
    //         client_options: ["Time out", "Individual counseling"]
    //     }
    // ];
    // Helper functions
    const getReportTypeColor = (type: string) => {
        const colors = {
            "morning_report": "bg-amber-50 text-amber-700",
            "evening_report": "bg-indigo-50 text-indigo-700",
            "night_report": "bg-blue-50 text-blue-700",
            "shift_report": "bg-purple-50 text-purple-700",
            "one_to_one_report": "bg-green-50 text-green-700",
            "process_report": "bg-cyan-50 text-cyan-700",
            "contact_journal": "bg-orange-50 text-orange-700",
            "other": "bg-slate-50 text-slate-700"
        };
        return colors[type as keyof typeof colors] || "bg-slate-50 text-slate-700";
    };

    const getReportTypeLabel = (type: string) => {
        const labels = {
            "morning_report": "Ochtendrapport",
            "evening_report": "Avondrapport",
            "night_report": "Nachtrapport",
            "shift_report": "Tussenrapport",
            "one_to_one_report": "1 op 1 Rapportage",
            "process_report": "Procesrapportage",
            "contact_journal": "Contact Journal",
            "other": "Overige"
        };
        return labels[type as keyof typeof labels] || "Onbekend type";
    };

    const getEmotionalStateColor = (state: string) => {
        const colors = {
            "excited": "text-yellow-600",
            "happy": "text-green-600",
            "sad": "text-blue-600",
            "normal": "text-slate-600",
            "anxious": "text-orange-600",
            "depressed": "text-purple-600",
            "angry": "text-red-600"
        };
        return colors[state as keyof typeof colors] || "text-slate-400";
    };

    const getEmotionalStateEmoji = (state: string) => {
        const emojis = {
            "excited": "😃",
            "happy": "😊",
            "sad": "😢",
            "normal": "😐",
            "anxious": "😰",
            "depressed": "😞",
            "angry": "😡"
        };
        return emojis[state as keyof typeof emojis] || "❓";
    };

    const getEmotionalStateLabel = (state: string) => {
        const labels = {
            "excited": "Blij",
            "happy": "Gelukkig",
            "sad": "Verdrietig",
            "normal": "Normaal",
            "anxious": "Angstig",
            "depressed": "Depressief",
            "angry": "Boos"
        };
        return labels[state as keyof typeof labels] || "Niet gespecificeerd";
    };

    // Mock reports data
    // const mockReports = [
    //     {
    //         id: "1",
    //         date: "2024-01-15T14:30:00",
    //         emotional_state: "happy",
    //         employee_id: "emp1",
    //         report_text: "Client was very engaged in today's activities. Participated actively in group discussion and showed good progress in social skills. Enjoyed the outdoor walk and interacted well with peers.",
    //         type: "evening_report",
    //         employee_first_name: "Sarah",
    //         employee_last_name: "Johnson",
    //         employee_profile_picture: ""
    //     },
    //     {
    //         id: "2",
    //         date: "2024-01-15T09:15:00",
    //         emotional_state: "anxious",
    //         employee_id: "emp2",
    //         report_text: "Client seemed somewhat anxious this morning. Mentioned concerns about upcoming family visit. Supported client through breathing exercises and positive reinforcement. Will monitor throughout the day.",
    //         type: "morning_report",
    //         employee_first_name: "Mike",
    //         employee_last_name: "Chen",
    //         employee_profile_picture: ""
    //     },
    //     // {
    //     //     id: "3",
    //     //     date: "2024-01-14T16:45:00",
    //     //     emotional_state: "normal",
    //     //     employee_id: "emp3",
    //     //     report_text: "One-on-one session focused on coping strategies. Client discussed recent challenges and demonstrated good understanding of techniques learned. Agreed to practice mindfulness exercises daily.",
    //     //     type: "one_to_one_report",
    //     //     employee_first_name: "Lisa",
    //     //     employee_last_name: "Rodriguez",
    //     //     employee_profile_picture: ""
    //     // },
    //     // {
    //     //     id: "4",
    //     //     date: "2024-01-14T22:00:00",
    //     //     emotional_state: "sad",
    //     //     employee_id: "emp4",
    //     //     report_text: "Client had difficulty sleeping and expressed feelings of loneliness. Provided emotional support and compAny. Client eventually fell asleep around 23:30. Will inform day team about emotional state.",
    //     //     type: "night_report",
    //     //     employee_first_name: "David",
    //     //     employee_last_name: "Kim",
    //     //     employee_profile_picture: ""
    //     // },
    //     // {
    //     //     id: "5",
    //     //     date: "2024-01-14T12:00:00",
    //     //     emotional_state: "excited",
    //     //     employee_id: "emp1",
    //     //     report_text: "Mid-shift update: Client's mood improved significantly after phone call with family. Eagerly participated in art therapy session and created a beautiful painting. Good appetite during lunch.",
    //     //     type: "shift_report",
    //     //     employee_first_name: "Sarah",
    //     //     employee_last_name: "Johnson",
    //     //     employee_profile_picture: ""
    //     // }
    // ];
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-semibold text-slate-700">Loading Client Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
            {/* Enhanced Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-violet-600 rounded-full"></div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                Client Dashboard
                            </h1>
                        </div>
                        <p className="text-slate-600 ml-5">Comprehensive overview and management</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <Button variant="outline" size="icon">
                            <Bell className="w-5 h-5" />
                        </Button>
                        <Button variant="outline" size="icon">
                            <Settings className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Client Profile Header with Enhanced Design */}
                <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white overflow-hidden">
                    <div className="absolute inset-0 "></div>
                    <CardContent className="p-8 relative">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <Avatar className="w-24 h-24 border-4 border-white/20 shadow-2xl">
                                        <AvatarImage src={client?.profile_picture} />
                                        <AvatarFallback className="bg-white/20 text-white text-2xl font-bold backdrop-blur-sm">
                                            {client?.first_name[0]}{client?.last_name[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-2 -right-2">
                                        <Badge className="bg-emerald-500 border-2 border-white">
                                            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                                            Active
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold mb-2">
                                        {client?.first_name} {client?.last_name}
                                    </h2>
                                    <div className="flex items-center gap-6 text-white/80">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            {client?.email}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            {client?.phone_number}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {client?.date_of_birth}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
                                    <p className="text-white/80 text-sm">Filenummber</p>
                                    <p className="font-mono font-bold text-xl">#{client?.filenumber}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {metrics.map((metric, index) => (
                    <Card
                        key={metric.label}
                        className="border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer bg-white/80 backdrop-blur-sm"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600 mb-1">{metric.label}</p>
                                    <p className="text-2xl font-bold text-slate-900 mb-2">{metric.value}</p>
                                    <div className={`flex items-center gap-1 text-sm ${metric.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        <TrendingUp className={`w-4 h-4 ${metric.change < 0 ? 'rotate-180' : ''}`} />
                                        {metric.change >= 0 ? '+' : ''}{metric.change}%
                                    </div>
                                </div>
                                <div className={`p-3 rounded-xl ${metric.color}`}>
                                    {metric.icon}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Enhanced Main Dashboard */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-6 p-1 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm">
                    {[
                        { value: "overview", label: "Overview", icon: BarChart3 },
                        { value: "professional", label: "Professional", icon: Briefcase },
                        { value: "personal", label: "Personal", icon: User },
                        { value: "medical", label: "Medical", icon: Stethoscope },
                        { value: "care", label: "Care Team", icon: Users },
                        { value: "documents", label: "Documents", icon: FileText }
                    ].map(({ value, label, icon: Icon }) => (
                        <TabsTrigger
                            key={value}
                            value={value}
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* Enhanced Overview Tab */}
                <TabsContent value="overview" className="space-y-6 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {/* Enhanced Profile Card */}
                        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <User className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <CardTitle className="text-lg">Profile Information</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    {[
                                        { icon: Calendar, label: "Date of Birth", value: client?.date_of_birth },
                                        { icon: VenusAndMars, label: "Gender", value: client?.gender },
                                        { icon: MapPin, label: "Birthplace", value: client?.birthplace },
                                        { icon: Building, label: "Care Level", value: (client as Any)?.care_level || "N/A" },
                                        { icon: Star, label: "Status", value: client?.status },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                                <item.icon className="w-4 h-4 text-slate-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{item.label}</p>
                                                <p className="text-sm text-slate-600">{item.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {/* change status button */}
                                    <Button variant="secondary" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-2">
                                        Change Status
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Reports Card */}
                        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <CardTitle className="text-lg">Recent Reports</CardTitle>
                                    </div>
                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                        {reports.count}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {reports.count === 0 && (
                                    <div className="p-6 text-center bg-slate-50 rounded-lg border border-slate-200 h-full">
                                        <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                        <p className="text-slate-500 text-sm">No Current Reports</p>
                                    </div>
                                )}
                                {reports.results.map((report) => (
                                    <Card key={report.id} className="border-0 shadow-xs hover:shadow-md transition-all duration-300 hover:translate-x-1 border-l-4 border-l-blue-500">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-8 h-8 border-2 border-blue-200">
                                                        <AvatarImage src={report.employee_profile_picture} />
                                                        <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                                            {report.employee_first_name?.[0]}{report.employee_last_name?.[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h4 className="font-semibold text-sm text-slate-900">
                                                            {report.employee_first_name} {report.employee_last_name}
                                                        </h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge variant="secondary" className={getReportTypeColor(report.type)}>
                                                                {getReportTypeLabel(report.type)}
                                                            </Badge>
                                                            <div className="flex items-center gap-1">
                                                                <span className={getEmotionalStateColor(report.emotional_state)}>
                                                                    {getEmotionalStateEmoji(report.emotional_state)}
                                                                </span>
                                                                <span className="text-xs text-slate-500">
                                                                    {getEmotionalStateLabel(report.emotional_state)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {new Date(report.date).toLocaleDateString('nl-NL')}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                {/* Report Text (truncated) */}
                                                <div>
                                                    <p className="text-slate-500 text-xs mb-1">Report</p>
                                                    <p className="text-sm text-slate-700 line-clamp-2">
                                                        {report.report_text}
                                                    </p>
                                                </div>

                                                {/* Quick Actions */}
                                                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(report.date).toLocaleTimeString('nl-NL', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                        {report.type === "morning_report" && (
                                                            <Badge variant="outline" className="bg-amber-50 text-amber-700 text-xs">
                                                                Ochtend
                                                            </Badge>
                                                        )}
                                                        {report.type === "evening_report" && (
                                                            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 text-xs">
                                                                Avond
                                                            </Badge>
                                                        )}
                                                        {report.type === "one_to_one_report" && (
                                                            <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                                                                1-op-1
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                        Read Full Report
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </CardContent>
                        </Card>
                        {/* Recent Incidents Card */}
                        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                            <AlertTriangle className="w-4 h-4 text-red-600" />
                                        </div>
                                        <CardTitle className="text-lg">Recent Incidents</CardTitle>
                                    </div>
                                    <Badge variant="secondary" className="bg-red-50 text-red-700">
                                        {incidents?.count}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {
                                    incidents?.count === 0 && (
                                    <div className="p-6 text-center bg-slate-50 rounded-lg border border-slate-200 h-full">
                                        <AlertTriangle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                        <p className="text-slate-500 text-sm">No Current Recent Incidents</p>
                                    </div>
                                )
                                }
                                {incidents?.results.map((incident) => (
                                    <Card key={incident.id} className="border-0 shadow-xs hover:shadow-md transition-all duration-300 hover:translate-x-1 border-l-4 border-l-red-500">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-sm text-slate-900">
                                                        {incident.incident_type}
                                                    </h4>
                                                    <Badge variant="secondary" className={getIncidentSeverityColor(incident.severity_of_incident)}>
                                                        {incident.severity_of_incident}
                                                    </Badge>
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {new Date(incident.incident_date).toLocaleDateString('nl-NL')}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                {/* Incident Details */}
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div>
                                                        <p className="text-slate-500 text-xs">Location</p>
                                                        <p className="font-medium text-slate-900">{incident.location_name}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-500 text-xs">Employee</p>
                                                        <p className="font-medium text-slate-900">{incident.employee_first_name+" "+incident.employee_last_name}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-500 text-xs">Physical Injury</p>
                                                        <p className="font-medium text-slate-900">{incident.physical_injury}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-500 text-xs">Recurrence Risk</p>
                                                        <p className="font-medium text-slate-900">{incident.recurrence_risk}</p>
                                                    </div>
                                                </div>

                                                {/* Incident Flags */}
                                                <div className="flex flex-wrap gap-1">
                                                    {incident.accident && <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">Accident</Badge>}
                                                    {incident.violence && <Badge variant="outline" className="bg-red-50 text-red-700 text-xs">Violence</Badge>}
                                                    {incident.self_harm && <Badge variant="outline" className="bg-orange-50 text-orange-700 text-xs">Self Harm</Badge>}
                                                    {incident.passing_away && <Badge variant="outline" className="bg-purple-50 text-purple-700 text-xs">Passing Away</Badge>}
                                                    {incident.use_prohibited_substances && <Badge variant="outline" className="bg-amber-50 text-amber-700 text-xs">Substances</Badge>}
                                                    {incident.fire_water_damage && <Badge variant="outline" className="bg-cyan-50 text-cyan-700 text-xs">Fire/Water Damage</Badge>}
                                                </div>

                                                {/* Incident Explanation (truncated) */}
                                                {incident.incident_explanation && (
                                                    <div>
                                                        <p className="text-slate-500 text-xs mb-1">Explanation</p>
                                                        <p className="text-sm text-slate-700 line-clamp-2">
                                                            {incident.incident_explanation}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Actions Taken */}
                                                {incident.incident_taken_measures && (
                                                    <div>
                                                        <p className="text-slate-500 text-xs mb-1">Measures Taken</p>
                                                        <p className="text-sm text-slate-700 line-clamp-2">
                                                            {incident.incident_taken_measures}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Status and Consultation */}
                                                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary" className="bg-slate-50 text-slate-700 text-xs">
                                                            {incident.needed_consultation}
                                                        </Badge>
                                                        {incident.client_absence && (
                                                            <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 text-xs">
                                                                Client Absence
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50">
                                                        View Details
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                {/* Work & Education Tab */}
                <TabsContent value="professional" className="space-y-6 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Work Information */}
                        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <Briefcase className="w-4 h-4 text-orange-600" />
                                        </div>
                                        <CardTitle className="text-lg">Work Information</CardTitle>
                                    </div>
                                    <Badge variant="secondary" className={client?.work_currently_employed ? "bg-green-50 text-green-700" : "bg-slate-50 text-slate-700"}>
                                        {client?.work_currently_employed ? "Employed" : "Not Employed"}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {client?.work_currently_employed ? (
                                    <>
                                        <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                                            <div className="col-span-2">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                                    <h4 className="font-semibold text-sm text-slate-900">Current Employment</h4>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <p className="text-slate-500 text-xs">Employer</p>
                                                        <p className="font-medium text-slate-900">{client?.work_current_employer}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-500 text-xs">Position</p>
                                                        <p className="font-medium text-slate-900">{client?.work_current_position}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-500 text-xs">Start Date</p>
                                                        <p className="font-medium text-slate-900">
                                                            {client?.work_start_date ? new Date(client?.work_start_date).toLocaleDateString() : 'N/A'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-500 text-xs">Status</p>
                                                        <p className="font-medium text-slate-900">Currently Employed</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Employer Contact */}
                                        {(client?.work_employer_email || client?.work_employer_phone) && (
                                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                                <h4 className="font-semibold text-sm text-slate-900 mb-3">Employer Contact</h4>
                                                <div className="space-y-2">
                                                    {client?.work_employer_email && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Mail className="w-3 h-3 text-slate-500" />
                                                            <span className="text-slate-700">{client?.work_employer_email}</span>
                                                        </div>
                                                    )}
                                                    {client?.work_employer_phone && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Phone className="w-3 h-3 text-slate-500" />
                                                            <span className="text-slate-700">{client?.work_employer_phone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Additional Notes */}
                                        {client?.work_additional_notes && (
                                            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                                                <h4 className="font-semibold text-sm text-slate-900 mb-2">Additional Notes</h4>
                                                <p className="text-sm text-slate-700">{client?.work_additional_notes}</p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="p-6 text-center bg-slate-50 rounded-lg border border-slate-200">
                                        <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                        <p className="text-slate-500 text-sm">No current employment information</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Education Information */}
                        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <GraduationCap className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <CardTitle className="text-lg">Education</CardTitle>
                                    </div>
                                    <Badge variant="secondary" className={getEducationLevelColor(client?.education_level||"none")}>
                                        {client?.education_level ? educationLevelLabels[client?.education_level as keyof typeof educationLevelLabels] : 'Not Specified'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {client?.education_level && client?.education_level !== "none" ? (
                                    <>
                                        <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                            <div className="col-span-2">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                                    <h4 className="font-semibold text-sm text-slate-900">Education Details</h4>
                                                    {client?.education_currently_enrolled && (
                                                        <Badge variant="secondary" className="bg-green-50 text-green-700">
                                                            Currently Enrolled
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <p className="text-slate-500 text-xs">Institution</p>
                                                        <p className="font-medium text-slate-900">{client?.education_institution || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-500 text-xs">Level</p>
                                                        <p className="font-medium text-slate-900">
                                                            {educationLevelLabels[client?.education_level as keyof typeof educationLevelLabels] || 'N/A'}
                                                        </p>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <p className="text-slate-500 text-xs">Status</p>
                                                        <p className="font-medium text-slate-900">
                                                            {client?.education_currently_enrolled ? 'Currently Enrolled' : 'Not Currently Enrolled'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mentor Information */}
                                        {(client?.education_mentor_name || client?.education_mentor_email || client?.education_mentor_phone) && (
                                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                                <h4 className="font-semibold text-sm text-slate-900 mb-3">Mentor Contact</h4>
                                                <div className="space-y-2">
                                                    {client?.education_mentor_name && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <User className="w-3 h-3 text-slate-500" />
                                                            <span className="text-slate-700">{client?.education_mentor_name}</span>
                                                        </div>
                                                    )}
                                                    {client?.education_mentor_email && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Mail className="w-3 h-3 text-slate-500" />
                                                            <span className="text-slate-700">{client?.education_mentor_email}</span>
                                                        </div>
                                                    )}
                                                    {client?.education_mentor_phone && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Phone className="w-3 h-3 text-slate-500" />
                                                            <span className="text-slate-700">{client?.education_mentor_phone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Additional Notes */}
                                        {client?.education_additional_notes && (
                                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                <h4 className="font-semibold text-sm text-slate-900 mb-2">Additional Notes</h4>
                                                <p className="text-sm text-slate-700">{client?.education_additional_notes}</p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="p-6 text-center bg-slate-50 rounded-lg border border-slate-200">
                                        <GraduationCap className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                        <p className="text-slate-500 text-sm">No education information available</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Living Situation - Full Width */}
                        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm lg:col-span-2">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                            <Home className="w-4 h-4 text-green-600" />
                                        </div>
                                        <CardTitle className="text-lg">Living Situation</CardTitle>
                                    </div>
                                    <Badge variant="secondary" className={getLivingSituationColor(mockLivingSituation.living_situation)}>
                                        {mockLivingSituation.living_situation ? livingSituationLabels[mockLivingSituation.living_situation as keyof typeof livingSituationLabels] : 'Not Specified'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-semibold text-sm text-slate-900 mb-2">Current Situation</h4>
                                            <p className="text-lg font-medium text-slate-900">
                                                {mockLivingSituation.living_situation ? livingSituationLabels[mockLivingSituation.living_situation as keyof typeof livingSituationLabels] : 'Not specified'}
                                            </p>
                                        </div>
                                        {mockLivingSituation.living_situation_notes && (
                                            <div>
                                                <h4 className="font-semibold text-sm text-slate-900 mb-2">Notes</h4>
                                                <p className="text-sm text-slate-700">{mockLivingSituation.living_situation_notes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                {/* Enhanced Personal Tab */}
                <TabsContent value="personal" className="space-y-6 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Enhanced Contact Information */}
                        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                                            <Users className="w-4 h-4 text-violet-600" />
                                        </div>
                                        <CardTitle className="text-lg">Emergency Contacts</CardTitle>
                                    </div>
                                    <Badge variant="secondary" className="bg-violet-50 text-violet-700">
                                        {emergencyContacts?.count}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {emergencyContacts?.count === 0 && (
                                    <div className="p-6 text-center bg-slate-50 rounded-lg border border-slate-200 h-full">
                                        <Users2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                        <p className="text-slate-500 text-sm">No Current Emergency Contacts</p>
                                    </div>
                                )}
                                {emergencyContacts?.results.map((contact) => (
                                    <Card key={contact.id} className="border-0 shadow-xs hover:shadow-md transition-all duration-300 hover:translate-x-1">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-12 h-12 border-2 border-violet-200">
                                                    <AvatarFallback className="bg-violet-100 text-violet-600">
                                                        {contact.first_name[0]}{contact.last_name[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-semibold text-sm">
                                                            {contact.first_name} {contact.last_name}
                                                        </h4>
                                                        <Badge variant="secondary" className={getPriorityColor(contact.priority)}>
                                                            {contact.relationship}
                                                        </Badge>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                                            <Mail className="w-3 h-3" />
                                                            <span>{contact.email}</span>
                                                        </div>
                                                        {contact.phone && (
                                                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                                                <Phone className="w-3 h-3" />
                                                                <span>{contact.phone}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Enhanced Address Card */}
                        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Home className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <CardTitle className="text-lg">Address Information</CardTitle>
                                    </div>
                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                        {addressesData.length}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {addressesData.map((address,index) => (
                                    <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                            <h4 className="font-semibold text-sm text-slate-900">{address.address}</h4>
                                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                                Primary
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <p className="text-slate-500 text-xs">Contact</p>
                                                <p className="font-medium text-slate-900">{address.belongs_to}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 text-xs">City</p>
                                                <p className="font-medium text-slate-900">{address.city}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 text-xs">Phone</p>
                                                <p className="font-medium text-slate-900">{address.phone_number}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 text-xs">Postal Code</p>
                                                <p className="font-medium text-slate-900">{address.zip_code}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Enhanced Medical Tab */}
                <TabsContent value="medical" className="space-y-6 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Enhanced Medical Diagnoses */}
                        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                            <HeartPulse className="w-4 h-4 text-red-600" />
                                        </div>
                                        <CardTitle className="text-lg">Medical Diagnoses</CardTitle>
                                    </div>
                                    <Badge variant="secondary" className="bg-red-50 text-red-700">
                                        {diagnosis?.count}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {diagnosis?.count === 0 && (
                                    <div className="p-6 text-center bg-slate-50 rounded-lg border border-slate-200 h-full">
                                        <HeartPulse className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                        <p className="text-slate-500 text-sm">No Current Medical Diagnoses</p>
                                    </div>
                                )}
                                {diagnosis?.results.map((diagnosis) => (
                                    <Card key={diagnosis.id} className="border-0 shadow-xs hover:shadow-md transition-all duration-300">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                                    {diagnosis.title}
                                                </Badge>
                                                <Badge variant="secondary" className={getSeverityColor(diagnosis.severity)}>
                                                    {diagnosis.severity}
                                                </Badge>
                                                <Badge variant="secondary" className={getStatusColor(diagnosis.status)}>
                                                    {diagnosis.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Code className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm font-mono text-slate-600">{diagnosis.diagnosis_code}</span>
                                            </div>
                                            <p className="text-sm text-slate-700 mb-3">
                                                {diagnosis.description}
                                            </p>
                                            <div className="text-xs text-slate-500">
                                                Diagnosed on {new Date(diagnosis?.created_at || "").toLocaleDateString()}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Enhanced Treatment Plan */}
                        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <ClipboardList className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <CardTitle className="text-lg">Active Contracts</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Active Treatment Contracts mockContracts||*/}
                                {
                                ([]).length === 0 && (
                                    <div className="p-6 text-center bg-slate-50 rounded-lg border border-slate-200 h-full">
                                        <ClipboardList className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                        <p className="text-slate-500 text-sm">No Active Contracts</p>
                                    </div>
                                )
                                }
                                {([]).map((contract:Any,index) => (
                                    <div key={index} className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold text-sm text-slate-900">
                                                {contract.care_name}
                                            </h4>
                                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                                                €{contract.price}
                                            </Badge>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <div className="flex justify-between text-xs text-slate-600 mb-1">
                                                    <span>Progress</span>
                                                    <span>{contract.progress}%</span>
                                                </div>
                                                <Progress value={contract.progress} className="h-2 bg-slate-200" />
                                            </div>
                                            <div className="flex justify-between text-xs text-slate-500">
                                                <span>Next Review: {new Date(contract.next_review).toLocaleDateString()}</span>
                                                <Badge variant="outline" className={getStatusColor(contract.status)}>
                                                    {contract.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Enhanced Care Team Tab */}
                <TabsContent value="care" className="space-y-6 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Enhanced Care Team */}
                        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <Users className="w-4 h-4 text-indigo-600" />
                                        </div>
                                        <CardTitle className="text-lg">Care Team</CardTitle>
                                    </div>
                                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">
                                        {involvedEmployees?.count}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {involvedEmployees?.count === 0 && (
                                    <div className="p-6 text-center bg-slate-50 rounded-lg border border-slate-200 h-full">
                                        <Users2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                        <p className="text-slate-500 text-sm">No Current Care Team Members Assigned</p>
                                    </div>
                                )}
                                {involvedEmployees?.results.map((employee) => (
                                    <Card key={employee.id} className="border-0 shadow-xs hover:shadow-md transition-all duration-300 group">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <Avatar className="w-12 h-12 border-2 border-indigo-200 group-hover:border-indigo-300 transition-colors">
                                                        <AvatarFallback className="bg-indigo-100 text-indigo-600">
                                                            {employee.employee_name?.split(' ').map(n => n[0]).join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${employee.start_date ? 'bg-emerald-400' :
                                                        employee.created_at ? 'bg-amber-400' : 'bg-slate-400'
                                                        }`}></div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-semibold text-sm">
                                                            {employee.employee_name}
                                                        </h4>
                                                        <Badge variant="secondary" className={getAvailabilityColor(employee.start_date ? "available" : employee.created_at ? "busy" : "away")}>
                                                            {employee.start_date ? "available" : employee.created_at ? "busy" : "away"}
                                                        </Badge>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                                            <Briefcase className="w-3 h-3" />
                                                            <span>{employee.role}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                                            <Calendar className="w-3 h-3" />
                                                            <span>Since {new Date(employee.start_date).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Enhanced Status History */}
                        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <Clock className="w-4 h-4 text-orange-600" />
                                        </div>
                                        <CardTitle className="text-lg">Status History</CardTitle>
                                    </div>
                                    <Badge variant="secondary" className="bg-orange-50 text-orange-700">
                                        {statusHistory.length}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {statusHistory?.length === 0 && (
                                    <div className="p-6 text-center bg-slate-50 rounded-lg border border-slate-200 h-full">
                                        <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                        <p className="text-slate-500 text-sm">No Current Status History</p>
                                    </div>
                                )}
                                {statusHistory?.map((history, index) => (
                                    <div key={history.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors group">
                                        <div className="flex flex-col items-center">
                                            <div className="w-2 h-2 bg-orange-500 rounded-full group-hover:scale-150 transition-transform"></div>
                                            {index < statusHistory.length - 1 && (
                                                <div className="w-0.5 h-8 bg-slate-300 mt-1"></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-semibold text-slate-900">
                                                    {history.old_status}
                                                </span>
                                                <ArrowRight className="w-3 h-3 text-slate-400" />
                                                <span className="text-sm font-semibold text-emerald-600">
                                                    {history.new_status}
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-500 mb-1">
                                                {new Date(history.changed_at).toLocaleDateString()} • By {history.changed_by}
                                            </div>
                                            {history.reason && (
                                                <p className="text-xs text-slate-600 bg-white p-2 rounded border">
                                                    {history.reason}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Enhanced Documents Tab */}
                <TabsContent value="documents" className="space-y-6 animate-in fade-in duration-500">
                    <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                                        <FileText className="w-4 h-4 text-violet-600" />
                                    </div>
                                    <CardTitle className="text-lg">Document Management</CardTitle>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="bg-violet-50 text-violet-700">
                                        {(uploaded?.length ?? 0)}/{DOCUMENT_LABEL_OPTIONS.filter(o => o.value).length}
                                    </Badge>
                                    <Button
                                        size="sm"
                                        className="bg-violet-600 hover:bg-violet-700"
                                        onClick={() => {
                                            setDefaultSelectedLabel(""); // no preselect
                                            setDocModalOpen(true);
                                        }}
                                    >
                                        <UploadIcon className="w-4 h-4 mr-2" />
                                        Upload
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            {/* show loader while docs load */}
                            {docsLoading ? (
                                <div className="py-10 text-center text-slate-500">Loading documents…</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {DOCUMENT_LABEL_OPTIONS.filter(o => o.value).map((opt) => {
                                        const doc = uploaded.find((d: Any) => d.label === opt.value);
                                        const hasDoc = !!doc;

                                        return (
                                            <Card
                                                key={opt.value}
                                                className={`border-2 transition-all duration-300 hover:scale-105 cursor-pointer group ${hasDoc
                                                    ? "border-emerald-200 hover:border-emerald-300 bg-emerald-50/50"
                                                    : "border-red-200 hover:border-red-300 bg-red-50/50"
                                                    }`}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className={`p-2 rounded-lg ${hasDoc ? "bg-emerald-100" : "bg-red-100"}`}>
                                                            {hasDoc ? (
                                                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                                                            ) : (
                                                                <XCircle className="w-5 h-5 text-red-600" />
                                                            )}
                                                        </div>
                                                        <Badge
                                                            variant="secondary"
                                                            className={hasDoc ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}
                                                        >
                                                            {hasDoc ? "Available" : "Required"}
                                                        </Badge>
                                                    </div>

                                                    <h4 className={`font-semibold text-sm mb-2 ${hasDoc ? "text-emerald-800" : "text-red-800"}`}>
                                                        {opt.label}
                                                    </h4>

                                                    {hasDoc ? (
                                                        <div className="space-y-1">
                                                            <p className="text-xs text-slate-600">{doc.name}</p>
                                                            <div className="flex justify-between text-xs text-slate-500">
                                                                <span>{bytesToSize(doc.size)}</span>
                                                                <span>{doc.name.split(".").pop()?.toUpperCase() || "PDF"}</span>
                                                            </div>
                                                            <p className="text-xs text-slate-400">
                                                                Uploaded {formatDateToDutch(doc.created_at, true)}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-xs text-red-600">Document not uploaded</p>
                                                    )}

                                                    <div className="mt-3 flex gap-2">
                                                        {hasDoc ? (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="h-7 text-xs"
                                                                    onClick={() => window.open(doc.file, "_blank")}
                                                                >
                                                                    <EyeIcon className="w-3 h-3 mr-1" />
                                                                    View
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="h-7 text-xs"
                                                                    onClick={() => handleDownloadDocument(doc)}
                                                                >
                                                                    <DownloadIcon className="w-3 h-3 mr-1" />
                                                                    Download
                                                                </Button>

                                                                <DeleteDocumentDialog
                                                                    id={doc.attachment_uuid}
                                                                    handleConfirm={handleDeleteDocument}
                                                                />
                                                            </>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                className="h-7 text-xs bg-red-600 hover:bg-red-700"
                                                                onClick={() => {
                                                                    setDefaultSelectedLabel(opt.value); // preselect the label in modal
                                                                    setDocModalOpen(true);
                                                                }}
                                                            >
                                                                <UploadIcon className="w-3 h-3 mr-1" />
                                                                Upload
                                                            </Button>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* The actual modal — reuse your existing dialog */}
                    <AddDocumentDialog
                        open={docModalOpen}
                        setOpen={setDocModalOpen}
                        handleAdd={handleAddDocument}
                        documents={uploaded}
                        defaultSelected={defaultSelectedLabel}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

// Add missing icon component
const Code = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);

// const Upload = ({ className }: { className?: string }) => (
//     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//     </svg>
// );

export default withAuth(
    withPermissions(Page, {
        redirectUrl: Routes.Common.NotFound,
        requiredPermissions: PermissionsObjects.ViewClient, // TODO: Add correct permission
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);