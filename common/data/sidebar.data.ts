import {  BellRing, BookMarked, BriefcaseBusiness, FileBadge,  FileText, GraduationCap, Handshake, HeartPulse, Home, Map,  UserCircle, UsersRound, CalendarClock, Users2, Calendar, ClockArrowUp, Hourglass,  FileArchive, BrainCircuit, Settings, Building2 } from "lucide-react";

export const sidebarLinks = [
    {
        title: "Dashboard", // "Dashboard" (commonly used in Dutch)
        url: "/dashboard",
        icon: Home,
        isActive: true,
    },
    {
        title: "Klanten", // "Clients"
        url: "/clients",
        icon: Handshake,
    },
    {
        title: "Medewerkers", // "Employees"
        url: "/employees",
        icon: Users2,
    },
    {
        title: "Zorgcoördinatoren", // "Carecordinators" (context-specific)
        url: "/contacts",
        icon: HeartPulse,
        items: [
            {
                title: "Opdrachtgevers", // "Contacts"
                url: "/contacts",
            },
            {
                title: "Contracten", // "Contractors" (or "Zzp'ers" for freelancers)
                url: "/contracts",
            },
            {
                title: "Registratie is Aanmeldingen", // "Registrations"
                url: "/registrations",
            },
            {
                title: "Facturen", // "Registrations"
                url: "/invoices",
            }
        ],
    },
    {
        title: "Locaties", // "Locations"
        url: "/locations",
        icon: Map,
    },
    {
        title: "Organisations", // "Locations"
        url: "/organisations",
        icon: Building2,
    },
    {
        title: "Agenda", // "Calendar" (time-based)
        url: "/calendar",
        icon: CalendarClock,
    },
    {
        title: "Roosters", // "Schedules" (work shifts)
        url: "/schedules",
        icon: Calendar,
    },
    {
        title: "Instellingen", // "Settings"
        url: "/rbac",
        icon: Settings,
    },
];
export const sidebarEmployeeLinks = (employee:{first_name:string,last_name:string,id:number})=> [
    {
        title: "Overzicht ("+employee?.first_name + " " + employee?.last_name + ")", // "Overview"
        url: "/employees/" + employee?.id,
        icon: Users2,
        isActive: true,
    },
    {
        title: "Certificaten", // "Certifications"
        url: "/employees/" + employee?.id+"/certification",
        icon: BookMarked,
    },
    {
        title: "Opleidingen", // "Education"
        url: "/employees/" + employee?.id+"/education",
        icon: GraduationCap,
    },
    {
        title: "Werkervaring", // "Experience" (work context)
        url: "/employees/" + employee?.id+"/experience",
        icon: BriefcaseBusiness,
    },
    {
        title: "Agenda", // "Calendar"
        url: "/employees/" + employee?.id+"/calendar",
        icon: CalendarClock,
    },
    {
        title: "Werkuren", // "Working Hours"
        url: "/employees/" + employee?.id+"/working-hours",
        icon: Hourglass,
    },
    {
        title: "Contracten", // "Contracts"
        url: "/employees/" + employee?.id+"/contracts",
        icon: Handshake,
    }
];
export const sidebarLocationLinks = (location:{first_name:string,last_name:string,id:number})=> [
    {
        title: "Overzicht ("+location?.first_name + " " + location?.last_name + ")", // "Overview"
        url: "/locations/" + location?.id+"/overview",
        icon: Users2,
        isActive: true,
    },
    {
        title: "Diensten", // "Shifts" (work shifts)
        url: "/locations/" + location?.id+"/shifts",
        icon: ClockArrowUp,
    },
    {
        title: "Roosters", // "Schedules"
        url: "/locations/" + location?.id+"/schedules",
        icon: Calendar,
    }
];
export const sidebarClientLinks = (client:{first_name:string,last_name:string,id:number})=> [
    {
        title: "Overzicht ("+client?.first_name + " " + client?.last_name + ")", // "Overview"
        url: "/clients/" + client?.id + "/overview",
        icon: UserCircle,
        isActive: true,
    },
    {
        title: "Medisch Dossier", // "Medical Record"
        url: "/clients/" + client?.id+"/medical-record",
        icon: HeartPulse,
    },
    {
        title: "Afsprakenkaart", // "Appointment Card"
        url: "/clients/" + client?.id+"/appointment-card",
        icon: CalendarClock,
    },
    // {
    //     title: "Doelen", // "Goals"
    //     url: "/clients/" + client?.id+"/goals",
    //     icon: Goal,
    // },
    {
        title: "Zorgplan", // "care-plan"
        url: "/clients/" + client?.id+"/care-plan",
        icon: BrainCircuit,
    },
    {
        title: "Incidenten", // "Incidents"
        url: "/clients/" + client?.id+"/incidents",
        icon: BellRing,
    },
    {
        title: "Contracten", // "Incidents"
        url: "/clients/" + client?.id+"/contract",
        icon: FileArchive,
    },
    {
        title: "Cliëntennetwerk", // "Client Network"
        url: "/clients/" + client?.id+"/client-network",
        icon: UsersRound,
        items: [
            {
                title: "Noodcontacten", // "Emergency Contacts"
                url: "/clients/" + client?.id+"/client-network/emergency",
            },
            {
                title: "Betrokken medewerkers", // "Involved Employees"
                url: "/clients/" + client?.id+"/client-network/involved-employees",
            }
        ],
    },
    {
        title: "Rapporten", // "Reports"
        url: "/clients/" + client?.id+"/reports",
        icon: FileBadge,
        items: [
            {
                title: "Gebruikersrapporten", // "User Reports"
                url: "/clients/" + client?.id+"/reports/user-reports",
            },
            {
                title: "Automatische rapporten", // "Automatic Reports"
                url: "/clients/" + client?.id+"/reports/automatic-reports",
            }
        ],
    },
    {
        title: "Documenten", // "Documents"
        url: "/clients/" + client?.id+"/documents",
        icon: FileText,
    },
    // {
    //     title: "Vragenlijsten", // "Questionnaires"
    //     url: "/clients/" + client?.id+"/questionnaires",
    //     icon: FilesIcon,
    // },
    {
        title: "Agenda", // "Calendar"
        url: "/clients/" + client?.id+"/calendar",
        icon: CalendarClock,
    }
];