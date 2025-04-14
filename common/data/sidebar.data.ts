import { EmployeeDetailsResponse } from "@/types/employee.types";
import {  BellRing, BookMarked, BriefcaseBusiness, Calendar, FileBadge, FilesIcon, FileText, Goal, GraduationCap, Handshake, HeartPulse, Home, Map,  UserCircle,  Users2, UsersRound } from "lucide-react";

export const sidebarLinks = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
        isActive: true,
    },
    {
        title: "Clients",
        url: "/test/client",
        icon: Handshake,
    },
    {
        title: "Employees",
        url: "/test/employee",
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
];
export const sidebarEmployeeLinks = (employee:{first_name:string,last_name:string,id:number})=> [
    {
        title: "Overzicht ("+employee?.first_name + " " + employee?.last_name + ")",
        url: "/test/employee/" + employee?.id,
        icon: Users2,
        isActive: true,
    },
    {
        title: "Certificaten",
        url: "/test/employee/" + employee?.id+"/certification",
        icon: BookMarked,
    },
    {
        title: "Opleidingen",
        url: "/test/employee/" + employee?.id+"/education",
        icon: GraduationCap,
    },
    {
        title: "Ervaringen",
        url: "/test/employee/" + employee?.id+"/experience",
        icon: BriefcaseBusiness ,
    }
];
export const sidebarClientLinks = (client:{first_name:string,last_name:string,id:number})=> [
    {
        title: "Overzicht ("+client?.first_name + " " + client?.last_name + ")",
        url: "/test/client/" + client?.id,
        icon: UserCircle,
        isActive: true,
    },
    {
        title: "Medisch Dossier",
        url: "/test/client/" + client?.id+"/medical-record",
        icon: HeartPulse,
    },
    {
        title: "Afsprakenkaart",
        url: "/test/client/" + client?.id+"/appointment-card",
        icon: Calendar,
    },
    {
        title: "Doelen",
        url: "/test/client/" + client?.id+"/goals",
        icon: Goal ,
    },
    {
        title: "Incidenten",
        url: "/test/client/" + client?.id+"/incidents",
        icon: BellRing ,
    },
    {
        title: "Cliëntennetwerk",
        url: "/test/client/" + client?.id+"/client-network",
        icon: UsersRound ,
    },
    {
        title: "Rapporten",
        url: "/test/client/" + client?.id+"/reports",
        icon: FileBadge ,
        items: [
            {
                title: "User Reports",
                url: "/test/client/" + client?.id+"/reports/user-reports",
            },
            {
                title: "Automatic Reports",
                url: "/test/client/" + client?.id+"/reports/automatic-reports",
            }
        ],
    },
    {
        title: "Documenten",
        url: "/test/client/" + client?.id+"/documents",
        icon: FileText ,
    },
    {
        title: "Vragenlijsten",
        url: "/test/client/" + client?.id+"/questionnaires",
        icon: FilesIcon ,
    }
];