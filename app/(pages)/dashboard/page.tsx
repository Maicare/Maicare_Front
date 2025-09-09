// components/admin-dashboard.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Users,
  Calendar,
  CreditCard,
  ArrowUpRight,
  UserX,
  Clock,
  TrendingUp,
  DollarSign,
  FileCheck,
  CalendarDays,
  AlertCircle,
  MoreHorizontal,
  Download,
  Eye,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Any, Id } from "@/common/types/types";
import { useECR } from "@/hooks/ecr/use-ecr";
import { getTimeLeft } from "@/utils/get-time-left";

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

// Status badge component with animations
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    outstanding: { color: "bg-amber-100 text-amber-800", icon: <Clock className="h-3 w-3" /> },
    paid: { color: "bg-green-100 text-green-800", icon: <FileCheck className="h-3 w-3" /> },
    partially_paid: { color: "bg-blue-100 text-blue-800", icon: <AlertCircle className="h-3 w-3" /> },
    draft: { color: "bg-gray-100 text-gray-800", icon: <FileText className="h-3 w-3" /> },
    approved: { color: "bg-green-100 text-green-800", icon: <FileCheck className="h-3 w-3" /> },
    terminated: { color: "bg-red-100 text-red-800", icon: <UserX className="h-3 w-3" /> },
    stoped: { color: "bg-red-100 text-red-800", icon: <UserX className="h-3 w-3" /> },
    completed: { color: "bg-green-100 text-green-800", icon: <FileCheck className="h-3 w-3" /> },
    pending: { color: "bg-amber-100 text-amber-800", icon: <Clock className="h-3 w-3" /> },
    bank_transfer: { color: "bg-blue-100 text-blue-800", icon: <CreditCard className="h-3 w-3" /> },
    credit_card: { color: "bg-purple-100 text-purple-800", icon: <CreditCard className="h-3 w-3" /> },
    check: { color: "bg-amber-100 text-amber-800", icon: <FileText className="h-3 w-3" /> },
    cash: { color: "bg-green-100 text-green-800", icon: <DollarSign className="h-3 w-3" /> },
    other: { color: "bg-gray-100 text-gray-800", icon: <CreditCard className="h-3 w-3" /> },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

  return (
    <Badge className={`${config.color} gap-1`}>
      {config.icon}
      {status.replace('_', ' ')}
    </Badge>
  );
};

// Animated counter component
const AnimatedCounter = ({ value, duration = 2000 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const incrementTime = duration / end;

    const timer = setInterval(() => {
      if (end === 0) {
        setCount(0);
        clearInterval(timer);
        return;
      }
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
};


export default function AdminDashboard() {
  const {
    readDischargeOverview,
    readEmployeeEndingContracts,
    readLatestPayments,
    readTotalDischargeCount,
    readUpcomingAppointments
  } = useECR();

  const [dischargeOverview, setDischargeOverview] = useState<{
    contract_end_date: string,
    contract_status: string,
    current_status: string,
    departure_reason: string,
    discharge_type: string,
    first_name: string,
    follow_up_plan: string,
    id: Id,
    last_name: string,
    scheduled_status: string,
    status_change_date: string,
    status_change_reason: string
  }[] | null>(null);

  const [employeeEndingContracts, setEmployeeEndingContracts] = useState<{
    contract_end_date: string,
    contract_start_date: string,
    contract_type: string,
    department: string,
    email: string,
    employee_number: string,
    employment_number: string,
    first_name: string,
    id: Id,
    last_name: string,
    position: string
  }[] | null>(null);

  const [latestPayments, setLatestPayments] = useState<{
    amount: number,
    invoice_id: Id,
    invoice_number: string,
    payment_date: string,
    payment_method: string,
    payment_status: string,
    updated_at: string
  }[] | null>(null);

  const [totalDischargeCount, setTotalDischargeCount] = useState<{
    contract_end_count: number,
    status_change_count: number,
    total_discharge_count: number,
    urgent_cases_count: number
  } | null>(null);

  const [upcomingAppointments, setUpcomingAppointments] = useState<{
    description: string,
    end_time: string,
    id: string,
    location: string,
    start_time: string
  }[] | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          dischargeData,
          employeeData,
          paymentsData,
          dischargeCountData,
          appointmentsData
        ] = await Promise.all([
          readDischargeOverview(),
          readEmployeeEndingContracts(),
          readLatestPayments(), // You'll need to pass the actual organization ID
          readTotalDischargeCount(),
          readUpcomingAppointments()
        ]);

        setDischargeOverview(dischargeData.results as Any);
        setEmployeeEndingContracts(employeeData as Any);
        setLatestPayments(paymentsData as Any);
        setTotalDischargeCount(dischargeCountData as Any);
        setUpcomingAppointments(appointmentsData as Any);
        console.log({
          dischargeData,
          employeeData,
          paymentsData,
          dischargeCountData,
          appointmentsData
        })
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Calculate stats for the overview cards
  const totalRevenue = latestPayments?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
  const activeClients = dischargeOverview?.filter(item =>
    item.current_status !== "discharged" && item.current_status !== "terminated"
  ).length || 0;
  const pendingInvoices = latestPayments?.filter(payment =>
    payment.payment_status === "pending" || payment.payment_status === "partially_paid"
  ).length || 0;
  const outstandingAmount = latestPayments
    ?.filter(payment => payment.payment_status === "pending" || payment.payment_status === "partially_paid")
    .reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

  return (
    <motion.div
      className="flex flex-col gap-6 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header with welcome message */}
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
        </div>
      </motion.div>

      {/* Stats Overview Cards */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€<AnimatedCounter value={totalRevenue / 100} /></div>
            <p className="text-xs text-muted-foreground">
              From {latestPayments?.length || 0} payments
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"><AnimatedCounter value={activeClients} /></div>
            <p className="text-xs text-muted-foreground">
              {totalDischargeCount?.urgent_cases_count || 0} urgent cases
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
              <FileText className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"><AnimatedCounter value={pendingInvoices} /></div>
            <p className="text-xs text-muted-foreground">
              €{(outstandingAmount / 100).toFixed(2)} outstanding
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <CalendarDays className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"><AnimatedCounter value={upcomingAppointments?.length || 0} /></div>
            <p className="text-xs text-muted-foreground">
              {upcomingAppointments?.filter(a => new Date(a.start_time) < new Date(Date.now() + 86400000)).length || 0} today
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Discharge Overview */}
        <motion.div variants={itemVariants} className="col-span-4 h-full">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Discharge Overview</CardTitle>
                  <CardDescription>
                    {dischargeOverview?.filter(d => d.contract_status === "terminated" || d.contract_status === "stoped").length || 0}
                    clients ending contracts soon.
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4 p-4">
                {dischargeOverview?.slice(0, 5).map((discharge) => (
                  <motion.div
                    key={discharge.id * 3 + new Date(discharge.contract_end_date).getTime().toString()}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {discharge.first_name} {discharge.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Contract ends on {new Date(discharge.contract_end_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-sm font-medium">{discharge.discharge_type}</div>
                      <StatusBadge status={discharge.contract_status} />
                    </div>
                  </motion.div>
                ))}
                {(!dischargeOverview || dischargeOverview.length === 0) && (
                  <div className="text-center py-6 text-muted-foreground">
                    No discharge data available
                  </div>
                )}
              </div>
              <div className="border-t p-4">
                <Button variant="outline" className="w-full">
                  View All Discharges
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Employee Ending Contracts */}
        <motion.div variants={itemVariants} className="col-span-3 h-full">
          <Card className="border-rose-100 h-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Employee Ending Contracts</CardTitle>
                  <CardDescription>{employeeEndingContracts?.length || 0} employee contracts ending soon.</CardDescription>
                </div>
                <AlertCircle className="h-5 w-5 text-rose-500" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4 p-4">
                {employeeEndingContracts?.slice(0, 3).map((employee) => (
                  <motion.div
                    key={employee.id * 2 + new Date(employee.contract_end_date).getTime().toString()}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-rose-50/50 transition-colors"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                        <UserX className="h-5 w-5 text-rose-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {employee.first_name} {employee.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Ends on {getTimeLeft(new Date(employee.contract_end_date).toLocaleDateString())}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
                      <UserX className="mr-1 h-3 w-3" />
                      Ending
                    </Badge>
                  </motion.div>
                ))}
                {(!employeeEndingContracts || employeeEndingContracts.length === 0) && (
                  <div className="text-center py-6 text-muted-foreground">
                    No employee contracts ending soon
                  </div>
                )}
              </div>
              <div className="border-t p-4">
                <Button variant="outline" className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700">
                  Review All Contracts
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Latest Payments */}
        <motion.div variants={itemVariants} className="col-span-3 h-full">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Latest Payments</CardTitle>
                  <CardDescription>Recent payments received.</CardDescription>
                </div>
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4 p-4">
                {latestPayments?.slice(0, 4).map((payment) => (
                  <motion.div
                    key={payment.invoice_id * Math.random() + new Date(payment.payment_date).getTime()}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {payment.invoice_number}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          €{(payment.amount).toFixed(2)} • {new Date(payment.payment_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={payment.payment_method} />
                  </motion.div>
                ))}
                {(!latestPayments || latestPayments.length === 0) && (
                  <div className="text-center py-6 text-muted-foreground">
                    No payment data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div variants={itemVariants} className="col-span-4 h-full">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>Next appointments scheduled.</CardDescription>
                </div>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4 p-4">
                {upcomingAppointments?.slice(0, 3).map((appointment) => (
                  <motion.div
                    key={appointment.id + new Date(appointment.start_time).getTime().toString()}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-none">
                          {appointment.description}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {appointment.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(appointment.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
                {(!upcomingAppointments || upcomingAppointments.length === 0) && (
                  <div className="text-center py-6 text-muted-foreground">
                    No upcoming appointments
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Total Discharge Count */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Discharge Statistics</CardTitle>
                <CardDescription>Overview of client discharges and status changes.</CardDescription>
              </div>
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <UserX className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg"><AnimatedCounter value={totalDischargeCount?.total_discharge_count || 0} /></h3>
                <p className="text-sm text-muted-foreground text-center">Total Discharges</p>
              </div>

              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-lg"><AnimatedCounter value={totalDischargeCount?.urgent_cases_count || 0} /></h3>
                <p className="text-sm text-muted-foreground text-center">Urgent Cases</p>
              </div>

              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <FileCheck className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg"><AnimatedCounter value={totalDischargeCount?.contract_end_count || 0} /></h3>
                <p className="text-sm text-muted-foreground text-center">Contract Ends</p>
              </div>

              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg"><AnimatedCounter value={totalDischargeCount?.status_change_count || 0} /></h3>
                <p className="text-sm text-muted-foreground text-center">Status Changes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}