export default {
  dashboard: {
    adminDashboard: "Tableau de bord administrateur",
    welcomeBack: "Bon retour ! Voici ce qui se passe aujourd'hui.",
    
    metrics: {
      totalRevenue: "Revenu total",
      fromPayments: "De {count} paiements",
      activeClients: "Clients actifs",
      urgentCases: "{count} cas urgents",
      pendingInvoices: "Factures en attente",
      outstanding: "{amount} en souffrance",
      upcomingAppointments: "Rendez-vous à venir",
      today: "{count} aujourd'hui",
    },
    
    discharge: {
      overview: "Aperçu des sorties",
      clientsEndingContracts: "{count} clients avec des contrats se terminant bientôt.",
      employeeEndingContracts: "Contrats de employés se terminant",
      employeeContractsEnding: "{count} contrats de employés se terminant bientôt.",
      endsOn: "Se termine dans {duration}",
      noData: "Aucune donnée de sortie disponible",
      viewAll: "Voir toutes les sorties",
      statistics: "Statistiques des sorties",
      description: "Aperçu des sorties de clients et des changements de statut.",
      totalDischarges: "Total des sorties",
      urgentCases: "Cas urgents",
      contractEnds: "Fin de contrat",
      statusChanges: "Changements de statut",
    },
    
    payments: {
      latest: "Derniers paiements",
      recent: "Paiements reçus récemment.",
    },
    
    appointments: {
      next: "Prochains rendez-vous programmés.",
    }
  }
} as const;