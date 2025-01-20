import { Permission } from "../types/permission.types";

export const PermissionsEnum = {
    CreateEmployee : "EMPLOYEE.CREATE",
    ReadEmployee : "EMPLOYEE.READ",
    UpdateEmployee : "EMPLOYEE.UPDATE",
    DeleteEmployee : "EMPLOYEE.DELETE",
    ViewEmployee : "EMPLOYEE.VIEW",
    ViewDashboard : "DASHBOARD.VIEW",
    ViewProfile : "PROFILE.VIEW",
    ViewClient : "CLIENT.VIEW",
    ViewFinance : "FINANCE.VIEW",
    ViewCareCoordination : "CARE_COORDINATION.VIEW",
    ViewSender : "SENDER.VIEW",
    ViewIncidentOverview : "INCIDENT_OVERVIEW.VIEW",
    ViewLocation : "LOCATION.VIEW",
    ViewTask : "TASK.VIEW",
    ViewConversation : "CONVERSATION.VIEW",
    ViewSettings : "SETTINGS.VIEW",
    UpdatePermission : "PERMISSION.UPDATE",
    ViewPermission : "PERMISSION.VIEW",
    ViewActivityLog : "ACTIVITY_LOG.VIEW",
    ViewContact : "CONTACT.VIEW",//TODO: rename to sender
    ViewEmployeeProfile : "EMPLOYEE_PROFILE.VIEW",
} as const;
type PermissionType = keyof typeof PermissionsEnum;
export const PermissionsObjects:{
    [key in PermissionType]: Permission
} = {
    ViewDashboard: {
        id: 1,
        name: "DASHBOARD.VIEW",
        resource: "/dashboard",
        method: "GET",
    },
    ViewProfile: {
        id: 2,
        name: "PROFILE.VIEW",
        resource: "/profile",
        method: "GET",
    },
    ViewClient: {
        id: 3,
        name: "CLIENT.VIEW",
        resource: "/clients",
        method: "GET",
    },
    ViewFinance: {
        id: 4,
        name: "FINANCE.VIEW",
        resource: "/finance",
        method: "GET",
    },
    ViewCareCoordination: {
        id: 5,
        name: "CARE_COORDINATION.VIEW",
        resource: "/care-coordination",
        method: "GET",
    },
    ViewSender: {
        id: 6,
        name: "SENDER.VIEW",
        resource: "/senders",
        method: "GET",
    },
    ViewIncidentOverview: {
        id: 7,
        name: "INCIDENT_OVERVIEW.VIEW",
        resource: "/incident-overview",
        method: "GET",
    },
    ViewLocation: {
        id: 8,
        name: "LOCATION.VIEW",
        resource: "/locations",
        method: "GET",
    },
    ViewTask: {
        id: 9,
        name: "TASK.VIEW",
        resource: "/tasks",
        method: "GET",
    },
    ViewConversation: {
        id: 10,
        name: "CONVERSATION.VIEW",
        resource: "/conversations",
        method: "GET",
    },
    ViewSettings: {
        id: 11,
        name: "SETTINGS.VIEW",
        resource: "/settings",
        method: "GET",
    },
    UpdatePermission: {
        id: 12,
        name: "PERMISSION.UPDATE",
        resource: "/permissions",
        method: "PUT",
    },
    ViewPermission: {
        id: 13,
        name: "PERMISSION.VIEW",
        resource: "/permissions",
        method: "GET",
    },
    ViewActivityLog: {
        id: 14,
        name: "ACTIVITY_LOG.VIEW",
        resource: "/activity-log",
        method: "GET",
    },
    CreateEmployee: {
        id: 15,
        name: "EMPLOYEE.CREATE",
        resource: "/employees",
        method: "POST",
    },
    ReadEmployee: {
        id: 16,
        name: "EMPLOYEE.READ",
        resource: "/employees",
        method: "GET",
    },
    UpdateEmployee: {
        id: 17,
        name: "EMPLOYEE.UPDATE",
        resource: "/employees",
        method: "PUT",
    },
    DeleteEmployee: {
        id: 18,
        name: "EMPLOYEE.DELETE",
        resource: "/employees",
        method: "DELETE",
    },
    ViewEmployee: {
        id: 19,
        name: "EMPLOYEE.VIEW",
        resource: "/employees",
        method: "GET",
    },
    ViewContact: {
        id: 20,
        name: "CONTACT.VIEW",
        resource: "/contacts",
        method: "GET",
    },
    ViewEmployeeProfile: {
        id: 21,
        name: "EMPLOYEE_PROFILE.VIEW",
        resource: "/employee-profile",
        method: "GET",
    }
}