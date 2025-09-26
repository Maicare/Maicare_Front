// // components/admin-dashboard.tsx
// 'use client';

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { 
//   FileText, 
//   Users, 
//   Calendar, 
//   CreditCard, 
//   ArrowUpRight, 
//   UserX, 
//   Clock,
//   DollarSign,
//   FileCheck,
//   CalendarDays,
//   AlertCircle,
//   MoreHorizontal,
//   Download,
//   Eye
// } from "lucide-react";
// import { motion } from "framer-motion";
// import { useState, useEffect } from "react";
// import { Appointment } from "@/types/appointment.types";
// import { Payment } from "@/types/payment.types";
// import { ContractResults } from "../contracts/_components/columns";
// import { EmployeeDetailsResponse } from "@/types/employee.types";
// import { InvoicesType } from "../invoices/_components/columns";

// // Animation variants
// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1
//     }
//   }
// };

// const itemVariants = {
//   hidden: { y: 20, opacity: 0 },
//   visible: {
//     y: 0,
//     opacity: 1,
//     transition: {
//       type: "spring",
//       stiffness: 100
//     }
//   }
// };

// // Mock data based on your types
// const mockInvoices: InvoicesType[] = [
//   {
//     id: 1,
//     invoice_number: "INV-2023-001",
//     client_id: 101,
//     client_first_name: "John",
//     client_last_name: "Doe",
//     sender_id: 201,
//     sender_name: "Care Solutions Inc.",
//     sender_kvknumber: "12345678",
//     sender_btwnumber: "NL123456789B01",
//     status: "outstanding",
//     total_amount: 1250.75,
//     issue_date: "2023-10-15",
//     due_date: "2023-11-15",
//     created_at: "2023-10-15T08:30:00Z",
//     updated_at: "2023-10-15T08:30:00Z",
//     warning_count: 0,
//     pdf_attachment_id: "pdf001",
//     extra_content: {},
//     invoice_details: [
//       {
//         contract_id: 301,
//         contract_name: "Home Care Package",
//         pre_vat_total_price: 1033.68,
//         price: 45.5,
//         price_time_unit: "hourly",
//         total_price: 1250.75,
//         vat: 217.07,
//         warnings: [],
//         periods: [
//           {
//             start_date: "2023-10-01",
//             end_date: "2023-10-14",
//             accommodation_time_frame: "",
//             ambulante_total_minutes: 1680
//           }
//         ]
//       }
//     ]
//   },
//   {
//     id: 2,
//     invoice_number: "INV-2023-002",
//     client_id: 102,
//     client_first_name: "Emma",
//     client_last_name: "Wilson",
//     sender_id: 201,
//     sender_name: "Care Solutions Inc.",
//     sender_kvknumber: "12345678",
//     sender_btwnumber: "NL123456789B01",
//     status: "paid",
//     total_amount: 890.50,
//     issue_date: "2023-10-10",
//     due_date: "2023-11-10",
//     created_at: "2023-10-10T09:15:00Z",
//     updated_at: "2023-10-12T14:20:00Z",
//     warning_count: 0,
//     pdf_attachment_id: "pdf002",
//     extra_content: {},
//     invoice_details: [
//       {
//         contract_id: 302,
//         contract_name: "Therapy Sessions",
//         pre_vat_total_price: 736.78,
//         price: 65.5,
//         price_time_unit: "hourly",
//         total_price: 890.50,
//         vat: 153.72,
//         warnings: [],
//         periods: [
//           {
//             start_date: "2023-09-15",
//             end_date: "2023-10-09",
//             accommodation_time_frame: "",
//             ambulante_total_minutes: 810
//           }
//         ]
//       }
//     ]
//   },
//   {
//     id: 3,
//     invoice_number: "INV-2023-003",
//     client_id: 103,
//     client_first_name: "Robert",
//     client_last_name: "Brown",
//     sender_id: 201,
//     sender_name: "Care Solutions Inc.",
//     sender_kvknumber: "12345678",
//     sender_btwnumber: "NL123456789B01",
//     status: "partially_paid",
//     total_amount: 2100.00,
//     issue_date: "2023-10-05",
//     due_date: "2023-11-05",
//     created_at: "2023-10-05T11:30:00Z",
//     updated_at: "2023-10-18T16:45:00Z",
//     warning_count: 1,
//     pdf_attachment_id: "pdf003",
//     extra_content: {},
//     invoice_details: [
//       {
//         contract_id: 303,
//         contract_name: "Residential Care",
//         pre_vat_total_price: 1735.54,
//         price: 2100.00,
//         price_time_unit: "monthly",
//         total_price: 2100.00,
//         vat: 364.46,
//         warnings: ["Payment overdue"],
//         periods: [
//           {
//             start_date: "2023-10-01",
//             end_date: "2023-10-31",
//             accommodation_time_frame: "full_month",
//             ambulante_total_minutes: 0
//           }
//         ]
//       }
//     ]
//   },
// ];

// const mockEmployees: EmployeeDetailsResponse[] = [
//   {
//     id: 1,
//     user_id: 101,
//     first_name: "Sarah",
//     last_name: "Johnson",
//     position: "Senior Caregiver",
//     department: "Home Care",
//     employee_number: "EMP-001",
//     employment_number: "FT-001",
//     private_email_address: "sarah.j@example.com",
//     email: "sarah.j@company.com",
//     authentication_phone_number: "+1234567890",
//     private_phone_number: "+0987654321",
//     work_phone_number: "+1122334455",
//     date_of_birth: "1985-03-15",
//     home_telephone_number: "+1555666777",
//     created_at: "2021-05-10",
//     is_subcontractor: false,
//     gender: "female",
//     location_id: 1,
//     role_id: 2,
//     has_borrowed: false,
//     out_of_service: false,
//     is_archived: false,
//     profile_picture: "/avatars/sarah.jpg"
//   },
//   {
//     id: 2,
//     user_id: 102,
//     first_name: "Michael",
//     last_name: "Chen",
//     position: "Therapist",
//     department: "Rehabilitation",
//     employee_number: "EMP-002",
//     employment_number: "FT-002",
//     private_email_address: "michael.c@example.com",
//     email: "michael.c@company.com",
//     authentication_phone_number: "+1234567891",
//     private_phone_number: "+0987654322",
//     work_phone_number: "+1122334456",
//     date_of_birth: "1988-07-22",
//     home_telephone_number: "+1555666778",
//     created_at: "2022-01-15",
//     is_subcontractor: false,
//     gender: "male",
//     location_id: 1,
//     role_id: 3,
//     has_borrowed: true,
//     out_of_service: false,
//     is_archived: false,
//     profile_picture: "/avatars/michael.jpg"
//   },
//   {
//     id: 3,
//     user_id: 103,
//     first_name: "Lisa",
//     last_name: "Rodriguez",
//     position: "Nurse",
//     department: "Medical Care",
//     employee_number: "EMP-003",
//     employment_number: "FT-003",
//     private_email_address: "lisa.r@example.com",
//     email: "lisa.r@company.com",
//     authentication_phone_number: "+1234567892",
//     private_phone_number: "+0987654323",
//     work_phone_number: "+1122334457",
//     date_of_birth: "1990-11-05",
//     home_telephone_number: "+1555666779",
//     created_at: "2020-08-20",
//     is_subcontractor: false,
//     gender: "female",
//     location_id: 2,
//     role_id: 4,
//     has_borrowed: false,
//     out_of_service: false,
//     is_archived: false,
//     profile_picture: "/avatars/lisa.jpg"
//   },
// ];

// const mockContracts: ContractResults[] = [
//   {
//     id: 1,
//     client_id: 101,
//     status: "terminated",
//     start_date: "2023-01-15",
//     end_date: "2023-10-30",
//     price: 2500,
//     price_time_unit: "monthly",
//     care_name: "Elderly Home Care",
//     care_type: "accommodation",
//     financing_act: "WMO",
//     financing_option: "PGB",
//     created_at: "2023-01-10T00:00:00Z",
//     sender_id: 201,
//     sender_name: "Care Solutions Inc.",
//     client_first_name: "Robert",
//     client_last_name: "Brown"
//   },
//   {
//     id: 2,
//     client_id: 102,
//     status: "approved",
//     start_date: "2023-03-10",
//     end_date: "2023-12-10",
//     price: 1850,
//     price_time_unit: "monthly",
//     care_name: "Therapy Sessions",
//     care_type: "ambulante",
//     financing_act: "ZVW",
//     financing_option: "ZIN",
//     created_at: "2023-03-05T00:00:00Z",
//     sender_id: 201,
//     sender_name: "Care Solutions Inc.",
//     client_first_name: "Emma",
//     client_last_name: "Wilson"
//   },
//   {
//     id: 3,
//     client_id: 103,
//     status: "stoped",
//     start_date: "2022-11-01",
//     end_date: "2023-11-15",
//     price: 3200,
//     price_time_unit: "monthly",
//     care_name: "Residential Care",
//     care_type: "accommodation",
//     financing_act: "WLZ",
//     financing_option: "PGB",
//     created_at: "2022-10-25T00:00:00Z",
//     sender_id: 201,
//     sender_name: "Care Solutions Inc.",
//     client_first_name: "James",
//     client_last_name: "Taylor"
//   },
// ];

// const mockPayments: Payment[] = [
//   {
//     amount: 125075,
//     created_at: "2023-10-16T10:30:00Z",
//     invoice_id: 1,
//     notes: "Payment received via bank transfer",
//     payment_date: "2023-10-16",
//     payment_id: 1001,
//     payment_method: "bank_transfer",
//     payment_reference: "REF-2023-1001",
//     payment_status: "completed",
//     recorded_by: 301,
//     recorded_by_first_name: "Michael",
//     recorded_by_last_name: "Wilson",
//     updated_at: "2023-10-16T10:30:00Z"
//   },
//   {
//     amount: 89050,
//     created_at: "2023-10-12T14:20:00Z",
//     invoice_id: 2,
//     notes: "Payment received via credit card",
//     payment_date: "2023-10-12",
//     payment_id: 1002,
//     payment_method: "credit_card",
//     payment_reference: "REF-2023-1002",
//     payment_status: "completed",
//     recorded_by: 302,
//     recorded_by_first_name: "Sarah",
//     recorded_by_last_name: "Johnson",
//     updated_at: "2023-10-12T14:20:00Z"
//   },
//   {
//     amount: 105000,
//     created_at: "2023-10-18T16:45:00Z",
//     invoice_id: 3,
//     notes: "Partial payment received",
//     payment_date: "2023-10-18",
//     payment_id: 1003,
//     payment_method: "bank_transfer",
//     payment_reference: "REF-2023-1003",
//     payment_status: "completed",
//     recorded_by: 301,
//     recorded_by_first_name: "Michael",
//     recorded_by_last_name: "Wilson",
//     updated_at: "2023-10-18T16:45:00Z"
//   },
// ];

// const mockAppointments: Appointment[] = [
//   {
//     id: 1,
//     client_id: 101,
//     created_at: "2023-10-10T09:00:00Z",
//     general_information: ["Regular checkup", "Medication review"],
//     household_info: ["Lives alone", "Home assistance needed"],
//     important_contacts: ["Daughter: Jane Doe, +123456789"],
//     leave: [],
//     organization_agreements: ["Weekly visit schedule"],
//     school_internship: [],
//     travel: ["Needs transportation to medical appointments"],
//     smoking_rules: ["No smoking in client's home"],
//     treatment_agreements: ["Medication management", "Physical therapy exercises"],
//     updated_at: "2023-10-10T09:00:00Z",
//     work: [],
//     youth_officer_agreements: []
//   },
//   {
//     id: 2,
//     client_id: 102,
//     created_at: "2023-10-15T11:00:00Z",
//     general_information: ["Therapy session", "Progress evaluation"],
//     household_info: ["Lives with spouse", "Stairlift installed"],
//     important_contacts: ["Son: David Wilson, +987654321"],
//     leave: [],
//     organization_agreements: ["Bi-weekly sessions"],
//     school_internship: [],
//     travel: ["Can travel independently"],
//     smoking_rules: ["No restrictions"],
//     treatment_agreements: ["Physical therapy", "Occupational therapy"],
//     updated_at: "2023-10-15T11:00:00Z",
//     work: [],
//     youth_officer_agreements: []
//   },
//   {
//     id: 3,
//     client_id: 103,
//     created_at: "2023-10-20T14:30:00Z",
//     general_information: ["Initial assessment", "Care plan development"],
//     household_info: ["Lives in assisted living facility"],
//     important_contacts: ["Nephew: Mark Taylor, +456123789"],
//     leave: [],
//     organization_agreements: ["Daily care visits"],
//     school_internship: [],
//     travel: ["Transportation provided by facility"],
//     smoking_rules: ["Designated smoking areas only"],
//     treatment_agreements: ["24/7 nursing care", "Specialized diet"],
//     updated_at: "2023-10-20T14:30:00Z",
//     work: [],
//     youth_officer_agreements: []
//   },
// ];

// // Status badge component with animations
// const StatusBadge = ({ status }: { status: string }) => {
//   const statusConfig = {
//     outstanding: { color: "bg-amber-100 text-amber-800", icon: <Clock className="h-3 w-3" /> },
//     paid: { color: "bg-green-100 text-green-800", icon: <FileCheck className="h-3 w-3" /> },
//     partially_paid: { color: "bg-blue-100 text-blue-800", icon: <AlertCircle className="h-3 w-3" /> },
//     draft: { color: "bg-gray-100 text-gray-800", icon: <FileText className="h-3 w-3" /> },
//     approved: { color: "bg-green-100 text-green-800", icon: <FileCheck className="h-3 w-3" /> },
//     terminated: { color: "bg-red-100 text-red-800", icon: <UserX className="h-3 w-3" /> },
//     stoped: { color: "bg-red-100 text-red-800", icon: <UserX className="h-3 w-3" /> },
//     completed: { color: "bg-green-100 text-green-800", icon: <FileCheck className="h-3 w-3" /> },
//     pending: { color: "bg-amber-100 text-amber-800", icon: <Clock className="h-3 w-3" /> },
//   };

//   const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

//   return (
//     <Badge className={`${config.color} gap-1`}>
//       {config.icon}
//       {status}
//     </Badge>
//   );
// };

// // Animated counter component
// const AnimatedCounter = ({ value, duration = 2000 }: { value: number; duration?: number }) => {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     let start = 0;
//     const end = value;
//     const incrementTime = duration / end;
    
//     const timer = setInterval(() => {
//       start += 1;
//       setCount(start);
//       if (start === end) clearInterval(timer);
//     }, incrementTime);

//     return () => clearInterval(timer);
//   }, [value, duration]);

//   return <span>{count}</span>;
// };

// export default function AdminDashboard() {
//   // Filter ending contracts (within next 30 days)
//   const endingContracts = mockContracts.filter(contract => {
//     if (!contract.end_date) return false;
//     const endDate = new Date(contract.end_date);
//     const today = new Date();
//     const thirtyDaysFromNow = new Date();
//     thirtyDaysFromNow.setDate(today.getDate() + 30);
//     return endDate <= thirtyDaysFromNow && endDate >= today;
//   });

//   // Filter employees with ending contracts
//   const employeesEndingContracts = mockEmployees.filter(_employee => {
//     // This would normally check against actual contract data
//     return Math.random() > 0.5; // Mock logic for demonstration
//   });

//   return (
//     <motion.div 
//       className="flex flex-col gap-6 p-6"
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//     >
//       {/* Header with welcome message */}
//       <motion.div variants={itemVariants} className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
//           <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening today.</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button variant="outline" size="sm">
//             <Download className="h-4 w-4 mr-2" />
//             Export Report
//           </Button>
//           <Button size="sm">
//             <Eye className="h-4 w-4 mr-2" />
//             View Analytics
//           </Button>
//         </div>
//       </motion.div>

//       {/* Stats Overview Cards */}
//       <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
//             <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
//               <DollarSign className="h-4 w-4 text-blue-600" />
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">€<AnimatedCounter value={24563} /></div>
//             <p className="text-xs text-muted-foreground">
//               +12% from last month
//             </p>
//           </CardContent>
//         </Card>
        
//         <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
//             <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
//               <Users className="h-4 w-4 text-green-600" />
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold"><AnimatedCounter value={142} /></div>
//             <p className="text-xs text-muted-foreground">
//               +5 from last month
//             </p>
//           </CardContent>
//         </Card>
        
//         <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-sm">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
//             <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
//               <FileText className="h-4 w-4 text-amber-600" />
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold"><AnimatedCounter value={12} /></div>
//             <p className="text-xs text-muted-foreground">
//               €5,432 outstanding
//             </p>
//           </CardContent>
//         </Card>
        
//         <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
//             <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
//               <CalendarDays className="h-4 w-4 text-purple-600" />
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold"><AnimatedCounter value={24} /></div>
//             <p className="text-xs text-muted-foreground">
//               +4 since yesterday
//             </p>
//           </CardContent>
//         </Card>
//       </motion.div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//         {/* Recent Invoices */}
//         <motion.div variants={itemVariants} className="col-span-4">
//           <Card>
//             <CardHeader className="pb-3">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <CardTitle>Recent Invoices</CardTitle>
//                   <CardDescription>You have 12 unpaid invoices totaling €5,432.</CardDescription>
//                 </div>
//                 <Button variant="ghost" size="sm">
//                   <MoreHorizontal className="h-4 w-4" />
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent className="p-0">
//               <div className="space-y-4 p-4">
//                 {mockInvoices.map((invoice) => (
//                   <motion.div 
//                     key={invoice.id} 
//                     className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
//                     whileHover={{ scale: 1.01 }}
//                     transition={{ type: "spring", stiffness: 300 }}
//                   >
//                     <div className="flex items-center gap-4">
//                       <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
//                         <FileText className="h-5 w-5 text-blue-600" />
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium leading-none">
//                           {invoice.client_first_name} {invoice.client_last_name}
//                         </p>
//                         <p className="text-sm text-muted-foreground mt-1">
//                           {invoice.invoice_number} • Due {new Date(invoice.due_date).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex flex-col items-end gap-2">
//                       <div className="text-sm font-medium">€{invoice.total_amount.toFixed(2)}</div>
//                       <StatusBadge status={invoice.status} />
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//               <div className="border-t p-4">
//                 <Button variant="outline" className="w-full">
//                   View All Invoices
//                   <ArrowUpRight className="ml-2 h-4 w-4" />
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Ending Contracts */}
//         <motion.div variants={itemVariants} className="col-span-3">
//           <Card className="border-rose-100">
//             <CardHeader className="pb-3">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <CardTitle>Ending Contracts</CardTitle>
//                   <CardDescription>{endingContracts.length} contracts ending soon.</CardDescription>
//                 </div>
//                 <AlertCircle className="h-5 w-5 text-rose-500" />
//               </div>
//             </CardHeader>
//             <CardContent className="p-0">
//               <div className="space-y-4 p-4">
//                 {endingContracts.map((contract) => (
//                   <motion.div 
//                     key={contract.id} 
//                     className="flex items-center justify-between p-3 rounded-lg hover:bg-rose-50/50 transition-colors"
//                     whileHover={{ scale: 1.01 }}
//                     transition={{ type: "spring", stiffness: 300 }}
//                   >
//                     <div className="flex items-center gap-4">
//                       <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
//                         <UserX className="h-5 w-5 text-rose-600" />
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium leading-none">
//                           {contract.client_first_name} {contract.client_last_name}
//                         </p>
//                         <p className="text-sm text-muted-foreground mt-1">
//                           Ends on {new Date(contract.end_date!).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>
//                     <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
//                       <UserX className="mr-1 h-3 w-3" />
//                       Ending
//                     </Badge>
//                   </motion.div>
//                 ))}
//               </div>
//               <div className="border-t p-4">
//                 <Button variant="outline" className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700">
//                   Review All Contracts
//                   <ArrowUpRight className="ml-2 h-4 w-4" />
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//         {/* Latest Payments */}
//         <motion.div variants={itemVariants} className="col-span-3">
//           <Card>
//             <CardHeader className="pb-3">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <CardTitle>Latest Payments</CardTitle>
//                   <CardDescription>Recent payments received.</CardDescription>
//                 </div>
//                 <CreditCard className="h-5 w-5 text-muted-foreground" />
//               </div>
//             </CardHeader>
//             <CardContent className="p-0">
//               <div className="space-y-4 p-4">
//                 {mockPayments.map((payment) => (
//                   <motion.div 
//                     key={payment.payment_id} 
//                     className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
//                     whileHover={{ scale: 1.01 }}
//                     transition={{ type: "spring", stiffness: 300 }}
//                   >
//                     <div className="flex items-center gap-4">
//                       <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
//                         <CreditCard className="h-5 w-5 text-green-600" />
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium leading-none">
//                           {payment.payment_reference}
//                         </p>
//                         <p className="text-sm text-muted-foreground mt-1">
//                           {(payment.amount / 100).toFixed(2)} • {payment.payment_method.replace('_', ' ')}
//                         </p>
//                       </div>
//                     </div>
//                     <StatusBadge status={payment.payment_status} />
//                   </motion.div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Upcoming Appointments */}
//         <motion.div variants={itemVariants} className="col-span-4">
//           <Card>
//             <CardHeader className="pb-3">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <CardTitle>Upcoming Appointments</CardTitle>
//                   <CardDescription>Next appointments scheduled.</CardDescription>
//                 </div>
//                 <Calendar className="h-5 w-5 text-muted-foreground" />
//               </div>
//             </CardHeader>
//             <CardContent className="p-0">
//               <div className="space-y-4 p-4">
//                 {mockAppointments.map((appointment) => (
//                   <motion.div 
//                     key={appointment.id} 
//                     className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
//                     whileHover={{ scale: 1.01 }}
//                     transition={{ type: "spring", stiffness: 300 }}
//                   >
//                     <div className="flex items-center gap-4">
//                       <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
//                         <Calendar className="h-5 w-5 text-purple-600" />
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-sm font-medium leading-none">
//                           Client #{appointment.client_id}
//                         </p>
//                         <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
//                           {appointment.general_information.slice(0, 2).join(', ')}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Clock className="h-4 w-4 text-muted-foreground" />
//                       <span className="text-sm text-muted-foreground">
//                         {appointment.id === 1 ? 'Tomorrow' : 
//                          appointment.id === 2 ? 'In 3 days' : 'Next week'}
//                       </span>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* Employees with Ending Contracts */}
//       <motion.div variants={itemVariants}>
//         <Card>
//           <CardHeader>
//             <div className="flex justify-between items-center">
//               <div>
//                 <CardTitle>Employees with Ending Contracts</CardTitle>
//                 <CardDescription>{employeesEndingContracts.length} employees have contracts ending soon.</CardDescription>
//               </div>
//               <Users className="h-5 w-5 text-muted-foreground" />
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//               {employeesEndingContracts.map((employee) => (
//                 <motion.div 
//                   key={employee.id}
//                   className="flex flex-col items-center justify-center p-4 border rounded-lg hover:shadow-md transition-shadow"
//                   whileHover={{ y: -5 }}
//                   transition={{ type: "spring", stiffness: 300 }}
//                 >
//                   <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-4">
//                     <span className="text-blue-800 font-bold text-lg">
//                       {employee.first_name[0]}{employee.last_name[0]}
//                     </span>
//                   </div>
//                   <h3 className="font-semibold text-center">
//                     {employee.first_name} {employee.last_name}
//                   </h3>
//                   <p className="text-sm text-muted-foreground text-center">
//                     {employee.position}
//                   </p>
//                   <p className="text-xs text-muted-foreground text-center mt-1">
//                     {employee.department}
//                   </p>
//                   <Button variant="outline" size="sm" className="mt-4">
//                     <ArrowUpRight className="mr-1 h-3 w-3" />
//                     Review Contract
//                   </Button>
//                 </motion.div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </motion.div>
//   );
// }