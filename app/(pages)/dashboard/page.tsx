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
  Loader2
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { Any, Id } from "@/common/types/types";
import { useECR } from "@/hooks/ecr/use-ecr";
import { getTimeLeft } from "@/utils/get-time-left";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";

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

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200, // Hoge stijfheid
      damping: 3,     // Lage demping
      mass: 0.3,     // Lage massa
    }
  }
};

// Status badge component met animaties
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

// Geanimeerde teller component
const AnimatedCounter = ({ value, duration = 2000 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const step = value%10 *10;
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
      start += step;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration,step]);

  return <span>{count}</span>;
};


function AdminDashboard() {
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
          readLatestPayments(), // Je moet het echte organisatie ID doorgeven
          readTotalDischargeCount(),
          readUpcomingAppointments()
        ]);

        setDischargeOverview(dischargeData.results as Any);
        setEmployeeEndingContracts(employeeData as Any);
        setLatestPayments(paymentsData as Any);
        setTotalDischargeCount(dischargeCountData as Any);
        setUpcomingAppointments(appointmentsData as Any);
      } catch (error) {
        console.error("Kon dashboard data niet ophalen:", error);
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
          <p className="text-muted-foreground">Dashboard data laden...</p>
        </div>
      </div>
    );
  }

  // Bereken statistieken voor de overzichtskaarten
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
      {/* Header met welkomstbericht */}
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Beheerdersdashboard</h1>
          <p className="text-muted-foreground">Welkom terug</p>
        </div>
        <div className="flex items-center gap-2">
          {/* <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Rapport Exporteren
          </Button>
          <Button size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Analytics Bekijken
          </Button> */}
        </div>
      </motion.div>

      {/* Statistieken Overzichtskaarten */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totale Omzet</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€<AnimatedCounter value={totalRevenue} duration={1} /></div>
            <p className="text-xs text-muted-foreground">
              Van {latestPayments?.length || 0} betalingen
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actieve Cliënten</CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"><AnimatedCounter value={activeClients} /></div>
            <p className="text-xs text-muted-foreground">
              {totalDischargeCount?.urgent_cases_count || 0} urgente gevallen
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Openstaande Facturen</CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
              <FileText className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"><AnimatedCounter value={pendingInvoices} /></div>
            <p className="text-xs text-muted-foreground">
              €{(outstandingAmount).toFixed(2)} openstaand
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aankomende Afspraken</CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <CalendarDays className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"><AnimatedCounter value={upcomingAppointments?.length || 0} /></div>
            <p className="text-xs text-muted-foreground">
              {upcomingAppointments?.filter(a => new Date(a.start_time) < new Date(Date.now() + 86400000)).length || 0} vandaag
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Ontslag Overzicht */}
        <motion.div variants={itemVariants} className="col-span-4 h-full">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Ontslag Overzicht</CardTitle>
                  <CardDescription>
                    {dischargeOverview?.filter(d => d.contract_status === "terminated" || d.contract_status === "stoped").length || 0}
                    cliënten met eindigende contracten.
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
                          Eindigt op {new Date(discharge.contract_end_date).toLocaleDateString("nl-NL")}
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
                    Geen ontslaggegevens beschikbaar
                  </div>
                )}
              </div>
              <div className="border-t p-4">
                <Button variant="outline" className="w-full">
                  Alles Bekijken
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Werknemer Eindigende Contracten */}
        <motion.div variants={itemVariants} className="col-span-3 h-full">
          <Card className="border-rose-100 h-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Werknemer Eindigende Contracten</CardTitle>
                  <CardDescription>
                    {employeeEndingContracts?.length || 0} werknemer contracten eindigen binnenkort
                  </CardDescription>
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
                           {getTimeLeft(new Date(employee.contract_end_date).toLocaleDateString())}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
                      <UserX className="mr-1 h-3 w-3" />
                      Eindigt
                    </Badge>
                  </motion.div>
                ))}
                {(!employeeEndingContracts || employeeEndingContracts.length === 0) && (
                  <div className="text-center py-6 text-muted-foreground">
                    Geen werknemer contracten eindigen binnenkort
                  </div>
                )}
              </div>
              <div className="border-t p-4">
                <Button variant="outline" className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700">
                  Alle Beoordelen
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Laatste Betalingen */}
        <motion.div variants={itemVariants} className="col-span-3 h-full">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Laatste Betalingen</CardTitle>
                  <CardDescription>Recente betalingsactiviteit</CardDescription>
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
                          €{(payment.amount).toFixed(2)} • {new Date(payment.payment_date).toLocaleDateString("nl-NL")}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={payment.payment_method} />
                  </motion.div>
                ))}
                {(!latestPayments || latestPayments.length === 0) && (
                  <div className="text-center py-6 text-muted-foreground">
                    Geen betalingsgegevens beschikbaar
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Aankomende Afspraken */}
        <motion.div variants={itemVariants} className="col-span-4 h-full">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Aankomende Afspraken</CardTitle>
                  <CardDescription>Volgende geplande afspraken</CardDescription>
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
                        {new Date(appointment.start_time).toLocaleTimeString("nl-NL", { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
                {(!upcomingAppointments || upcomingAppointments.length === 0) && (
                  <div className="text-center py-6 text-muted-foreground">
                    Geen aankomende afspraken
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Totaal Ontslag Telling */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Ontslag Statistieken</CardTitle>
                <CardDescription>Overzicht van ontslaggegevens</CardDescription>
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
                <p className="text-sm text-muted-foreground text-center">Totaal Ontslagen</p>
              </div>

              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-lg"><AnimatedCounter value={totalDischargeCount?.urgent_cases_count || 0} /></h3>
                <p className="text-sm text-muted-foreground text-center">Urgente Gevallen</p>
              </div>

              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <FileCheck className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg"><AnimatedCounter value={totalDischargeCount?.contract_end_count || 0} /></h3>
                <p className="text-sm text-muted-foreground text-center">Contract Einden</p>
              </div>

              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg"><AnimatedCounter value={totalDischargeCount?.status_change_count || 0} /></h3>
                <p className="text-sm text-muted-foreground text-center">Status Wijzigingen</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default withAuth(
  withPermissions(AdminDashboard, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewDashboard, // TODO: Voeg correcte permissie toe
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);