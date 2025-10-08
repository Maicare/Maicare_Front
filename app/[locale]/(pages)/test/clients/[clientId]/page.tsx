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
  Home, Stethoscope, ClipboardList, BarChart3
} from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';

// Mock data types
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
};

type Address = {
  id: number;
  address: string;
  belongs_to: string;
  city: string;
  phone_number: string;
  zip_code: string;
};

type Contact = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  relationship: string;
  phone?: string;
};

type Employee = {
  id: number;
  employee_name: string;
  role: string;
  start_date: string;
  profile_picture?: string;
};

type Contract = {
  id: number;
  care_name: string;
  price: number;
  start_date: string;
  status: string;
};

type Report = {
  id: number;
  date: string;
  report_text: string;
  emotional_state: string;
  type: string;
  employee_profile_picture?: string;
};

type Diagnosis = {
  id: number;
  title: string;
  diagnosis_code: string;
  created_at: string;
  description: string;
};

type Document = {
  id: number;
  label: string;
  name: string;
  uploaded_at: string;
};

type StatusHistory = {
  id: number;
  old_status: string;
  new_status: string;
  changed_at: string;
  reason?: string;
};

// Mock data
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
  location: "Amsterdam Center"
};

const mockAddresses: Address[] = [
  {
    id: 1,
    address: "Main Residence",
    belongs_to: "Sarah Johnson",
    city: "Amsterdam",
    phone_number: "+31 6 12345678",
    zip_code: "1234 AB"
  },
  {
    id: 2,
    address: "Work Address",
    belongs_to: "Tech Company",
    city: "Amsterdam",
    phone_number: "+31 20 1234567",
    zip_code: "1234 CD"
  }
];

const mockContacts: Contact[] = [
  {
    id: 1,
    first_name: "Michael",
    last_name: "Johnson",
    email: "michael.j@example.com",
    relationship: "Spouse",
    phone: "+31 6 87654321"
  },
  {
    id: 2,
    first_name: "Emily",
    last_name: "Johnson",
    email: "emily.j@example.com",
    relationship: "Daughter"
  }
];

const mockEmployees: Employee[] = [
  {
    id: 1,
    employee_name: "Dr. Maria Rodriguez",
    role: "Primary Care Physician",
    start_date: "2024-01-15"
  },
  {
    id: 2,
    employee_name: "Lisa Chen",
    role: "Therapist",
    start_date: "2024-02-01"
  }
];

const mockContracts: Contract[] = [
  {
    id: 1,
    care_name: "Weekly Therapy Sessions",
    price: 120,
    start_date: "2024-01-15",
    status: "Active"
  },
  {
    id: 2,
    care_name: "Medical Consultations",
    price: 85,
    start_date: "2024-01-20",
    status: "Active"
  }
];

const mockReports: Report[] = [
  {
    id: 1,
    date: "2024-03-01",
    report_text: "Client showed significant improvement in mood and engagement during today's session. Discussed coping strategies for anxiety.",
    emotional_state: "Good",
    type: "Therapy Session"
  },
  {
    id: 2,
    date: "2024-02-25",
    report_text: "Regular check-up completed. Vital signs stable. Discussed medication adherence.",
    emotional_state: "Stable",
    type: "Medical Check-up"
  }
];

const mockDiagnosis: Diagnosis[] = [
  {
    id: 1,
    title: "Generalized Anxiety Disorder",
    diagnosis_code: "F41.1",
    created_at: "2024-01-15",
    description: "Excessive anxiety and worry occurring more days than not for at least 6 months"
  },
  {
    id: 2,
    title: "Major Depressive Disorder",
    diagnosis_code: "F32.9",
    created_at: "2024-01-20",
    description: "Single episode without psychotic features"
  }
];

const mockDocuments: Document[] = [
  { id: 1, label: "id_document", name: "Passport Copy", uploaded_at: "2024-01-10" },
  { id: 2, label: "insurance_card", name: "Insurance Card", uploaded_at: "2024-01-10" },
  { id: 3, label: "medical_history", name: "Medical History", uploaded_at: "2024-01-15" }
];

const mockStatusHistory: StatusHistory[] = [
  {
    id: 1,
    old_status: "Pending",
    new_status: "Active",
    changed_at: "2024-01-15",
    reason: "Initial assessment completed"
  },
  {
    id: 2,
    old_status: "Active",
    new_status: "Review",
    changed_at: "2024-02-01",
    reason: "Quarterly review"
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
  const isLoading = false; // Since we're using mock data

  // Status color helper
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'review': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // State color helper
  const getStateColor = (state: string) => {
    switch (state?.toLowerCase()) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'stable': return 'bg-blue-100 text-blue-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
            <p className="text-gray-600 mt-1">Comprehensive overview of client information and care</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={getStatusColor(mockClient.status)}>
              {mockClient.status}
            </Badge>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Note
            </Button>
          </div>
        </div>
      </div>

      {/* Client Profile Header */}
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                <AvatarImage src={mockClient.profile_picture} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                  {mockClient.first_name[0]}{mockClient.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {mockClient.first_name} {mockClient.last_name}
                </h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {mockClient.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {mockClient.phone_number}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {mockClient.date_of_birth}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Client ID</p>
              <p className="font-mono font-bold text-gray-700">#{mockClient.id}</p>
              <Progress value={75} className="w-32 mt-2" />
              <p className="text-xs text-gray-500 mt-1">Profile Completion: 75%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-8 gap-1 p-1 bg-gray-100 rounded-xl">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Personal
          </TabsTrigger>
          <TabsTrigger value="medical" className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4" />
            Medical
          </TabsTrigger>
          <TabsTrigger value="care" className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            Care Team
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Documents
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Profile Information */}
            <Card>
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
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Date of Birth:</span>
                    <span className="font-medium text-gray-900">{mockClient.date_of_birth}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <VenusAndMars className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Gender:</span>
                    <span className="font-medium text-gray-900">{mockClient.gender}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Birthplace:</span>
                    <span className="font-medium text-gray-900">{mockClient.birthplace}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Work Information */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Work Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Organization</p>
                    <p className="font-medium text-gray-900">{mockClient.organisation}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">File Number</p>
                    <p className="font-medium text-gray-900">{mockClient.filenumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">BSN</p>
                    <p className="font-medium text-gray-900">{mockClient.bsn}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Source</p>
                    <p className="font-medium text-gray-900">{mockClient.source}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{mockContracts.length}</p>
                    <p className="text-sm text-blue-600">Active Contracts</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{mockReports.length}</p>
                    <p className="text-sm text-green-600">Reports</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{mockEmployees.length}</p>
                    <p className="text-sm text-orange-600">Care Team</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{mockDiagnosis.length}</p>
                    <p className="text-sm text-red-600">Diagnoses</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Reports */}
            <Card className="lg:col-span-2 xl:col-span-3">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-amber-600" />
                    </div>
                    <CardTitle className="text-lg">Recent Reports</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockReports.map((report) => (
                    <Card key={report.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                            {report.type}
                          </Badge>
                          <Badge variant="secondary" className={getStateColor(report.emotional_state)}>
                            {report.emotional_state}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-3 mb-3">
                          {report.report_text}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{new Date(report.date).toLocaleDateString()}</span>
                          <span>By Care Team</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Personal Tab */}
        <TabsContent value="personal" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg">Emergency Contacts</CardTitle>
                  </div>
                  <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                    {mockContacts.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockContacts.map((contact) => (
                  <Card key={contact.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            {contact.first_name[0]}{contact.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm">
                              {contact.first_name} {contact.last_name}
                            </h4>
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-xs">
                              {contact.relationship}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Mail className="w-3 h-3" />
                            <span>{contact.email}</span>
                          </div>
                          {contact.phone && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <Phone className="w-3 h-3" />
                              <span>{contact.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Addresses */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Home className="w-4 h-4 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">Addresses</CardTitle>
                  </div>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                    {mockAddresses.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockAddresses.map((address) => (
                  <div key={address.id} className="p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <h4 className="font-semibold text-sm text-gray-900">{address.address}</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Belongs To</p>
                        <p className="font-medium">{address.belongs_to}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">City</p>
                        <p className="font-medium">{address.city}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Phone</p>
                        <p className="font-medium">{address.phone_number}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Postal Code</p>
                        <p className="font-medium">{address.zip_code}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Medical Tab */}
        <TabsContent value="medical" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Medical Diagnoses */}
            <Card>
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
                  <Card key={diagnosis.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          {diagnosis.title}
                        </Badge>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {diagnosis.diagnosis_code}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">
                        {diagnosis.description}
                      </p>
                      <div className="text-xs text-gray-500">
                        Diagnosed on {new Date(diagnosis.created_at).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Treatment Plan */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <ClipboardList className="w-4 h-4 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Active Contracts</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockContracts.map((contract) => (
                  <Card key={contract.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-gray-900">
                          {contract.care_name}
                        </h4>
                        <Badge variant="secondary" className="bg-green-50 text-green-700">
                          €{contract.price}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Started {new Date(contract.start_date).toLocaleDateString()}</span>
                        <Badge variant="outline" className={getStatusColor(contract.status)}>
                          {contract.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Care Team Tab */}
        <TabsContent value="care" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Involved Employees */}
            <Card>
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
                  <Card key={employee.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-indigo-100 text-indigo-600">
                            {employee.employee_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm">
                              {employee.employee_name}
                            </h4>
                            <Badge variant="secondary" className="bg-purple-50 text-purple-700 text-xs">
                              {employee.role}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>Since {new Date(employee.start_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Status History */}
            <Card>
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
                {mockStatusHistory.map((history) => (
                  <div key={history.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900">
                          {history.old_status}
                        </span>
                        <ArrowRight className="w-3 h-3 text-gray-400" />
                        <span className="text-sm font-semibold text-green-600">
                          {history.new_status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(history.changed_at).toLocaleDateString()}
                        {history.reason && <span className="ml-2">• {history.reason}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-violet-600" />
                  </div>
                  <CardTitle className="text-lg">Documents</CardTitle>
                </div>
                <Badge variant="secondary" className="bg-violet-50 text-violet-700">
                  {mockDocuments.length}/{Object.keys(DOCUMENT_LABELS).length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(DOCUMENT_LABELS).map(([key, label]) => {
                  const document = mockDocuments.find(doc => doc.label === key);
                  const hasDocument = !!document;
                  
                  return (
                    <Card 
                      key={key} 
                      className={`hover:shadow-md transition-all cursor-pointer ${
                        hasDocument ? 'border-green-200' : 'border-red-200'
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          {hasDocument ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          <Badge variant="secondary" className={
                            hasDocument 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }>
                            {hasDocument ? 'Available' : 'Missing'}
                          </Badge>
                        </div>
                        <h4 className={`font-semibold text-sm mb-2 ${
                          hasDocument ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {label}
                        </h4>
                        {document && (
                          <p className="text-xs text-gray-500">
                            Uploaded {new Date(document.uploaded_at).toLocaleDateString()}
                          </p>
                        )}
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

export default Page;