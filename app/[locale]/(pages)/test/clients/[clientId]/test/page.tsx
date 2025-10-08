"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  User, Mail, Phone, MapPin, Calendar, VenusAndMars, Building, 
  Briefcase, FileDigit, Shield, Navigation, HeartPulse, 
  FileText, Clock, Users, Share2, Waypoints, Receipt, 
  FileBadge, CheckCircle, XCircle, Plus, ArrowRight,
  Home, Stethoscope, ClipboardList, BarChart3, TrendingUp,
  Activity, ShieldCheck, AlertCircle, Download, Eye,
  MessageCircle, Bell, Settings, Search, Filter,
  ChevronRight, Star, Award, Target, Zap
} from 'lucide-react';
import { useParams } from 'next/navigation';
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
};

type Contract = {
  id: number;
  care_name: string;
  price: number;
  start_date: string;
  status: string;
  progress: number;
  next_review: string;
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
  care_level: "Level 2"
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
    availability: "available"
  },
  {
    id: 2,
    employee_name: "Lisa Chen",
    role: "Therapist",
    start_date: "2024-02-01",
    specialization: "Cognitive Behavioral Therapy",
    availability: "available"
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
    next_review: "2024-04-15"
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
  const { clientId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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
                    <AvatarImage src={mockClient.profile_picture} />
                    <AvatarFallback className="bg-white/20 text-white text-2xl font-bold backdrop-blur-sm">
                      {mockClient.first_name[0]}{mockClient.last_name[0]}
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
                    {mockClient.first_name} {mockClient.last_name}
                  </h2>
                  <div className="flex items-center gap-6 text-white/80">
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
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
                  <p className="text-white/80 text-sm">Client ID</p>
                  <p className="font-mono font-bold text-xl">#{mockClient.id}</p>
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
        <TabsList className="grid w-full grid-cols-5 p-1 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm">
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
                    { icon: Calendar, label: "Date of Birth", value: mockClient.date_of_birth },
                    { icon: VenusAndMars, label: "Gender", value: mockClient.gender },
                    { icon: MapPin, label: "Birthplace", value: mockClient.birthplace },
                    { icon: Building, label: "Care Level", value: mockClient.care_level }
                  ].map((item, index) => (
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
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Quick Actions */}
            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-emerald-600" />
                  </div>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "New Report", icon: FileText, color: "bg-blue-500 hover:bg-blue-600" },
                    { label: "Schedule", icon: Calendar, color: "bg-emerald-500 hover:bg-emerald-600" },
                    { label: "Message", icon: MessageCircle, color: "bg-violet-500 hover:bg-violet-600" },
                    { label: "Documents", icon: Download, color: "bg-amber-500 hover:bg-amber-600" }
                  ].map((action) => (
                    <Button key={action.label} className={`h-16 ${action.color} text-white transition-all hover:scale-105`}>
                      <action.icon className="w-5 h-5 mr-2" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Recent Activity */}
            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm lg:col-span-2 xl:col-span-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-4 h-4 text-amber-600" />
                    </div>
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockReports.map((report) => (
                    <div key={report.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 group-hover:scale-150 transition-transform"></div>
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
                            <span key={tag} className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
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
                    {mockContacts.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockContacts.map((contact) => (
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
                    {mockAddresses.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockAddresses.map((address) => (
                  <div key={address.id} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
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
                    {mockDiagnosis.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockDiagnosis.map((diagnosis) => (
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
                        Diagnosed on {new Date(diagnosis.created_at).toLocaleDateString()}
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
                  <CardTitle className="text-lg">Active Treatment</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockContracts.map((contract) => (
                  <div key={contract.id} className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
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
                    {mockEmployees.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockEmployees.map((employee) => (
                  <Card key={employee.id} className="border-0 shadow-xs hover:shadow-md transition-all duration-300 group">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-12 h-12 border-2 border-indigo-200 group-hover:border-indigo-300 transition-colors">
                            <AvatarFallback className="bg-indigo-100 text-indigo-600">
                              {employee.employee_name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            employee.availability === 'available' ? 'bg-emerald-400' :
                            employee.availability === 'busy' ? 'bg-amber-400' : 'bg-slate-400'
                          }`}></div>
                        </div>
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
                    {mockStatusHistory.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockStatusHistory.map((history, index) => (
                  <div key={history.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors group">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full group-hover:scale-150 transition-transform"></div>
                      {index < mockStatusHistory.length - 1 && (
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
                    {mockDocuments.length}/{Object.keys(DOCUMENT_LABELS).length}
                  </Badge>
                  <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(DOCUMENT_LABELS).map(([key, label]) => {
                  const document = mockDocuments.find(doc => doc.label === key);
                  const hasDocument = !!document;
                  
                  return (
                    <Card 
                      key={key} 
                      className={`border-2 transition-all duration-300 hover:scale-105 cursor-pointer group ${
                        hasDocument 
                          ? 'border-emerald-200 hover:border-emerald-300 bg-emerald-50/50' 
                          : 'border-red-200 hover:border-red-300 bg-red-50/50'
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`p-2 rounded-lg ${
                            hasDocument ? 'bg-emerald-100' : 'bg-red-100'
                          }`}>
                            {hasDocument ? (
                              <CheckCircle className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                          <Badge variant="secondary" className={
                            hasDocument 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-red-100 text-red-800'
                          }>
                            {hasDocument ? 'Available' : 'Required'}
                          </Badge>
                        </div>
                        <h4 className={`font-semibold text-sm mb-2 ${
                          hasDocument ? 'text-emerald-800' : 'text-red-800'
                        }`}>
                          {label}
                        </h4>
                        {document ? (
                          <div className="space-y-1">
                            <p className="text-xs text-slate-600">{document.name}</p>
                            <div className="flex justify-between text-xs text-slate-500">
                              <span>{document.size}</span>
                              <span>{document.type}</span>
                            </div>
                            <p className="text-xs text-slate-400">
                              Uploaded {new Date(document.uploaded_at).toLocaleDateString()}
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs text-red-600">Document not uploaded</p>
                        )}
                        <div className="mt-3 flex gap-2">
                          {hasDocument ? (
                            <>
                              <Button size="sm" variant="outline" className="h-7 text-xs">
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 text-xs">
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </Button>
                            </>
                          ) : (
                            <Button size="sm" className="h-7 text-xs bg-red-600 hover:bg-red-700">
                                <Plus className="w-3 h-3 mr-1" />
                                Upload
                              </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
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

const Upload = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

export default Page;