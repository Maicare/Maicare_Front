export type NotificationData =
  | NewAppointmentNotification
  | NewClientAssignmentNotification
  | ClientContractReminderNotification
  | NewIncidentReportNotification
  | NewScheduleNotification;

export interface BaseNotification {
  type: string;
  created_at: string;
  is_read: boolean;
  message: string;
  notification_id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export interface NewAppointmentNotification extends BaseNotification {
  data: { new_appointment: {
    appointment_id: string; created_by: string; start_time: string; end_time: string; location: string;
  }};
}
export interface NewClientAssignmentNotification extends BaseNotification {
  data: { new_client_assignment: {
    client_id: number; client_first_name: string; client_last_name: string; client_location: string;
  }};
}
export interface ClientContractReminderNotification extends BaseNotification {
  data: { client_contract_reminder: {
    client_id: number; client_first_name: string; client_last_name: string; contract_id: number;
    care_type: string; contract_start: string; contract_end: string; reminder_type: string;
    last_reminder_sent_at: string;
  }};
}
export interface NewIncidentReportNotification extends BaseNotification {
  data: { new_incident_report: {
    id: number; employee_id: number; employee_first_name: string; employee_last_name: string;
    location_id: number; location_name: string; client_id: number; client_first_name: string;
    client_last_name: string; severity_of_incident: string;
  }};
}
export interface NewScheduleNotification extends BaseNotification {
  data: { new_schedule_notification: {
    schedule_id: string; created_by: number; start_time: string; end_time: string; location: string;
  }};
}