export default {
  dashboard: {
    adminDashboard: "Beheerdersdashboard",
    welcomeBack: "Welkom terug! Dit is wat er vandaag gebeurt.",
    
    metrics: {
      totalRevenue: "Totale Inkomsten",
      fromPayments: "Van {count} betalingen",
      activeClients: "Actieve Cliënten",
      urgentCases: "{count} urgente zaken",
      pendingInvoices: "Openstaande Facturen",
      outstanding: "{amount} openstaand",
      upcomingAppointments: "Aankomende Afspraken",
      today: "{count} vandaag",
    },
    
    discharge: {
      overview: "Overzicht Uitstroom",
      clientsEndingContracts: "{count} cliënten met binnenkort aflopende contracten.",
      employeeEndingContracts: "Aflopende Contracten Medewerkers",
      employeeContractsEnding: "{count} medewerkerscontracten lopen binnenkort af.",
      endsOn: "Eindigt over {duration}",
      noData: "Geen uitstroomgegevens beschikbaar",
      viewAll: "Bekijk Alle Uitstromen",
      statistics: "Uitstroomstatistieken",
      description: "Overzicht van cliëntuitstroom en statuswijzigingen.",
      totalDischarges: "Totaal Aantal Uitstromen",
      urgentCases: "Urgente Zaken",
      contractEnds: "Contracteinde",
      statusChanges: "Statuswijzigingen",
    },
    
    payments: {
      latest: "Laatste Betalingen",
      recent: "Recent ontvangen betalingen.",
    },
    
    appointments: {
      next: "Volgende afspraken ingepland.",
    }
  }
} as const;