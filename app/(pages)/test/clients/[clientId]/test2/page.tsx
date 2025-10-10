"use client";
import { Card, CardContent,  CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Phone, MapPin, Calendar, VenusAndMars, Building,
    Briefcase, HeartPulse,
    FileText, Clock, Users,
     CheckCircle, XCircle,  ArrowRight,
    Home, Stethoscope, ClipboardList, BarChart3, TrendingUp,
    Activity, ShieldCheck,  Download, Eye,
    MessageCircle, Bell, Settings, Search, 
     Star,   Zap, Upload,
    Cpu, Shield,  Brain,
     ActivitySquare, CalendarDays, 
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

// Enhanced mock data types
type Client = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    date_of_birth: string;
    gender: string;
    status: string;
    profile_picture?: string;
    birthplace: string;
    source: string;
    organisation: string;
    filenumber: string;
    bsn: string;
    legal_measure: string;
    infix: string;
    Zipcode: string;
    departement: string;
    street_number: string;
    streetname: string;
    location: string;
    last_visit: string;
    next_appointment: string;
    care_level: string;
    satisfaction_score: number;
};

type Address = {
    id: number;
    address: string;
    belongs_to: string;
    city: string;
    phone_number: string;
    zip_code: string;
    type: string;
};

type Contact = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    relationship: string;
    phone?: string;
    priority: 'high' | 'medium' | 'low';
};

type Employee = {
    id: number;
    employee_name: string;
    role: string;
    start_date: string;
    profile_picture?: string;
    specialization: string;
    availability: 'available' | 'busy' | 'away';
    rating: number;
};

type Contract = {
    id: number;
    care_name: string;
    price: number;
    start_date: string;
    status: string;
    progress: number;
    next_review: string;
    sessions_completed: number;
    total_sessions: number;
};

type Report = {
    id: number;
    date: string;
    report_text: string;
    emotional_state: string;
    type: string;
    employee_profile_picture?: string;
    priority: 'high' | 'medium' | 'low';
    tags: string[];
};

type Diagnosis = {
    id: number;
    title: string;
    diagnosis_code: string;
    created_at: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'active' | 'resolved' | 'monitoring';
};

type Document = {
    id: number;
    label: string;
    name: string;
    uploaded_at: string;
    size: string;
    type: string;
};

type StatusHistory = {
    id: number;
    old_status: string;
    new_status: string;
    changed_at: string;
    reason?: string;
    changed_by: string;
};

type Metric = {
    label: string;
    value: string;
    change: number;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
};

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100
        }
    }
};

const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100
        }
    },
    hover: {
        y: -5,
        scale: 1.02,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10
        }
    }
};

const tabContentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20
        }
    },
    exit: {
        opacity: 0,
        x: -20,
        transition: {
            duration: 0.2
        }
    }
};

// Enhanced mock data
const mockClient: Client = {
    id: 1,
    first_name: "Sarah",
    last_name: "Johnson",
    email: "sarah.johnson@example.com",
    phone_number: "+31 6 12345678",
    date_of_birth: "1985-03-15",
    gender: "Female",
    status: "Active",
    profile_picture: "/images/avatar-1.jpg",
    birthplace: "Amsterdam",
    source: "Referral",
    organisation: "Healthcare Org",
    filenumber: "CL-2024-001",
    bsn: "123456782",
    legal_measure: "Voluntary",
    infix: "",
    Zipcode: "1234 AB",
    departement: "North Holland",
    street_number: "42",
    streetname: "Main Street",
    location: "Amsterdam Center",
    last_visit: "2024-03-01",
    next_appointment: "2024-03-15",
    care_level: "Level 2",
    satisfaction_score: 4.5
};

const mockAddresses: Address[] = [
    {
        id: 1,
        address: "Main Residence",
        belongs_to: "Sarah Johnson",
        city: "Amsterdam",
        phone_number: "+31 6 12345678",
        zip_code: "1234 AB",
        type: "primary"
    }
];

const mockContacts: Contact[] = [
    {
        id: 1,
        first_name: "Michael",
        last_name: "Johnson",
        email: "michael.j@example.com",
        relationship: "Spouse",
        phone: "+31 6 87654321",
        priority: "high"
    },
    {
        id: 2,
        first_name: "Emily",
        last_name: "Johnson",
        email: "emily.j@example.com",
        relationship: "Daughter",
        priority: "medium"
    }
];

const mockEmployees: Employee[] = [
    {
        id: 1,
        employee_name: "Dr. Maria Rodriguez",
        role: "Primary Care Physician",
        start_date: "2024-01-15",
        specialization: "Psychiatry",
        availability: "available",
        rating: 4.8
    },
    {
        id: 2,
        employee_name: "Lisa Chen",
        role: "Therapist",
        start_date: "2024-02-01",
        specialization: "Cognitive Behavioral Therapy",
        availability: "available",
        rating: 4.9
    }
];

const mockContracts: Contract[] = [
    {
        id: 1,
        care_name: "Weekly Therapy Sessions",
        price: 120,
        start_date: "2024-01-15",
        status: "Active",
        progress: 75,
        next_review: "2024-04-15",
        sessions_completed: 9,
        total_sessions: 12
    }
];

const mockReports: Report[] = [
    {
        id: 1,
        date: "2024-03-01",
        report_text: "Client showed significant improvement in mood and engagement during today's session. Discussed coping strategies for anxiety.",
        emotional_state: "Good",
        type: "Therapy Session",
        priority: "medium",
        tags: ["Progress", "Engagement"]
    }
];

const mockDiagnosis: Diagnosis[] = [
    {
        id: 1,
        title: "Generalized Anxiety Disorder",
        diagnosis_code: "F41.1",
        created_at: "2024-01-15",
        description: "Excessive anxiety and worry occurring more days than not for at least 6 months",
        severity: "medium",
        status: "active"
    }
];

const mockDocuments: Document[] = [
    {
        id: 1,
        label: "id_document",
        name: "Passport Copy",
        uploaded_at: "2024-01-10",
        size: "2.4 MB",
        type: "PDF"
    }
];

const mockStatusHistory: StatusHistory[] = [
    {
        id: 1,
        old_status: "Pending",
        new_status: "Active",
        changed_at: "2024-01-15",
        reason: "Initial assessment completed",
        changed_by: "Dr. Maria Rodriguez"
    }
];

const DOCUMENT_LABELS = {
    id_document: 'ID Document',
    insurance_card: 'Insurance Card',
    medical_history: 'Medical History',
    treatment_plan: 'Treatment Plan',
    consent_forms: 'Consent Forms',
    lab_results: 'Lab Results'
};

const Page = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    // Status color helper
    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'bg-emerald-500/15 text-emerald-700 border-emerald-200';
            case 'inactive': return 'bg-slate-500/15 text-slate-700 border-slate-200';
            case 'pending': return 'bg-amber-500/15 text-amber-700 border-amber-200';
            case 'review': return 'bg-blue-500/15 text-blue-700 border-blue-200';
            default: return 'bg-slate-500/15 text-slate-700 border-slate-200';
        }
    };

    // Severity color helper
    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'low': return 'bg-emerald-500/15 text-emerald-700';
            case 'medium': return 'bg-amber-500/15 text-amber-700';
            case 'high': return 'bg-orange-500/15 text-orange-700';
            case 'critical': return 'bg-red-500/15 text-red-700';
            default: return 'bg-slate-500/15 text-slate-700';
        }
    };

    // Priority color helper
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-500/15 text-red-700';
            case 'medium': return 'bg-amber-500/15 text-amber-700';
            case 'low': return 'bg-emerald-500/15 text-emerald-700';
            default: return 'bg-slate-500/15 text-slate-700';
        }
    };

    // Availability color helper
    const getAvailabilityColor = (availability: string) => {
        switch (availability) {
            case 'available': return 'bg-emerald-500/15 text-emerald-700';
            case 'busy': return 'bg-amber-500/15 text-amber-700';
            case 'away': return 'bg-slate-500/15 text-slate-700';
            default: return 'bg-slate-500/15 text-slate-700';
        }
    };

    // Key metrics data
    const metrics: Metric[] = [
        {
            label: "Treatment Progress",
            value: "75%",
            change: +12,
            icon: <TrendingUp className="w-6 h-6" />,
            color: "text-emerald-600",
            bgColor: "bg-gradient-to-br from-emerald-500/20 to-emerald-600/20"
        },
        {
            label: "Session Attendance",
            value: "92%",
            change: +5,
            icon: <ActivitySquare className="w-6 h-6" />,
            color: "text-blue-600",
            bgColor: "bg-gradient-to-br from-blue-500/20 to-blue-600/20"
        },
        {
            label: "Care Compliance",
            value: "88%",
            change: +8,
            icon: <ShieldCheck className="w-6 h-6" />,
            color: "text-violet-600",
            bgColor: "bg-gradient-to-br from-violet-500/20 to-violet-600/20"
        },
        {
            label: "Satisfaction Score",
            value: "4.5/5",
            change: +0.3,
            icon: <Star className="w-6 h-6" />,
            color: "text-amber-600",
            bgColor: "bg-gradient-to-br from-amber-500/20 to-amber-600/20"
        }
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg font-semibold text-slate-700"
                    >
                        Loading Client Dashboard...
                    </motion.p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 p-6">
            {/* Enhanced Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <motion.div
                            className="flex items-center gap-3 mb-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-violet-600 rounded-full"></div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                Client Dashboard
                            </h1>
                        </motion.div>
                        <motion.p
                            className="text-slate-600 ml-5"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Comprehensive overview and management
                        </motion.p>
                    </div>
                    <motion.div
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="relative">
                            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <Button variant="outline" size="icon" className="rounded-xl">
                            <Bell className="w-5 h-5" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-xl">
                            <Settings className="w-5 h-5" />
                        </Button>
                    </motion.div>
                </div>

                {/* Enhanced Client Profile Header */}
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                >
                    <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 text-white overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

                        <CardContent className="p-8 relative">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <motion.div
                                        className="relative"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        <Avatar className="w-24 h-24 border-4 border-white/20 shadow-2xl">
                                            <AvatarImage src={mockClient.profile_picture} />
                                            <AvatarFallback className="bg-white/20 text-white text-2xl font-bold backdrop-blur-sm">
                                                {mockClient.first_name[0]}{mockClient.last_name[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <motion.div
                                            className="absolute -bottom-2 -right-2"
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <Badge className="bg-emerald-500 border-2 border-white shadow-lg">
                                                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                                                Active
                                            </Badge>
                                        </motion.div>
                                    </motion.div>
                                    <div>
                                        <motion.h2
                                            className="text-3xl font-bold mb-2"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            {mockClient.first_name} {mockClient.last_name}
                                        </motion.h2>
                                        <motion.div
                                            className="flex items-center gap-6 text-white/80"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                {mockClient.email}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                {mockClient.phone_number}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                {mockClient.date_of_birth}
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                                <motion.div
                                    className="text-right"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 inline-block border border-white/20">
                                        <p className="text-white/80 text-sm">Client ID</p>
                                        <p className="font-mono font-bold text-xl">#{mockClient.id}</p>
                                    </div>
                                </motion.div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            {/* Enhanced Key Metrics Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
                {metrics.map((metric, index) => (
                    <motion.div
                        key={metric.label}
                        variants={itemVariants}
                        custom={index}
                    >
                        <motion.div
                            variants={cardVariants}
                            whileHover="hover"
                            className={`p-6 rounded-2xl border border-slate-200/50 backdrop-blur-sm ${metric.bgColor} shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600 mb-1">{metric.label}</p>
                                    <p className="text-2xl font-bold text-slate-900 mb-2">{metric.value}</p>
                                    <motion.div
                                        className={`flex items-center gap-1 text-sm ${metric.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.1 + 0.5 }}
                                    >
                                        <TrendingUp className={`w-4 h-4 ${metric.change < 0 ? 'rotate-180' : ''}`} />
                                        {metric.change >= 0 ? '+' : ''}{metric.change}%
                                    </motion.div>
                                </div>
                                <motion.div
                                    className={`p-3 rounded-xl ${metric.color} bg-white/50 backdrop-blur-sm`}
                                    whileHover={{ rotate: 5, scale: 1.1 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    {metric.icon}
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Enhanced Main Dashboard */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <TabsList className="grid w-full grid-cols-5 p-2 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-sm">
                        {[
                            { value: "overview", label: "Overview", icon: BarChart3 },
                            { value: "personal", label: "Personal", icon: User },
                            { value: "medical", label: "Medical", icon: Stethoscope },
                            { value: "care", label: "Care Team", icon: Users },
                            { value: "documents", label: "Documents", icon: FileText }
                        ].map(({ value, label, icon: Icon }) => (
                            <TabsTrigger
                                key={value}
                                value={value}
                                className="flex items-center gap-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </motion.div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        variants={tabContentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <TabsContent value={activeTab} className="space-y-6">
                            {/* Enhanced Overview Tab */}
                            {activeTab === "overview" && (
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                                >
                                    {/* Enhanced Profile Card */}
                                    <motion.div variants={itemVariants}>
                                        <motion.div
                                            variants={cardVariants}
                                            whileHover="hover"
                                            className="h-full"
                                        >
                                            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm h-full">
                                                <CardHeader className="pb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                                            <User className="w-5 h-5 text-white" />
                                                        </div>
                                                        <CardTitle className="text-lg">Profile Information</CardTitle>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="space-y-3">
                                                        {[
                                                            { icon: CalendarDays, label: "Date of Birth", value: mockClient.date_of_birth },
                                                            { icon: VenusAndMars, label: "Gender", value: mockClient.gender },
                                                            { icon: MapPin, label: "Birthplace", value: mockClient.birthplace },
                                                            { icon: Building, label: "Care Level", value: mockClient.care_level }
                                                        ].map((item, index) => (
                                                            <motion.div
                                                                key={item.label}
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: index * 0.1 }}
                                                                className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-xl hover:bg-slate-100/50 transition-colors group"
                                                            >
                                                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                                                                    <item.icon className="w-4 h-4 text-slate-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-slate-900">{item.label}</p>
                                                                    <p className="text-sm text-slate-600">{item.value}</p>
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </motion.div>

                                    {/* Enhanced Quick Actions */}
                                    <motion.div variants={itemVariants}>
                                        <motion.div
                                            variants={cardVariants}
                                            whileHover="hover"
                                            className="h-full"
                                        >
                                            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm h-full">
                                                <CardHeader className="pb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                                            <Zap className="w-5 h-5 text-white" />
                                                        </div>
                                                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {[
                                                            { label: "New Report", icon: FileText, color: "from-blue-500 to-blue-600" },
                                                            { label: "Schedule", icon: Calendar, color: "from-emerald-500 to-emerald-600" },
                                                            { label: "Message", icon: MessageCircle, color: "from-violet-500 to-violet-600" },
                                                            { label: "Documents", icon: Download, color: "from-amber-500 to-amber-600" }
                                                        ].map((action) => (
                                                            <motion.button
                                                                key={action.label}
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className={`h-16 bg-gradient-to-r ${action.color} text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center`}
                                                            >
                                                                <action.icon className="w-5 h-5 mr-2" />
                                                                <span className="text-sm font-medium">{action.label}</span>
                                                            </motion.button>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </motion.div>

                                    {/* Enhanced Recent Activity */}
                                    <motion.div variants={itemVariants} className="lg:col-span-2 xl:col-span-1">
                                        <motion.div
                                            variants={cardVariants}
                                            whileHover="hover"
                                            className="h-full"
                                        >
                                            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm h-full">
                                                <CardHeader className="pb-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                                                                <ActivitySquare className="w-5 h-5 text-white" />
                                                            </div>
                                                            <CardTitle className="text-lg">Recent Activity</CardTitle>
                                                        </div>
                                                        <Button variant="ghost" size="sm" className="gap-1 rounded-xl">
                                                            View All
                                                            <ArrowRight className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-4">
                                                        {mockReports.map((report, index) => (
                                                            <motion.div
                                                                key={report.id}
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: index * 0.1 }}
                                                                className="flex items-start gap-3 p-3 bg-slate-50/50 rounded-xl hover:bg-slate-100/50 transition-colors group cursor-pointer"
                                                            >
                                                                <motion.div
                                                                    className="w-2 h-2 bg-amber-500 rounded-full mt-2"
                                                                    whileHover={{ scale: 1.5 }}
                                                                    transition={{ type: "spring", stiffness: 400 }}
                                                                ></motion.div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <Badge variant="secondary" className={getPriorityColor(report.priority)}>
                                                                            {report.type}
                                                                        </Badge>
                                                                        <span className="text-xs text-slate-500">{new Date(report.date).toLocaleDateString()}</span>
                                                                    </div>
                                                                    <p className="text-sm text-slate-700 line-clamp-2">
                                                                        {report.report_text}
                                                                    </p>
                                                                    <div className="flex gap-1 mt-2">
                                                                        {report.tags.map(tag => (
                                                                            <span key={tag} className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-lg">
                                                                                {tag}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* Enhanced Personal Tab */}
                            {activeTab === "personal" && (
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                                >
                                    {/* Enhanced Contact Information */}
                                    <motion.div variants={itemVariants}>
                                        <motion.div
                                            variants={cardVariants}
                                            whileHover="hover"
                                            className="h-full"
                                        >
                                            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm h-full">
                                                <CardHeader className="pb-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                                                                <Users className="w-5 h-5 text-white" />
                                                            </div>
                                                            <CardTitle className="text-lg">Emergency Contacts</CardTitle>
                                                        </div>
                                                        <Badge variant="secondary" className="bg-violet-100 text-violet-700">
                                                            {mockContacts.length}
                                                        </Badge>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    {mockContacts.map((contact, index) => (
                                                        <motion.div
                                                            key={contact.id}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: index * 0.1 }}
                                                        >
                                                            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer bg-gradient-to-r from-violet-50/50 to-purple-50/50">
                                                                <CardContent className="p-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <motion.div
                                                                            whileHover={{ rotate: 5 }}
                                                                            transition={{ type: "spring", stiffness: 400 }}
                                                                        >
                                                                            <Avatar className="w-12 h-12 border-2 border-violet-200 shadow-sm">
                                                                                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white">
                                                                                    {contact.first_name[0]}{contact.last_name[0]}
                                                                                </AvatarFallback>
                                                                            </Avatar>
                                                                        </motion.div>
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
                                                        </motion.div>
                                                    ))}
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </motion.div>

                                    {/* Enhanced Address Card */}
                                    <motion.div variants={itemVariants}>
                                        <motion.div
                                            variants={cardVariants}
                                            whileHover="hover"
                                            className="h-full"
                                        >
                                            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm h-full">
                                                <CardHeader className="pb-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                                                <Home className="w-5 h-5 text-white" />
                                                            </div>
                                                            <CardTitle className="text-lg">Address Information</CardTitle>
                                                        </div>
                                                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                                            {mockAddresses.length}
                                                        </Badge>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    {mockAddresses.map((address, index) => (
                                                        <motion.div
                                                            key={address.id}
                                                            initial={{ opacity: 0, x: 20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: index * 0.1 }}
                                                        >
                                                            <div className="p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl border border-blue-200/50 backdrop-blur-sm">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <motion.div
                                                                        className="w-2 h-2 bg-blue-500 rounded-full"
                                                                        animate={{ scale: [1, 1.2, 1] }}
                                                                        transition={{ duration: 2, repeat: Infinity }}
                                                                    ></motion.div>
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
                                                        </motion.div>
                                                    ))}
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* Enhanced Medical Tab */}
                            {activeTab === "medical" && (
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                                >
                                    {/* Enhanced Medical Diagnoses */}
                                    <motion.div variants={itemVariants}>
                                        <motion.div
                                            variants={cardVariants}
                                            whileHover="hover"
                                            className="h-full"
                                        >
                                            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm h-full">
                                                <CardHeader className="pb-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                                                                <HeartPulse className="w-5 h-5 text-white" />
                                                            </div>
                                                            <CardTitle className="text-lg">Medical Diagnoses</CardTitle>
                                                        </div>
                                                        <Badge variant="secondary" className="bg-red-100 text-red-700">
                                                            {mockDiagnosis.length}
                                                        </Badge>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    {mockDiagnosis.map((diagnosis, index) => (
                                                        <motion.div
                                                            key={diagnosis.id}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: index * 0.1 }}
                                                        >
                                                            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer bg-gradient-to-r from-red-50/50 to-rose-50/50">
                                                                <CardContent className="p-4">
                                                                    <div className="flex items-center gap-2 mb-3">
                                                                        <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                                                                            {diagnosis.title}
                                                                        </Badge>
                                                                        <Badge variant="secondary" className={getSeverityColor(diagnosis.severity)}>
                                                                            <Activity className="w-3 h-3 mr-1" />
                                                                            {diagnosis.severity}
                                                                        </Badge>
                                                                        <Badge variant="secondary" className={getStatusColor(diagnosis.status)}>
                                                                            {diagnosis.status}
                                                                        </Badge>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <Cpu className="w-4 h-4 text-slate-400" />
                                                                        <span className="text-sm font-mono text-slate-600">{diagnosis.diagnosis_code}</span>
                                                                    </div>
                                                                    <p className="text-sm text-slate-700 mb-3 line-clamp-2">
                                                                        {diagnosis.description}
                                                                    </p>
                                                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                                                        <span>Diagnosed {new Date(diagnosis.created_at).toLocaleDateString()}</span>
                                                                        <motion.div
                                                                            whileHover={{ scale: 1.1 }}
                                                                            className="cursor-pointer"
                                                                        >
                                                                            <Eye className="w-4 h-4" />
                                                                        </motion.div>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        </motion.div>
                                                    ))}
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </motion.div>

                                    {/* Enhanced Treatment Plan */}
                                    <motion.div variants={itemVariants}>
                                        <motion.div
                                            variants={cardVariants}
                                            whileHover="hover"
                                            className="h-full"
                                        >
                                            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm h-full">
                                                <CardHeader className="pb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                                                            <ClipboardList className="w-5 h-5 text-white" />
                                                        </div>
                                                        <CardTitle className="text-lg">Active Treatment</CardTitle>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    {mockContracts.map((contract, index) => (
                                                        <motion.div
                                                            key={contract.id}
                                                            initial={{ opacity: 0, x: 20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: index * 0.1 }}
                                                        >
                                                            <div className="p-4 bg-gradient-to-r from-emerald-50/50 to-green-50/50 rounded-xl border border-emerald-200/50 backdrop-blur-sm">
                                                                <div className="flex items-center justify-between mb-3">
                                                                    <h4 className="font-semibold text-sm text-slate-900">
                                                                        {contract.care_name}
                                                                    </h4>
                                                                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                                                                        €{contract.price}/session
                                                                    </Badge>
                                                                </div>

                                                                <div className="space-y-3">
                                                                    {/* Progress Section */}
                                                                    <div>
                                                                        <div className="flex justify-between text-xs text-slate-600 mb-2">
                                                                            <span>Treatment Progress</span>
                                                                            <span>{contract.progress}%</span>
                                                                        </div>
                                                                        <div className="w-full bg-slate-200 rounded-full h-2">
                                                                            <motion.div
                                                                                initial={{ width: 0 }}
                                                                                animate={{ width: `${contract.progress}%` }}
                                                                                transition={{ duration: 1, delay: 0.5 }}
                                                                                className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full shadow-sm"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* Sessions Counter */}
                                                                    <div className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
                                                                        <div className="text-center">
                                                                            <p className="text-xs text-slate-500">Sessions</p>
                                                                            <p className="text-sm font-bold text-slate-900">
                                                                                {contract.sessions_completed}/{contract.total_sessions}
                                                                            </p>
                                                                        </div>
                                                                        <div className="text-center">
                                                                            <p className="text-xs text-slate-500">Remaining</p>
                                                                            <p className="text-sm font-bold text-slate-900">
                                                                                {contract.total_sessions - contract.sessions_completed}
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    {/* Next Review */}
                                                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                                                        <div className="flex items-center gap-1">
                                                                            <Calendar className="w-3 h-3" />
                                                                            <span>Review: {new Date(contract.next_review).toLocaleDateString()}</span>
                                                                        </div>
                                                                        <Badge variant="outline" className={getStatusColor(contract.status)}>
                                                                            {contract.status}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}

                                                    {/* Health Metrics Overview */}
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.4 }}
                                                        className="mt-4 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl border border-blue-200/50"
                                                    >
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <ActivitySquare className="w-4 h-4 text-blue-600" />
                                                            <h4 className="font-semibold text-sm text-slate-900">Health Metrics</h4>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3 text-xs">
                                                            <div className="text-center p-2 bg-white/50 rounded-lg">
                                                                <p className="text-slate-500">Blood Pressure</p>
                                                                <p className="font-bold text-slate-900">120/80</p>
                                                            </div>
                                                            <div className="text-center p-2 bg-white/50 rounded-lg">
                                                                <p className="text-slate-500">Heart Rate</p>
                                                                <p className="font-bold text-slate-900">72 bpm</p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* Enhanced Care Team Tab */}
                            {activeTab === "care" && (
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                                >
                                    {/* Enhanced Care Team */}
                                    <motion.div variants={itemVariants}>
                                        <motion.div
                                            variants={cardVariants}
                                            whileHover="hover"
                                            className="h-full"
                                        >
                                            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm h-full">
                                                <CardHeader className="pb-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                                                <Users className="w-5 h-5 text-white" />
                                                            </div>
                                                            <CardTitle className="text-lg">Care Team</CardTitle>
                                                        </div>
                                                        <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                                                            {mockEmployees.length}
                                                        </Badge>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    {mockEmployees.map((employee, index) => (
                                                        <motion.div
                                                            key={employee.id}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: index * 0.1 }}
                                                        >
                                                            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
                                                                <CardContent className="p-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <motion.div
                                                                            className="relative"
                                                                            whileHover={{ scale: 1.05 }}
                                                                            transition={{ type: "spring", stiffness: 400 }}
                                                                        >
                                                                            <Avatar className="w-12 h-12 border-2 border-indigo-200 shadow-sm">
                                                                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                                                                                    {employee.employee_name.split(' ').map(n => n[0]).join('')}
                                                                                </AvatarFallback>
                                                                            </Avatar>
                                                                            <motion.div
                                                                                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${employee.availability === 'available' ? 'bg-emerald-400' :
                                                                                        employee.availability === 'busy' ? 'bg-amber-400' : 'bg-slate-400'
                                                                                    }`}
                                                                                animate={{ scale: [1, 1.2, 1] }}
                                                                                transition={{ duration: 2, repeat: Infinity }}
                                                                            />
                                                                        </motion.div>
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-2 mb-1">
                                                                                <h4 className="font-semibold text-sm">
                                                                                    {employee.employee_name}
                                                                                </h4>
                                                                                <Badge variant="secondary" className={getAvailabilityColor(employee.availability)}>
                                                                                    {employee.availability}
                                                                                </Badge>
                                                                            </div>
                                                                            <div className="space-y-1">
                                                                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                                                                    <Briefcase className="w-3 h-3" />
                                                                                    <span>{employee.role}</span>
                                                                                </div>
                                                                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                                                                    <Brain className="w-3 h-3" />
                                                                                    <span>{employee.specialization}</span>
                                                                                </div>
                                                                                <div className="flex items-center justify-between">
                                                                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                                                                        <Calendar className="w-3 h-3" />
                                                                                        <span>Since {new Date(employee.start_date).toLocaleDateString()}</span>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-1">
                                                                                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                                                        <span className="text-xs font-medium text-slate-700">{employee.rating}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <motion.div
                                                                        initial={{ opacity: 0, height: 0 }}
                                                                        whileHover={{ opacity: 1, height: "auto" }}
                                                                        className="mt-3 flex gap-2 overflow-hidden"
                                                                    >
                                                                        <Button size="sm" variant="outline" className="h-7 text-xs rounded-lg">
                                                                            <MessageCircle className="w-3 h-3 mr-1" />
                                                                            Message
                                                                        </Button>
                                                                        <Button size="sm" variant="outline" className="h-7 text-xs rounded-lg">
                                                                            <Calendar className="w-3 h-3 mr-1" />
                                                                            Schedule
                                                                        </Button>
                                                                    </motion.div>
                                                                </CardContent>
                                                            </Card>
                                                        </motion.div>
                                                    ))}
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </motion.div>

                                    {/* Enhanced Status History */}
                                    <motion.div variants={itemVariants}>
                                        <motion.div
                                            variants={cardVariants}
                                            whileHover="hover"
                                            className="h-full"
                                        >
                                            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm h-full">
                                                <CardHeader className="pb-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                                                                <Clock className="w-5 h-5 text-white" />
                                                            </div>
                                                            <CardTitle className="text-lg">Status History</CardTitle>
                                                        </div>
                                                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                                                            {mockStatusHistory.length}
                                                        </Badge>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    {mockStatusHistory.map((history, index) => (
                                                        <motion.div
                                                            key={history.id}
                                                            initial={{ opacity: 0, x: 20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: index * 0.1 }}
                                                            className="flex items-start gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-200/50 hover:bg-slate-100/50 transition-colors group cursor-pointer"
                                                        >
                                                            <div className="flex flex-col items-center">
                                                                <motion.div
                                                                    className="w-2 h-2 bg-orange-500 rounded-full"
                                                                    whileHover={{ scale: 1.5 }}
                                                                    transition={{ type: "spring", stiffness: 400 }}
                                                                />
                                                                {index < mockStatusHistory.length - 1 && (
                                                                    <motion.div
                                                                        className="w-0.5 h-8 bg-slate-300 mt-1"
                                                                        initial={{ scaleY: 0 }}
                                                                        animate={{ scaleY: 1 }}
                                                                        transition={{ delay: index * 0.1 + 0.3 }}
                                                                    />
                                                                )}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-sm font-semibold text-slate-900">
                                                                        {history.old_status}
                                                                    </span>
                                                                    <motion.div
                                                                        animate={{ x: [0, 5, 0] }}
                                                                        transition={{ duration: 2, repeat: Infinity }}
                                                                    >
                                                                        <ArrowRight className="w-3 h-3 text-slate-400" />
                                                                    </motion.div>
                                                                    <span className="text-sm font-semibold text-emerald-600">
                                                                        {history.new_status}
                                                                    </span>
                                                                </div>
                                                                <div className="text-xs text-slate-500 mb-1">
                                                                    {new Date(history.changed_at).toLocaleDateString()} • By {history.changed_by}
                                                                </div>
                                                                {history.reason && (
                                                                    <motion.p
                                                                        initial={{ opacity: 0 }}
                                                                        animate={{ opacity: 1 }}
                                                                        transition={{ delay: index * 0.1 + 0.2 }}
                                                                        className="text-xs text-slate-600 bg-white p-2 rounded-lg border"
                                                                    >
                                                                        {history.reason}
                                                                    </motion.p>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    ))}

                                                    {/* Upcoming Appointments */}
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.5 }}
                                                        className="mt-4 p-4 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 rounded-xl border border-blue-200/50"
                                                    >
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <CalendarDays className="w-4 h-4 text-blue-600" />
                                                            <h4 className="font-semibold text-sm text-slate-900">Next Appointment</h4>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-sm font-medium text-slate-900">Therapy Session</p>
                                                                <p className="text-xs text-slate-500">With Dr. Maria Rodriguez</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-sm font-bold text-blue-600">
                                                                    {new Date(mockClient.next_appointment).toLocaleDateString()}
                                                                </p>
                                                                <p className="text-xs text-slate-500">10:00 AM</p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* Enhanced Documents Tab */}
                            {activeTab === "documents" && (
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <motion.div
                                        variants={cardVariants}
                                        whileHover="hover"
                                    >
                                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                                            <CardHeader className="pb-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                                            <FileText className="w-5 h-5 text-white" />
                                                        </div>
                                                        <CardTitle className="text-lg">Document Management</CardTitle>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary" className="bg-violet-100 text-violet-700">
                                                            {mockDocuments.length}/{Object.keys(DOCUMENT_LABELS).length}
                                                        </Badge>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm font-medium"
                                                        >
                                                            <Upload className="w-4 h-4" />
                                                            Upload New
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {Object.entries(DOCUMENT_LABELS).map(([key, label], index) => {
                                                        const document = mockDocuments.find(doc => doc.label === key);
                                                        const hasDocument = !!document;

                                                        return (
                                                            <motion.div
                                                                key={key}
                                                                variants={itemVariants}
                                                                custom={index}
                                                            >
                                                                <Card
                                                                    className={`border-2 transition-all duration-300 hover:scale-105 cursor-pointer group ${hasDocument
                                                                            ? 'border-emerald-200 hover:border-emerald-300 bg-gradient-to-br from-emerald-50/50 to-green-50/50'
                                                                            : 'border-red-200 hover:border-red-300 bg-gradient-to-br from-red-50/50 to-rose-50/50'
                                                                        }`}
                                                                >
                                                                    <CardContent className="p-4">
                                                                        <div className="flex items-center justify-between mb-3">
                                                                            <motion.div
                                                                                className={`p-2 rounded-xl ${hasDocument ? 'bg-emerald-100' : 'bg-red-100'
                                                                                    }`}
                                                                                whileHover={{ rotate: 5, scale: 1.1 }}
                                                                                transition={{ type: "spring", stiffness: 400 }}
                                                                            >
                                                                                {hasDocument ? (
                                                                                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                                                                                ) : (
                                                                                    <XCircle className="w-5 h-5 text-red-600" />
                                                                                )}
                                                                            </motion.div>
                                                                            <Badge variant="secondary" className={
                                                                                hasDocument
                                                                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                                                                    : 'bg-red-100 text-red-800 border-red-200'
                                                                            }>
                                                                                {hasDocument ? 'Available' : 'Required'}
                                                                            </Badge>
                                                                        </div>
                                                                        <h4 className={`font-semibold text-sm mb-2 ${hasDocument ? 'text-emerald-800' : 'text-red-800'
                                                                            }`}>
                                                                            {label}
                                                                        </h4>
                                                                        {document ? (
                                                                            <motion.div
                                                                                initial={{ opacity: 0 }}
                                                                                animate={{ opacity: 1 }}
                                                                                transition={{ delay: index * 0.1 }}
                                                                            >
                                                                                <p className="text-xs text-slate-600">{document.name}</p>
                                                                                <div className="flex justify-between text-xs text-slate-500 mt-1">
                                                                                    <span>{document.size}</span>
                                                                                    <span>{document.type}</span>
                                                                                </div>
                                                                                <p className="text-xs text-slate-400 mt-1">
                                                                                    Uploaded {new Date(document.uploaded_at).toLocaleDateString()}
                                                                                </p>
                                                                            </motion.div>
                                                                        ) : (
                                                                            <p className="text-xs text-red-600">Document not uploaded</p>
                                                                        )}
                                                                        <motion.div
                                                                            className="mt-3 flex gap-2"
                                                                            initial={{ opacity: 0, y: 10 }}
                                                                            animate={{ opacity: 1, y: 0 }}
                                                                            transition={{ delay: index * 0.1 + 0.2 }}
                                                                        >
                                                                            {hasDocument ? (
                                                                                <>
                                                                                    <motion.button
                                                                                        whileHover={{ scale: 1.05 }}
                                                                                        whileTap={{ scale: 0.95 }}
                                                                                        className="flex-1 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                                                                                    >
                                                                                        <Eye className="w-3 h-3" />
                                                                                        View
                                                                                    </motion.button>
                                                                                    <motion.button
                                                                                        whileHover={{ scale: 1.05 }}
                                                                                        whileTap={{ scale: 0.95 }}
                                                                                        className="flex-1 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                                                                                    >
                                                                                        <Download className="w-3 h-3" />
                                                                                        Download
                                                                                    </motion.button>
                                                                                </>
                                                                            ) : (
                                                                                <motion.button
                                                                                    whileHover={{ scale: 1.05 }}
                                                                                    whileTap={{ scale: 0.95 }}
                                                                                    className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-1"
                                                                                >
                                                                                    <Upload className="w-3 h-3" />
                                                                                    Upload Now
                                                                                </motion.button>
                                                                            )}
                                                                        </motion.div>
                                                                    </CardContent>
                                                                </Card>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Document Statistics */}
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.6 }}
                                                    className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
                                                >
                                                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200">
                                                        <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                                                        <p className="text-2xl font-bold text-blue-600">{mockDocuments.length}</p>
                                                        <p className="text-xs text-blue-600">Uploaded</p>
                                                    </div>
                                                    <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200">
                                                        <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                                                        <p className="text-2xl font-bold text-emerald-600">
                                                            {Math.round((mockDocuments.length / Object.keys(DOCUMENT_LABELS).length) * 100)}%
                                                        </p>
                                                        <p className="text-xs text-emerald-600">Complete</p>
                                                    </div>
                                                    <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border border-amber-200">
                                                        <Clock className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                                                        <p className="text-2xl font-bold text-amber-600">
                                                            {Object.keys(DOCUMENT_LABELS).length - mockDocuments.length}
                                                        </p>
                                                        <p className="text-xs text-amber-600">Pending</p>
                                                    </div>
                                                    <div className="text-center p-4 bg-gradient-to-br from-violet-50 to-violet-100/50 rounded-xl border border-violet-200">
                                                        <Shield className="w-6 h-6 text-violet-600 mx-auto mb-2" />
                                                        <p className="text-2xl font-bold text-violet-600">100%</p>
                                                        <p className="text-xs text-violet-600">Secure</p>
                                                    </div>
                                                </motion.div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </motion.div>
                            )}
                            {/* Add other tabs similarly with enhanced animations and design */}
                        </TabsContent>
                    </motion.div>
                </AnimatePresence>
            </Tabs>
        </div>
    );
};

export default Page;