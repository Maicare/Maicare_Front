import {  BellRing, BookMarked, BriefcaseBusiness, FileBadge, FilesIcon, FileText, Goal, GraduationCap, Handshake, HeartPulse, Home, Map,  UserCircle, UsersRound, CalendarClock, Users2, Calendar, ClockArrowUp } from "lucide-react";

export const sidebarLinks = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
        isActive: true,
    },
    {
        title: "Clients",
        url: "/clients",
        icon: Handshake,
    },
    {
        title: "Employees",
        url: "/employees",
        icon: Users2,
    },
    {
        title: "Carecordinators",
        url: "/contacts",
        icon: HeartPulse ,
        items: [
            {
                title: "Contacts",
                url: "/contacts",
            },
            {
                title: "Contractors",
                url: "/contracts",
            }
        ],
    },
    {
        title: "Locations",
        url: "/locations",
        icon: Map,
    },
    {
        title: "Calendar",
        url: "/calendar",
        icon: CalendarClock,
    },
    {
        title: "Schedules",
        url: "/schedules",
        icon: Calendar,
    },
];
export const sidebarEmployeeLinks = (employee:{first_name:string,last_name:string,id:number})=> [
    {
        title: "Overzicht ("+employee?.first_name + " " + employee?.last_name + ")",
        url: "/employees/" + employee?.id ,
        icon: Users2,
        isActive: true,
    },
    {
        title: "Certificaten",
        url: "/employees/" + employee?.id+"/certification",
        icon: BookMarked,
    },
    {
        title: "Opleidingen",
        url: "/employees/" + employee?.id+"/education",
        icon: GraduationCap,
    },
    {
        title: "Ervaringen",
        url: "/employees/" + employee?.id+"/experience",
        icon: BriefcaseBusiness ,
    },
    {
        title: "CalendarClock",
        url: "/employees/" + employee?.id+"/calendar",
        icon: CalendarClock ,
    }
];
export const sidebarLocationLinks = (location:{first_name:string,last_name:string,id:number})=> [
    {
        title: "Overzicht ("+location?.first_name + " " + location?.last_name + ")",
        url: "/locations/" + location?.id+"/overview" ,
        icon: Users2,
        isActive: true,
    },
    {
        title: "Shifts",
        url: "/locations/" + location?.id+"/shifts",
        icon: ClockArrowUp,
    },
    {
        title: "Schedules",
        url: "/locations/" + location?.id+"/schedules",
        icon: Calendar,
    }
];
export const sidebarClientLinks = (client:{first_name:string,last_name:string,id:number})=> [
    {
        title: "Overzicht ("+client?.first_name + " " + client?.last_name + ")",
        url: "/clients/" + client?.id + "/overview",
        icon: UserCircle,
        isActive: true,
    },
    {
        title: "Medisch Dossier",
        url: "/clients/" + client?.id+"/medical-record",
        icon: HeartPulse,
    },
    {
        title: "Afsprakenkaart",
        url: "/clients/" + client?.id+"/appointment-card",
        icon: CalendarClock,
    },
    {
        title: "Doelen",
        url: "/clients/" + client?.id+"/goals",
        icon: Goal ,
    },
    {
        title: "Incidenten",
        url: "/clients/" + client?.id+"/incidents",
        icon: BellRing ,
    },
    {
        title: "Cliëntennetwerk",
        url: "/clients/" + client?.id+"/client-network",
        icon: UsersRound ,
        items: [
            {
                title: "Noodcontacten",
                url: "/clients/" + client?.id+"/client-network/emergency",
            },
            {
                title: "Betrokken medewerkers",
                url: "/clients/" + client?.id+"/client-network/involved-employees",
            }
        ],
    },
    {
        title: "Rapporten",
        url: "/clients/" + client?.id+"/reports",
        icon: FileBadge ,
        items: [
            {
                title: "User Reports",
                url: "/clients/" + client?.id+"/reports/user-reports",
            },
            {
                title: "Automatic Reports",
                url: "/clients/" + client?.id+"/reports/automatic-reports",
            }
        ],
    },
    {
        title: "Documenten",
        url: "/clients/" + client?.id+"/documents",
        icon: FileText ,
    },
    {
        title: "Vragenlijsten",
        url: "/clients/" + client?.id+"/questionnaires",
        icon: FilesIcon ,
    },
    {
        title: "Calendar",
        url: "/clients/" + client?.id+"/calendar",
        icon: CalendarClock ,
    }
];