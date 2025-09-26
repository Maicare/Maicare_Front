export default {
  dashboard: {
    adminDashboard: "Admin Dashboard",
    welcomeBack: "Welcome back! Here's what's happening today.",
    
    metrics: {
      totalRevenue: "Total Revenue",
      fromPayments: "From {count} payments",
      activeClients: "Active Clients",
      urgentCases: "{count} urgent cases",
      pendingInvoices: "Pending Invoices",
      outstanding: "{amount} outstanding",
      upcomingAppointments: "Upcoming Appointments",
      today: "{count} today",
    },
    
    discharge: {
      overview: "Discharge Overview",
      clientsEndingContracts: "{count} clients ending contracts soon.",
      employeeEndingContracts: "Employee Ending Contracts",
      employeeContractsEnding: "{count} employee contracts ending soon.",
      endsOn: "Ends on {duration}",
      noData: "No discharge data available",
      viewAll: "View All Discharges",
      statistics: "Discharge Statistics",
      description: "Overview of client discharges and status changes.",
      totalDischarges: "Total Discharges",
      urgentCases: "Urgent Cases",
      contractEnds: "Contract Ends",
      statusChanges: "Status Changes",
    },
    
    payments: {
      latest: "Latest Payments",
      recent: "Recent payments received.",
    },
    
    appointments: {
      next: "Next appointments scheduled.",
    }
  }
} as const;