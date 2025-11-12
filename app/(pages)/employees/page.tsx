'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Calendar,
    Mail,
    Phone,
    Briefcase,
    GraduationCap,
    Award,
    Clock,
    MapPin,
    User,
    Building,
    Star,
    TrendingUp,
    Target,
    Zap,
    Search,
    Bell,
    Settings
} from 'lucide-react';
import { EmployeeWorkingHoursReport } from '@/types/working-hours.types';
import { EmployeeContract } from '@/schemas/employee.schema';
import { cn } from '@/utils/cn';
import { useParams } from 'next/navigation';
import { useEmployee } from '@/hooks/employee/use-employee';
import { EmployeeDetailsResponse } from '@/types/employee.types';
import { Id } from '@/common/types/types';
import { useEducation } from '@/hooks/education/use-education';
import { useExperience } from '@/hooks/experience/use-experience';
import { useCertificate } from '@/hooks/certificate/use-certificate';
import { useWorkingHours } from '@/hooks/working-hours/use-working-hours';
import { getISOWeek, getISOWeekYear } from 'date-fns';
import withAuth, { AUTH_MODE } from '@/common/hocs/with-auth';
import withPermissions from '@/common/hocs/with-permissions';
import Routes from '@/common/routes';
import { PermissionsObjects } from '@/common/data/permission.data';





const mockCertificates = [
    {
        name: "Project Management Professional",
        issued_by: "PMI",
        date_issued: new Date("2022-03-15"),
        employee_id: "1",
    },
    {
        name: "AWS Solutions Architect",
        issued_by: "Amazon Web Services",
        date_issued: new Date("2021-08-20"),
        employee_id: "1",
    },
];



const mockExperience = [
    {
        job_title: "Senior Developer",
        company_name: "Tech Solutions Inc.",
        start_date: new Date("2020-01-15"),
        end_date: new Date("2023-01-10"),
        description: "Led development team and implemented new features",
        employee_id: "1",
    },
];

const mockWorkingHoursReport: EmployeeWorkingHoursReport = {
    employee_id: "1",
    period: {
        date_range: {
            start: "2024-01-01",
            end: "2024-01-31",
        },
        is_current_month: true,
        month: 1,
        month_name: "January",
        year: 2024,
    },
    summary: {
        appointment_hours: 20,
        shift_hours: 120,
        total_days_worked: 22,
        total_hours: 140,
        over_time: 8,
    },
    working_hours: [
        {
            id: "1",
            description: "Regular shift",
            duration_hours: 8,
            start_time: "2024-01-15T09:00:00",
            end_time: "2024-01-15T17:00:00",
            location: "Main Office",
            location_id: "1",
            type: "schedule",
            status: "CONFIRMED",
        },
    ],
};

// Color themes for tabs
const tabThemes = {
    overview: {
        selected: "!bg-blue-500 !text-white !border-blue-600",
        icon: "!text-blue-600",
        gradient: "!from-blue-50 !to-blue-100",
        border: "!border-blue-200"
    },
    contract: {
        selected: "!bg-emerald-500 !text-white !border-emerald-600",
        icon: "!text-emerald-600",
        gradient: "!from-emerald-50 !to-emerald-100",
        border: "!border-emerald-200"
    },
    education: {
        selected: "!bg-purple-500 !text-white !border-purple-600",
        icon: "!text-purple-600",
        gradient: "!from-purple-50 !to-purple-100",
        border: "!border-purple-200"
    },
    certificates: {
        selected: "!bg-amber-500 !text-white !border-amber-600",
        icon: "!text-amber-600",
        gradient: "!from-amber-50 !to-amber-100",
        border: "!border-amber-200"
    },
    experience: {
        selected: "!bg-indigo-500 !text-white !border-indigo-600",
        icon: "!text-indigo-600",
        gradient: "!from-indigo-50 !to-indigo-100",
        border: "!border-indigo-200"
    },
    hours: {
        selected: "!bg-rose-500 !text-white !border-rose-600",
        icon: "!text-rose-600",
        gradient: "!from-rose-50 !to-rose-100",
        border: "!border-rose-200"
    }
};

function EmployeeOverviewPage() {
    const { employeeId } = useParams();
    const { readOne, readEmployeeContract } = useEmployee({ autoFetch: false });
    const [employeeContract, setEmployeeContract] = useState<EmployeeContract | undefined>(undefined);
    const [activeTab, setActiveTab] = useState('overview');
    const [employee, setEmployee] = useState<EmployeeDetailsResponse | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const { educations, isLoading: isEduLoading } = useEducation({ autoFetch: true, employeeId: employeeId as string });
    const { experiences, isLoading: isExpLoading } = useExperience({ autoFetch: true, employeeId: employeeId as string });
    const { certificates, isLoading: isCertLoading } = useCertificate({ autoFetch: true, employeeId: employeeId as string });
    const currentDate = new Date();
    const currentWeek = getISOWeek(currentDate);
    const currentYear = getISOWeekYear(currentDate);
    const { workingHoursReport, isLoading: isWkLoading } = useWorkingHours({ autoFetch: true, employee_id: employeeId as string, week: currentWeek.toString(), year: currentYear.toString(), });

    useEffect(() => {
        const fetchEmployeeContract = async (id: Id) => {
            try {
                setIsLoading(true);
                const data = await readEmployeeContract(id);
                setEmployeeContract(data);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);

            }
        }
        const fetchEmployee = async (id: Id) => {
            console.log(id)
            setIsLoading(true);
            const data = await readOne(id);
            setEmployee(data);
            setIsLoading(false);
        }
        if (employeeId) fetchEmployee(employeeId as string);
        if (employeeId) fetchEmployeeContract(employeeId as string);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employeeId]);

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('nl-NL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    };

    const getTabTheme = (tab: string) => {
        return tabThemes[tab as keyof typeof tabThemes] || tabThemes.overview;
    };
    if (isLoading || !employee || !employeeContract || isEduLoading || isExpLoading || isCertLoading || isWkLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-violet-600 rounded-full"></div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                    Employee Dashboard
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
                </div>

                {/* Employee Profile Card */}
                <Card className="mb-8 shadow-2xl border-0 bg-gradient-to-br from-white to-blue-50/50 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-full -ml-12 -mb-12"></div>
                    <CardContent className="p-8 relative">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-6">
                                <Avatar className="h-24 w-24 border-4 border-white shadow-2xl ring-4 ring-blue-100">
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                                        {getInitials(employee.first_name, employee.last_name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-800">
                                        {employee.first_name} {employee.last_name}
                                    </h2>
                                    <p className="text-slate-600 flex items-center gap-2 mt-2 text-lg">
                                        <Briefcase className="h-5 w-5 text-blue-500" />
                                        Employee #{employee.employee_number}
                                    </p>
                                    <div className="flex items-center gap-3 mt-4">
                                        <Badge
                                            variant={employee.is_subcontractor ? "secondary" : "default"}
                                            className={`text-sm px-3 py-1 ${employee.is_subcontractor
                                                ? "bg-orange-100 text-orange-800 border-orange-200"
                                                : "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200"
                                                }`}
                                        >
                                            {employee.is_subcontractor ? "Subcontractor" : "Full-time"}
                                        </Badge>
                                        <Badge
                                            variant={employee.out_of_service ? "destructive" : "default"}
                                            className={`text-sm px-3 py-1 ${employee.out_of_service
                                                ? "bg-red-100 text-red-800 border-red-200"
                                                : "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200"
                                                }`}
                                        >
                                            {employee.out_of_service ? "Out of Service" : "Active"}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg border-0">
                                Edit Profile
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full h-16 grid-cols-6 bg-white/80 backdrop-blur-sm p-2 rounded-2xl shadow-lg border border-slate-200">
                        {[
                            { value: 'overview', label: 'Overview', icon: User },
                            { value: 'contract', label: 'Contract', icon: Briefcase },
                            { value: 'education', label: 'Education', icon: GraduationCap },
                            { value: 'certificates', label: 'Certificates', icon: Award },
                            { value: 'experience', label: 'Experience', icon: Building },
                            { value: 'hours', label: 'Hours', icon: Clock },
                        ].map(({ value, label, icon: Icon }) => {
                            const theme = getTabTheme(value);
                            return (
                                <TabsTrigger
                                    key={value}
                                    value={value}
                                    className={cn("flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 text-slate-600 hover:text-slate-800 hover:bg-slate-100",
                                        activeTab === value && theme.selected,
                                    )}
                                >
                                    <Icon className={`h-5 w-5 ${activeTab === value ? 'text-white' : theme.icon}`} />
                                    {label}
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Personal Information */}
                            <Card className={`shadow-xl border-0 bg-gradient-to-br ${getTabTheme('overview').gradient} backdrop-blur-sm relative overflow-hidden`}>
                                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mr-10 -mt-10"></div>
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-3 text-slate-800">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <User className="h-6 w-6 text-blue-600" />
                                        </div>
                                        Personal Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 relative">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/50 p-3 rounded-lg border border-blue-100">
                                            <p className="text-sm font-medium text-slate-600">Date of Birth</p>
                                            <p className="text-slate-800 font-semibold flex items-center gap-2 mt-1">
                                                <Calendar className="h-4 w-4 text-blue-600" />
                                                {formatDate(new Date(employee.date_of_birth))}
                                            </p>
                                        </div>
                                        <div className="bg-white/50 p-3 rounded-lg border border-blue-100">
                                            <p className="text-sm font-medium text-slate-600">Gender</p>
                                            <p className="text-slate-800 font-semibold mt-1">{employee.gender}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Contact Information */}
                            <Card className={`shadow-xl border-0 bg-gradient-to-br ${getTabTheme('overview').gradient} backdrop-blur-sm relative overflow-hidden`}>
                                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mr-10 -mt-10"></div>
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-3 text-slate-800">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Mail className="h-6 w-6 text-blue-600" />
                                        </div>
                                        Contact Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-white/50 p-3 rounded-lg border border-blue-100">
                                        <p className="text-sm font-medium text-slate-600">Work Email</p>
                                        <p className="text-slate-800 font-semibold flex items-center gap-2 mt-1">
                                            <Mail className="h-4 w-4 text-blue-600" />
                                            {employee.email}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/50 p-3 rounded-lg border border-blue-100">
                                            <p className="text-sm font-medium text-slate-600">Work Phone</p>
                                            <p className="text-slate-800 font-semibold flex items-center gap-2 mt-1">
                                                <Phone className="h-4 w-4 text-blue-600" />
                                                {employee.work_phone_number}
                                            </p>
                                        </div>
                                        <div className="bg-white/50 p-3 rounded-lg border border-blue-100">
                                            <p className="text-sm font-medium text-slate-600">Private Phone</p>
                                            <p className="text-slate-800 font-semibold mt-1">{employee.private_phone_number}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Contract Tab */}
                    <TabsContent value="contract" className="space-y-6">
                        <Card className={`shadow-xl border-0 bg-gradient-to-br ${getTabTheme('contract').gradient} backdrop-blur-sm relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full -mr-10 -mt-10"></div>
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3 text-slate-800">
                                    <div className="p-2 bg-emerald-100 rounded-lg">
                                        <Briefcase className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    Contract Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {[
                                        { label: "Contract Type", value: employeeContract.contract_type, badge: true },
                                        { label: "Contract Hours", value: `${employeeContract.contract_hours}h/week` },
                                        { label: "Rate", value: `€${employeeContract.contract_rate}/h` },
                                        { label: "Start Date", value: employeeContract.contract_start_date },
                                        { label: "End Date", value: employeeContract.contract_end_date },
                                        { label: "Status", value: "Active", badge: true }
                                    ].map((item, idx) => (
                                        <div key={idx} className="bg-white/50 p-4 rounded-xl border border-emerald-100">
                                            <p className="text-sm font-medium text-slate-600">{item.label}</p>
                                            {item.badge ? (
                                                <Badge className={`mt-2 ${item.value === 'ZZP'
                                                    ? 'bg-purple-100 text-purple-800 border-purple-200'
                                                    : item.value === 'Active'
                                                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                                        : 'bg-blue-100 text-blue-800 border-blue-200'
                                                    }`}>
                                                    {item.value}
                                                </Badge>
                                            ) : (
                                                <p className="text-slate-800 font-semibold text-lg mt-1">{item.value}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Education Tab */}
                    <TabsContent value="education" className="space-y-4">
                        {
                            !educations || educations?.length === 0 ?
                                <Card className={`shadow-xl border-0 bg-gradient-to-br ${getTabTheme('education').gradient} backdrop-blur-sm relative overflow-hidden`}>
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full -mr-8 -mt-8"></div>
                                    <CardContent className="p-6">
                                        <div className="flex flex-col items-center justify-center text-center py-10">
                                            <GraduationCap className="h-12 w-12 text-purple-600 mb-4" />
                                            <h3 className="font-bold text-2xl text-slate-800 mb-2">No Education Records</h3>
                                            <p className="text-slate-600 text-lg">It seems that there are no education records added for this employee yet.</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                : null
                        }
                        {educations?.map((edu, index) => (
                            <Card key={index} className={`shadow-xl border-0 bg-gradient-to-br ${getTabTheme('education').gradient} backdrop-blur-sm relative overflow-hidden`}>
                                <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full -mr-8 -mt-8"></div>
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="p-2 bg-purple-100 rounded-lg">
                                                    <GraduationCap className="h-5 w-5 text-purple-600" />
                                                </div>
                                                <h3 className="font-bold text-xl text-slate-800">{edu.institution_name}</h3>
                                            </div>
                                            <p className="text-slate-600 text-lg">{edu.degree} in {edu.field_of_study}</p>
                                            <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                                                <span className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full border border-purple-100">
                                                    <Calendar className="h-4 w-4" />
                                                    {formatDate(new Date(edu.start_date))} - {formatDate(new Date(edu.end_date))}
                                                </span>
                                            </div>
                                        </div>
                                        <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-sm px-3 py-1">
                                            Completed
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </TabsContent>

                    {/* Certificates Tab */}
                    <TabsContent value="certificates" className="space-y-4">
                        {
                            !certificates || certificates?.length === 0 ?
                                <Card className={`shadow-xl border-0 bg-gradient-to-br ${getTabTheme('certificates').gradient} backdrop-blur-sm relative overflow-hidden`}>
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-full -mr-8 -mt-8"></div>
                                    <CardContent className="p-6">
                                        <div className="flex flex-col items-center justify-center text-center py-10">
                                            <Award className="h-12 w-12 text-amber-600 mb-4" />
                                            <h3 className="font-bold text-2xl text-slate-800 mb-2">No Certificate Records</h3>
                                            <p className="text-slate-600 text-lg">It seems that there are no certificate records added for this employee yet.</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                : null
                        }
                        {certificates?.map((cert, index) => (
                            <Card key={index} className={`shadow-xl border-0 bg-gradient-to-br ${getTabTheme('certificates').gradient} backdrop-blur-sm relative overflow-hidden`}>
                                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-full -mr-8 -mt-8"></div>
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-amber-100 rounded-xl">
                                                <Award className="h-6 w-6 text-amber-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl text-slate-800">{cert.name}</h3>
                                                <p className="text-slate-600 text-lg mt-1">Issued by {cert.issued_by}</p>
                                                <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                                                    <span className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full border border-amber-100">
                                                        <Calendar className="h-4 w-4" />
                                                        Issued on {formatDate(new Date(cert.date_issued))}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </TabsContent>

                    {/* Experience Tab */}
                    <TabsContent value="experience" className="space-y-4">
                        {
                            !experiences || experiences?.length === 0 ?
                                <Card className={`shadow-xl border-0 bg-gradient-to-br ${getTabTheme('experience').gradient} backdrop-blur-sm relative overflow-hidden`}>
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-full -mr-8 -mt-8"></div>
                                    <CardContent className="p-6">
                                        <div className="flex flex-col items-center justify-center text-center py-10">
                                            <Building className="h-12 w-12 text-indigo-600 mb-4" />
                                            <h3 className="font-bold text-2xl text-slate-800 mb-2">No Experience Records</h3>
                                            <p className="text-slate-600 text-lg">It seems that there are no experience records added for this employee yet.</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                : null
                        }
                        {experiences?.map((exp, index) => (
                            <Card key={index} className={`shadow-xl border-0 bg-gradient-to-br ${getTabTheme('experience').gradient} backdrop-blur-sm relative overflow-hidden`}>
                                <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-full -mr-8 -mt-8"></div>
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-indigo-100 rounded-xl">
                                                <Building className="h-6 w-6 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl text-slate-800">{exp.job_title}</h3>
                                                <p className="text-slate-600 text-lg mt-1">{exp.company_name}</p>
                                                <p className="text-slate-500 mt-3 bg-white/50 p-3 rounded-lg border border-indigo-100">
                                                    {exp.description}
                                                </p>
                                                <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                                                    <span className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full border border-indigo-100">
                                                        <Calendar className="h-4 w-4" />
                                                        {formatDate(new Date(exp.start_date))} - {formatDate(new Date(exp.end_date))}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <TrendingUp className="h-6 w-6 text-indigo-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </TabsContent>

                    {/* Working Hours Tab */}
                    <TabsContent value="hours" className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                            {[
                                { value: workingHoursReport?.summary.total_hours, label: "Total Hours", icon: Target, gradient: "from-blue-500 to-cyan-500" },
                                { value: workingHoursReport?.summary.total_days_worked, label: "Days Worked", icon: Calendar, gradient: "from-emerald-500 to-green-500" },
                                { value: workingHoursReport?.summary.shift_hours, label: "Shift Hours", icon: Clock, gradient: "from-purple-500 to-indigo-500" },
                                { value: workingHoursReport?.summary.appointment_hours, label: "Appointment Hours", icon: Zap, gradient: "from-orange-500 to-amber-500" },
                                { value: workingHoursReport?.summary.over_time, label: "Overtime", icon: TrendingUp, gradient: "from-rose-500 to-pink-500" },
                            ].map((item, index) => (
                                <Card key={index} className={`bg-gradient-to-br ${item.gradient} text-white shadow-xl border-0 transform hover:scale-105 transition-transform duration-300`}>
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <div className="flex justify-center mb-3">
                                                <div className="p-2 bg-white/20 rounded-lg">
                                                    <item.icon className="h-6 w-6" />
                                                </div>
                                            </div>
                                            <p className="text-3xl font-bold">{item.value}h</p>
                                            <p className="text-white/90 text-sm mt-2">{item.label}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Working Hours Details */}
                        <Card className={`shadow-xl border-0 bg-gradient-to-br ${getTabTheme('hours').gradient} backdrop-blur-sm relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/10 rounded-full -mr-10 -mt-10"></div>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-slate-800">
                                    <div className="p-2 bg-rose-100 rounded-lg">
                                        <Clock className="h-6 w-6 text-rose-600" />
                                    </div>
                                    Working Hours Details - {mockWorkingHoursReport.period.month_name} {mockWorkingHoursReport.period.year}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {mockWorkingHoursReport.working_hours.map((entry, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-rose-100 backdrop-blur-sm">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-xl ${entry.type === 'appointment'
                                                    ? 'bg-purple-100 text-purple-600'
                                                    : 'bg-blue-100 text-blue-600'
                                                    }`}>
                                                    {entry.type === 'appointment' ?
                                                        <Zap className="h-5 w-5" /> :
                                                        <Clock className="h-5 w-5" />
                                                    }
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-800 text-lg">{entry.description}</p>
                                                    <p className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                                                        <MapPin className="h-4 w-4" />
                                                        {entry.location}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-slate-800 text-lg">{entry.duration_hours}h</p>
                                                <p className="text-sm text-slate-600">
                                                    {new Date(entry.start_time).toLocaleTimeString('nl-NL', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })} - {new Date(entry.end_time).toLocaleTimeString('nl-NL', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                                <Badge
                                                    className={`mt-2 ${entry.status === 'CONFIRMED'
                                                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                                        : entry.status === 'PENDING'
                                                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                                                            : 'bg-red-100 text-red-800 border-red-200'
                                                        }`}
                                                >
                                                    {entry.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
export default withAuth(
  withPermissions(EmployeeOverviewPage, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permission
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login } 
    );