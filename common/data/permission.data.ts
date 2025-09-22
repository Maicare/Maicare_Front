import { Permission } from "../types/permission.types";

export const PermissionsEnum = {
  // Appointments & Cards
  CreateAppointment: "APPOINTMENT.CREATE",
  DeleteAppointment: "APPOINTMENT.DELETE",
  UpdateAppointment: "APPOINTMENT.UPDATE",
  ViewAppointment: "APPOINTMENT.VIEW",
  ConfirmAppointment: "APPOINTMENT.CONFIRM",

  CreateAppointmentCard: "APPOINTMENT_CARD.CREATE",
  DeleteAppointmentCard: "APPOINTMENT_CARD.DELETE",
  UpdateAppointmentCard: "APPOINTMENT_CARD.UPDATE",
  ViewAppointmentCard: "APPOINTMENT_CARD.VIEW",
  GenerateDocumentAppointmentCard: "APPOINTMENT_CARD.GENERATE_DOCUMENT",

  // Clients
  CreateClient: "CLIENT.CREATE",
  DeleteClient: "CLIENT.DELETE",
  UpdateClient: "CLIENT.UPDATE",
  ViewClient: "CLIENT.VIEW",
  UpdateClientStatus: "CLIENT.STATUS.UPDATE",

  // Client Incidents
  CreateClientIncident: "CLIENT.INCIDENT.CREATE",
  DeleteClientIncident: "CLIENT.INCIDENT.DELETE",
  UpdateClientIncident: "CLIENT.INCIDENT.UPDATE",
  ViewClientIncident: "CLIENT.INCIDENT.VIEW",
  ConfirmClientIncident: "CLIENT.INCIDENT.CONFIRM",

  // Client Diagnoses
  CreateClientDiagnosis: "CLIENT.DIAGNOSIS.CREATE",
  DeleteClientDiagnosis: "CLIENT.DIAGNOSIS.DELETE",
  UpdateClientDiagnosis: "CLIENT.DIAGNOSIS.UPDATE",
  ViewClientDiagnosis: "CLIENT.DIAGNOSIS.VIEW",

  // Client Medications
  CreateClientMedication: "CLIENT.MEDICATION.CREATE",
  DeleteClientMedication: "CLIENT.MEDICATION.DELETE",
  UpdateClientMedication: "CLIENT.MEDICATION.UPDATE",
  ViewClientMedication: "CLIENT.MEDICATION.VIEW",

  // Client Emergency Contacts
  CreateClientEmergencyContact: "CLIENT.EMERGENCY_CONTACT.CREATE",
  DeleteClientEmergencyContact: "CLIENT.EMERGENCY_CONTACT.DELETE",
  UpdateClientEmergencyContact: "CLIENT.EMERGENCY_CONTACT.UPDATE",
  ViewClientEmergencyContact: "CLIENT.EMERGENCY_CONTACT.VIEW",

  // Client Involved Employees
  CreateClientInvolvedEmployee: "CLIENT.INVOLVED_EMPLOYEE.CREATE",
  DeleteClientInvolvedEmployee: "CLIENT.INVOLVED_EMPLOYEE.DELETE",
  UpdateClientInvolvedEmployee: "CLIENT.INVOLVED_EMPLOYEE.UPDATE",
  ViewClientInvolvedEmployee: "CLIENT.INVOLVED_EMPLOYEE.VIEW",

  // Client Progress Reports
  CreateClientProgressReport: "CLIENT.PROGRESS_REPORT.CREATE",
  DeleteClientProgressReport: "CLIENT.PROGRESS_REPORT.DELETE",
  UpdateClientProgressReport: "CLIENT.PROGRESS_REPORT.UPDATE",
  ViewClientProgressReport: "CLIENT.PROGRESS_REPORT.VIEW",

  // Client AI Progress Reports
  GenerateClientAiProgressReport: "CLIENT.AI_PROGRESS_REPORT.GENERATE",
  ConfirmClientAiProgressReport: "CLIENT.AI_PROGRESS_REPORT.CONFIRM",
  ViewClientAiProgressReport: "CLIENT.AI_PROGRESS_REPORT.VIEW",

  // Contracts
  CreateContract: "CONTRACT.CREATE",
  DeleteContract: "CONTRACT.DELETE",
  UpdateContract: "CONTRACT.UPDATE",
  ViewContract: "CONTRACT.VIEW",
  CreateContractType: "CONTRACT_TYPE.CREATE",
  DeleteContractType: "CONTRACT_TYPE.DELETE",
  ViewContractType: "CONTRACT_TYPE.VIEW",

  // Care Plans (global)
  CreateCarePlan: "CARE_PLAN.CREATE",
  DeleteCarePlan: "CARE_PLAN.DELETE",
  UpdateCarePlan: "CARE_PLAN.UPDATE",
  ViewCarePlan: "CARE_PLAN.VIEW",

  // Dashboard & Settings
  ViewDashboard: "DASHBOARD.VIEW",
  ViewSettings: "SETTINGS.VIEW",

  // Employees
  CreateEmployee: "EMPLOYEE.CREATE",
  DeleteEmployee: "EMPLOYEE.DELETE",
  UpdateEmployee: "EMPLOYEE.UPDATE",
  ViewEmployee: "EMPLOYEE.VIEW",
  ViewEmployeeAppointment:"EMPLOYEE.APPOINTMENT.VIEW",

  // Incidents overview
  ViewIncident: "INCIDENT.VIEW",

  // Finance & Invoices
  ViewFinance: "FINANCE.VIEW",
  CreateInvoice: "INVOICE.CREATE",
  DeleteInvoice: "INVOICE.DELETE",
  UpdateInvoice: "INVOICE.UPDATE",
  ViewInvoice: "INVOICE.VIEW",

  CreateInvoicePayment: "INVOICE.PAYMENT.CREATE",
  DeleteInvoicePayment: "INVOICE.PAYMENT.DELETE",
  UpdateInvoicePayment: "INVOICE.PAYMENT.UPDATE",
  ViewInvoicePayment: "INVOICE.PAYMENT.VIEW",

  // Locations
  CreateLocation: "LOCATION.CREATE",
  DeleteLocation: "LOCATION.DELETE",
  UpdateLocation: "LOCATION.UPDATE",
  ViewLocation: "LOCATION.VIEW",

  // Profile (sic)
  ViewProfile: "PROFILE.VIEW",

  // Registration Forms
  ViewRegistrationForm: "REGISTRATION_FORM.VIEW",
  UpdateRegistrationForm: "REGISTRATION_FORM.UPDATE",
  DeleteRegistrationForm: "REGISTRATION_FORM.DELETE",

  // Roles
  CreateRoles: "ROLES.CREATE",
  DeleteRoles: "ROLES.DELETE",
  UpdateRoles: "ROLES.UPDATE",
  ViewRoles: "ROLES.VIEW",
  AssignRoles: "ROLES.ASSIGN",

  // Permissions
  ViewPermissions: "PERMISSIONS.VIEW",
  UpdatePermissions: "PERMISSIONS.UPDATE",
  DeletePermissions: "PERMISSIONS.DELETE",
  CreatePermissions: "PERMISSIONS.CREATE",
  GrantPermissions: "PERMISSIONS.GRANT",

  // Schedules & Shifts
  CreateSchedule: "SCHEDULE.CREATE",
  DeleteSchedule: "SCHEDULE.DELETE",
  UpdateSchedule: "SCHEDULE.UPDATE",
  ViewSchedule: "SCHEDULE.VIEW",

  CreateShift: "SHIFT.CREATE",
  DeleteShift: "SHIFT.DELETE",
  UpdateShift: "SHIFT.UPDATE",
  ViewShift: "SHIFT.VIEW",

  // Senders
  CreateSender: "SENDER.CREATE",
  UpdateSender: "SENDER.UPDATE",
  ViewSender: "SENDER.VIEW",

  // Test
  ViewTest: "TEST.VIEW",

  // Placeholder / meta
  ViewCareCoordination: "CARE_COORDINATION.VIEW",

  // Reports & Audit
  ViewReports: "REPORTS.VIEW",
  ViewAuditLog: "AUDIT.LOG.VIEW",

  // === Extra items present in admin role only ===
  // Client Care Plans (scoped under client)
  CreateClientCarePlan: "CLIENT.CARE_PLAN.CREATE",
  DeleteClientCarePlan: "CLIENT.CARE_PLAN.DELETE",
  UpdateClientCarePlan: "CLIENT.CARE_PLAN.UPDATE",
  ViewClientCarePlan: "CLIENT.CARE_PLAN.VIEW",

  // Client Documents
  ViewClientDocuments: "CLIENT.DOCUMENTS.VIEW",
  UploadClientDocuments: "CLIENT.DOCUMENTS.UPLOAD",
  DeleteClientDocuments: "CLIENT.DOCUMENTS.DELETE",

  // Client Appointments
  ViewClientAppointments: "CLIENT.APPOINTMENTS.VIEW",

  // Employee Working Hours & Contract
  ViewEmployeeWorkingHours: "EMPLOYEE.WORKING_HOURS.VIEW",
  ViewEmployeeContract: "EMPLOYEE.CONTRACT.VIEW",
  UpdateEmployeeContract: "EMPLOYEE.CONTRACT.UPDATE",
} as const;

type PermissionType = keyof typeof PermissionsEnum;

export const PermissionsObjects: { [key in PermissionType]: Permission } = {
  // Appointments & Cards
  CreateAppointment: { id: 1, name: "APPOINTMENT.CREATE", resource: "/appointments", method: "POST" },
  DeleteAppointment: { id: 2, name: "APPOINTMENT.DELETE", resource: "/appointments", method: "DELETE" },
  UpdateAppointment: { id: 3, name: "APPOINTMENT.UPDATE", resource: "/appointments", method: "PUT" },
  ViewAppointment:   { id: 4, name: "APPOINTMENT.VIEW",   resource: "/appointments", method: "GET" },
  ConfirmAppointment:{ id: 5, name: "APPOINTMENT.CONFIRM", resource: "/appointments/confirm", method: "POST" },

  CreateAppointmentCard: { id: 6, name: "APPOINTMENT_CARD.CREATE", resource: "/appointment_cards", method: "POST" },
  DeleteAppointmentCard: { id: 7, name: "APPOINTMENT_CARD.DELETE", resource: "/appointment_cards", method: "DELETE" },
  UpdateAppointmentCard: { id: 8, name: "APPOINTMENT_CARD.UPDATE", resource: "/appointment_cards", method: "PUT" },
  ViewAppointmentCard:   { id: 9, name: "APPOINTMENT_CARD.VIEW",   resource: "/appointment_cards", method: "GET" },
  GenerateDocumentAppointmentCard: {
    id: 10, name: "APPOINTMENT_CARD.GENERATE_DOCUMENT", resource: "/appointment_cards/generate_document", method: "POST"
  },

  // Clients
  CreateClient: { id: 11, name: "CLIENT.CREATE", resource: "/clients", method: "POST" },
  DeleteClient: { id: 12, name: "CLIENT.DELETE", resource: "/clients", method: "DELETE" },
  UpdateClient: { id: 13, name: "CLIENT.UPDATE", resource: "/clients", method: "PUT" },
  ViewClient:   { id: 14, name: "CLIENT.VIEW",   resource: "/clients", method: "GET" },
  UpdateClientStatus: { id: 15, name: "CLIENT.STATUS.UPDATE", resource: "/clients/status", method: "PUT" },

  // Client Incidents
  CreateClientIncident: { id: 16, name: "CLIENT.INCIDENT.CREATE", resource: "/clients/incidents", method: "POST" },
  DeleteClientIncident: { id: 17, name: "CLIENT.INCIDENT.DELETE", resource: "/clients/incidents", method: "DELETE" },
  UpdateClientIncident: { id: 18, name: "CLIENT.INCIDENT.UPDATE", resource: "/clients/incidents", method: "PUT" },
  ViewClientIncident:   { id: 19, name: "CLIENT.INCIDENT.VIEW",   resource: "/clients/incidents", method: "GET" },
  ConfirmClientIncident:{ id: 20, name: "CLIENT.INCIDENT.CONFIRM", resource: "/clients/incidents/confirm", method: "PUT" },

  // Client Diagnoses
  CreateClientDiagnosis: { id: 21, name: "CLIENT.DIAGNOSIS.CREATE", resource: "/clients/diagnoses", method: "POST" },
  DeleteClientDiagnosis: { id: 22, name: "CLIENT.DIAGNOSIS.DELETE", resource: "/clients/diagnoses", method: "DELETE" },
  UpdateClientDiagnosis: { id: 23, name: "CLIENT.DIAGNOSIS.UPDATE", resource: "/clients/diagnoses", method: "PUT" },
  ViewClientDiagnosis:   { id: 24, name: "CLIENT.DIAGNOSIS.VIEW",   resource: "/clients/diagnoses", method: "GET" },

  // Client Medications
  CreateClientMedication: { id: 25, name: "CLIENT.MEDICATION.CREATE", resource: "/clients/medications", method: "POST" },
  DeleteClientMedication: { id: 26, name: "CLIENT.MEDICATION.DELETE", resource: "/clients/medications", method: "DELETE" },
  UpdateClientMedication: { id: 27, name: "CLIENT.MEDICATION.UPDATE", resource: "/clients/medications", method: "PUT" },
  ViewClientMedication:   { id: 28, name: "CLIENT.MEDICATION.VIEW",   resource: "/clients/medications", method: "GET" },

  // Client Emergency Contacts
  CreateClientEmergencyContact: { id: 29, name: "CLIENT.EMERGENCY_CONTACT.CREATE", resource: "/clients/emergency_contacts", method: "POST" },
  DeleteClientEmergencyContact: { id: 30, name: "CLIENT.EMERGENCY_CONTACT.DELETE", resource: "/clients/emergency_contacts", method: "DELETE" },
  UpdateClientEmergencyContact: { id: 31, name: "CLIENT.EMERGENCY_CONTACT.UPDATE", resource: "/clients/emergency_contacts", method: "PUT" },
  ViewClientEmergencyContact:   { id: 32, name: "CLIENT.EMERGENCY_CONTACT.VIEW",   resource: "/clients/emergency_contacts", method: "GET" },

  // Client Involved Employees
  CreateClientInvolvedEmployee: { id: 33, name: "CLIENT.INVOLVED_EMPLOYEE.CREATE", resource: "/clients/involved_employees", method: "POST" },
  DeleteClientInvolvedEmployee: { id: 34, name: "CLIENT.INVOLVED_EMPLOYEE.DELETE", resource: "/clients/involved_employees", method: "DELETE" },
  UpdateClientInvolvedEmployee: { id: 35, name: "CLIENT.INVOLVED_EMPLOYEE.UPDATE", resource: "/clients/involved_employees", method: "PUT" },
  ViewClientInvolvedEmployee:   { id: 36, name: "CLIENT.INVOLVED_EMPLOYEE.VIEW",   resource: "/clients/involved_employees", method: "GET" },

  // Client Progress Reports
  CreateClientProgressReport: { id: 37, name: "CLIENT.PROGRESS_REPORT.CREATE", resource: "/clients/progress_reports", method: "POST" },
  DeleteClientProgressReport: { id: 38, name: "CLIENT.PROGRESS_REPORT.DELETE", resource: "/clients/progress_reports", method: "DELETE" },
  UpdateClientProgressReport: { id: 39, name: "CLIENT.PROGRESS_REPORT.UPDATE", resource: "/clients/progress_reports", method: "PUT" },
  ViewClientProgressReport:   { id: 40, name: "CLIENT.PROGRESS_REPORT.VIEW",   resource: "/clients/progress_reports", method: "GET" },

  // Client AI Progress Reports
  GenerateClientAiProgressReport: { id: 41, name: "CLIENT.AI_PROGRESS_REPORT.GENERATE", resource: "/clients/ai_progress_reports", method: "POST" },
  ConfirmClientAiProgressReport:  { id: 42, name: "CLIENT.AI_PROGRESS_REPORT.CONFIRM",  resource: "/clients/ai_progress_reports/confirm", method: "POST" },
  ViewClientAiProgressReport:     { id: 43, name: "CLIENT.AI_PROGRESS_REPORT.VIEW",     resource: "/clients/ai_progress_reports", method: "GET" },

  // Contracts
  CreateContract: { id: 44, name: "CONTRACT.CREATE", resource: "/contracts", method: "POST" },
  DeleteContract: { id: 45, name: "CONTRACT.DELETE", resource: "/contracts", method: "DELETE" },
  UpdateContract: { id: 46, name: "CONTRACT.UPDATE", resource: "/contracts", method: "PUT" },
  ViewContract:   { id: 47, name: "CONTRACT.VIEW",   resource: "/contracts", method: "GET" },

  CreateContractType: { id: 48, name: "CONTRACT_TYPE.CREATE", resource: "/contract_types", method: "POST" },
  DeleteContractType: { id: 49, name: "CONTRACT_TYPE.DELETE", resource: "/contract_types", method: "DELETE" },
  ViewContractType:   { id: 50, name: "CONTRACT_TYPE.VIEW",   resource: "/contract_types", method: "GET" },

  // Care Plans (global)
  CreateCarePlan: { id: 51, name: "CARE_PLAN.CREATE", resource: "/care_plans", method: "POST" },
  DeleteCarePlan: { id: 52, name: "CARE_PLAN.DELETE", resource: "/care_plans", method: "DELETE" },
  UpdateCarePlan: { id: 53, name: "CARE_PLAN.UPDATE", resource: "/care_plans", method: "PUT" },
  ViewCarePlan:   { id: 54, name: "CARE_PLAN.VIEW",   resource: "/care_plans", method: "GET" },

  // Dashboard & Settings
  ViewDashboard: { id: 55, name: "DASHBOARD.VIEW", resource: "/dashboard", method: "GET" },
  ViewSettings:  { id: 56, name: "SETTINGS.VIEW",  resource: "/settings",  method: "GET" },

  // Employees
  CreateEmployee: { id: 57, name: "EMPLOYEE.CREATE", resource: "/employees", method: "POST" },
  DeleteEmployee: { id: 58, name: "EMPLOYEE.DELETE", resource: "/employees", method: "DELETE" },
  UpdateEmployee: { id: 59, name: "EMPLOYEE.UPDATE", resource: "/employees", method: "PUT" },
  ViewEmployee:   { id: 60, name: "EMPLOYEE.VIEW",   resource: "/employees", method: "GET" },
  ViewEmployeeAppointment: {id:888,name:"EMPLOYEE.APPOINTMENT.VIEW",   resource: "/employees", method: "GET" },

  // Incidents
  ViewIncident: { id: 61, name: "INCIDENT.VIEW", resource: "/incidents", method: "GET" },

  // Finance & Invoices
  ViewFinance: { id: 62, name: "FINANCE.VIEW", resource: "/finance", method: "GET" },

  CreateInvoice: { id: 63, name: "INVOICE.CREATE", resource: "/invoices", method: "POST" },
  DeleteInvoice: { id: 64, name: "INVOICE.DELETE", resource: "/invoices", method: "DELETE" },
  UpdateInvoice: { id: 65, name: "INVOICE.UPDATE", resource: "/invoices", method: "PUT" },
  ViewInvoice:   { id: 66, name: "INVOICE.VIEW",   resource: "/invoices", method: "GET" },

  CreateInvoicePayment: { id: 67, name: "INVOICE.PAYMENT.CREATE", resource: "/invoices/payments", method: "POST" },
  DeleteInvoicePayment: { id: 68, name: "INVOICE.PAYMENT.DELETE", resource: "/invoices/payments", method: "DELETE" },
  UpdateInvoicePayment: { id: 69, name: "INVOICE.PAYMENT.UPDATE", resource: "/invoices/payments", method: "PUT" },
  ViewInvoicePayment:   { id: 70, name: "INVOICE.PAYMENT.VIEW",   resource: "/invoices/payments", method: "GET" },

  // Locations
  CreateLocation: { id: 71, name: "LOCATION.CREATE", resource: "/locations", method: "POST" },
  DeleteLocation: { id: 72, name: "LOCATION.DELETE", resource: "/locations", method: "DELETE" },
  UpdateLocation: { id: 73, name: "LOCATION.UPDATE", resource: "/locations", method: "PUT" },
  ViewLocation:   { id: 74, name: "LOCATION.VIEW",   resource: "/locations", method: "GET" },

  // Profile (sic)
  ViewProfile: { id: 75, name: "PROFILE.VIEW", resource: "/finance", method: "POST" }, // sic: kept for compatibility

  // Registration Forms
  ViewRegistrationForm:   { id: 76, name: "REGISTRATION_FORM.VIEW",   resource: "/registration_form", method: "GET" },
  UpdateRegistrationForm: { id: 77, name: "REGISTRATION_FORM.UPDATE", resource: "/registration_form", method: "PUT" },
  DeleteRegistrationForm: { id: 78, name: "REGISTRATION_FORM.DELETE", resource: "/registration_form", method: "DELETE" },

  // Roles
  CreateRoles: { id: 79, name: "ROLES.CREATE", resource: "/roles", method: "POST" },
  DeleteRoles: { id: 80, name: "ROLES.DELETE", resource: "/roles", method: "DELETE" },
  UpdateRoles: { id: 81, name: "ROLES.UPDATE", resource: "/roles/asign", method: "PUT" }, // typo kept
  ViewRoles:   { id: 82, name: "ROLES.VIEW",   resource: "/roles", method: "GET" },
  AssignRoles: { id: 83, name: "ROLES.ASSIGN", resource: "/employees/roles", method: "POST" },

  // Permissions
  ViewPermissions:   { id: 84, name: "PERMISSIONS.VIEW",   resource: "/permissions", method: "GET" },
  UpdatePermissions: { id: 85, name: "PERMISSIONS.UPDATE", resource: "/permissions", method: "PUT" },
  DeletePermissions: { id: 86, name: "PERMISSIONS.DELETE", resource: "/permissions", method: "DELETE" },
  CreatePermissions: { id: 87, name: "PERMISSIONS.CREATE", resource: "/permissions", method: "POST" },
  GrantPermissions:  { id: 88, name: "PERMISSIONS.GRANT",  resource: "/permissions/grant", method: "POST" },

  // Schedules & Shifts
  CreateSchedule: { id: 89, name: "SCHEDULE.CREATE", resource: "/schedules", method: "POST" },
  DeleteSchedule: { id: 90, name: "SCHEDULE.DELETE", resource: "/schedules", method: "DELETE" },
  UpdateSchedule: { id: 91, name: "SCHEDULE.UPDATE", resource: "/schedules", method: "PUT" },
  ViewSchedule:   { id: 92, name: "SCHEDULE.VIEW",   resource: "/schedules", method: "GET" },

  CreateShift: { id: 93, name: "SHIFT.CREATE", resource: "/shifts", method: "POST" },
  DeleteShift: { id: 94, name: "SHIFT.DELETE", resource: "/shifts", method: "DELETE" },
  UpdateShift: { id: 95, name: "SHIFT.UPDATE", resource: "/shifts", method: "PUT" },
  ViewShift:   { id: 96, name: "SHIFT.VIEW",   resource: "/shifts", method: "GET" },

  // Senders
  CreateSender: { id: 97, name: "SENDER.CREATE", resource: "/senders", method: "POST" },
  UpdateSender: { id: 98, name: "SENDER.UPDATE", resource: "/senders", method: "PUT" },
  ViewSender:   { id: 99, name: "SENDER.VIEW",   resource: "/senders", method: "GET" },

  // Test
  ViewTest: { id: 100, name: "TEST.VIEW", resource: "/test", method: "GET" },

  // Placeholder / meta
  ViewCareCoordination: { id: 101, name: "CARE_COORDINATION.VIEW", resource: "none", method: "NONE" },

  // Reports & Audit
  ViewReports:  { id: 102, name: "REPORTS.VIEW",  resource: "/reports",   method: "GET" },
  ViewAuditLog: { id: 103, name: "AUDIT.LOG.VIEW", resource: "/audit/logs", method: "GET" },

  // === Extra items present in admin role only (resources inferred) ===
  CreateClientCarePlan: { id: 104, name: "CLIENT.CARE_PLAN.CREATE", resource: "/clients/care_plans", method: "POST" }, // inferred
  DeleteClientCarePlan: { id: 105, name: "CLIENT.CARE_PLAN.DELETE", resource: "/clients/care_plans", method: "DELETE" }, // inferred
  UpdateClientCarePlan: { id: 106, name: "CLIENT.CARE_PLAN.UPDATE", resource: "/clients/care_plans", method: "PUT" }, // inferred
  ViewClientCarePlan:   { id: 107, name: "CLIENT.CARE_PLAN.VIEW",   resource: "/clients/care_plans", method: "GET" }, // inferred

  ViewClientDocuments:  { id: 108, name: "CLIENT.DOCUMENTS.VIEW",   resource: "/clients/documents", method: "GET" }, // inferred
  UploadClientDocuments:{ id: 109, name: "CLIENT.DOCUMENTS.UPLOAD", resource: "/clients/documents", method: "POST" }, // inferred
  DeleteClientDocuments:{ id: 110, name: "CLIENT.DOCUMENTS.DELETE", resource: "/clients/documents", method: "DELETE" }, // inferred

  ViewClientAppointments:{ id: 111, name: "CLIENT.APPOINTMENTS.VIEW", resource: "/clients/appointments", method: "GET" }, // inferred

  ViewEmployeeWorkingHours:{ id: 112, name: "EMPLOYEE.WORKING_HOURS.VIEW", resource: "/employees/working_hours", method: "GET" }, // inferred
  ViewEmployeeContract:    { id: 113, name: "EMPLOYEE.CONTRACT.VIEW",    resource: "/employees/contracts", method: "GET" }, // inferred
  UpdateEmployeeContract:  { id: 114, name: "EMPLOYEE.CONTRACT.UPDATE",  resource: "/employees/contracts", method: "PUT" }, // inferred
};
