import { useState } from "react";
import { cn } from "@/utils/cn";
import { 
  Bell, 
  Calendar, 
  User, 
  AlertTriangle, 
  Clock, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";
import { format,  } from "date-fns";

interface NotificationProps {
  notification: NotificationData;
  className?: string;
}

type NotificationData = 
  | NewAppointmentNotification
  | NewClientAssignmentNotification
  | ClientContractReminderNotification
  | NewIncidentReportNotification
  | NewScheduleNotification;

interface BaseNotification {
  type: "notification";
  created_at: string;
}

interface NewAppointmentNotification extends BaseNotification {
  data: {
    new_appointment: {
      appointment_id: string;
      created_by: string;
      start_time: string;
      end_time: string;
      location: string;
    };
  };
}

interface NewClientAssignmentNotification extends BaseNotification {
  data: {
    new_client_assignment: {
      client_id: number;
      client_first_name: string;
      client_last_name: string;
      client_location: string;
    };
  };
}

interface ClientContractReminderNotification extends BaseNotification {
  data: {
    client_contract_reminder: {
      client_id: number;
      client_first_name: string;
      client_last_name: string;
      contract_id: number;
      care_type: string;
      contract_start: string;
      contract_end: string;
      reminder_type: string;
      last_reminder_sent_at: string;
    };
  };
}

interface NewIncidentReportNotification extends BaseNotification {
  data: {
    new_incident_report: {
      id: number;
      employee_id: number;
      employee_first_name: string;
      employee_last_name: string;
      location_id: number;
      location_name: string;
      client_id: number;
      client_first_name: string;
      client_last_name: string;
      severity_of_incident: string;
    };
  };
}

interface NewScheduleNotification extends BaseNotification {
  data: {
    new_schedule_notification: {
      schedule_id: string;
      created_by: number;
      start_time: string;
      end_time: string;
      location: string;
    };
  };
}

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "new_appointment":
      return <Calendar className="h-4 w-4 text-blue-500" />;
    case "new_client_assignment":
      return <User className="h-4 w-4 text-green-500" />;
    case "client_contract_reminder":
      return <Clock className="h-4 w-4 text-amber-500" />;
    case "new_incident_report":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case "new_schedule_notification":
      return <Calendar className="h-4 w-4 text-indigo-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

const Notification = ({ notification, className }: NotificationProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const notificationType = Object.keys(notification.data)[0] as keyof NotificationData["data"];
  
  return (
    <div className={cn(
      "bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow overflow-hidden",
      {
        "border-blue-200": notificationType === "new_appointment",
        "border-green-200": notificationType === "new_client_assignment",
        "border-amber-200": notificationType === "client_contract_reminder",
        "border-red-200": notificationType === "new_incident_report",
        "border-indigo-200": notificationType === "new_schedule_notification",
      },
      className
    )}>
      <div 
        className="flex items-start p-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-shrink-0 mr-3 mt-0.5">
          <NotificationIcon type={notificationType} />
        </div>
        
        <div className="flex-1 min-w-0">
          <NotificationSummary notification={notification} />
        </div>
        
        <button 
          className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>
      
      {isExpanded && (
        <div className="px-3 pb-3 pt-1 border-t border-gray-100">
          <NotificationDetails notification={notification} />
          <p className="mt-2 text-xs text-gray-500">
            {format(new Date(notification.created_at), "PPpp")}
          </p>
        </div>
      )}
    </div>
  );
};

const NotificationSummary = ({ notification }: { notification: NotificationData }) => {
  if ("new_appointment" in notification.data) {
    const { created_by, start_time } = notification.data.new_appointment;
    return (
      <>
        <h4 className="text-sm font-medium text-gray-900">New Appointment</h4>
        <p className="text-xs text-gray-600 truncate">
          With {created_by} at {format(new Date(start_time), "h:mm a")}
        </p>
      </>
    );
  }
  
  if ("new_client_assignment" in notification.data) {
    const { client_first_name, client_last_name } = notification.data.new_client_assignment;
    return (
      <>
        <h4 className="text-sm font-medium text-gray-900">New Client</h4>
        <p className="text-xs text-gray-600 truncate">
          {client_first_name} {client_last_name}
        </p>
      </>
    );
  }
  
  if ("client_contract_reminder" in notification.data) {
    const { client_first_name, client_last_name, contract_end } = notification.data.client_contract_reminder;
    return (
      <>
        <h4 className="text-sm font-medium text-gray-900">Contract Reminder</h4>
        <p className="text-xs text-gray-600 truncate">
          {client_first_name} {client_last_name} - {format(new Date(contract_end), "MMM d")}
        </p>
      </>
    );
  }
  
  if ("new_incident_report" in notification.data) {
    const { 
      client_first_name, 
      client_last_name, 
      severity_of_incident
    } = notification.data.new_incident_report;
    
    return (
      <>
        <h4 className="text-sm font-medium text-gray-900">Incident Report</h4>
        <p className="text-xs text-gray-600 truncate">
          {client_first_name} {client_last_name} - {severity_of_incident} severity
        </p>
      </>
    );
  }
  
  if ("new_schedule_notification" in notification.data) {
    const { start_time, location } = notification.data.new_schedule_notification;
    return (
      <>
        <h4 className="text-sm font-medium text-gray-900">New Schedule</h4>
        <p className="text-xs text-gray-600 truncate">
          {format(new Date(start_time), "MMM d, h:mm a")} at {location}
        </p>
      </>
    );
  }
  
  return null;
};

const NotificationDetails = ({ notification }: { notification: NotificationData }) => {
  if ("new_appointment" in notification.data) {
    const { created_by, start_time, end_time, location } = notification.data.new_appointment;
    return (
      <div className="text-sm text-gray-700 space-y-1">
        <p><span className="font-medium">Created by:</span> {created_by}</p>
        <p><span className="font-medium">Time:</span> {format(new Date(start_time), "PPpp")} to {format(new Date(end_time), "p")}</p>
        <p><span className="font-medium">Location:</span> {location}</p>
      </div>
    );
  }
  
  if ("new_client_assignment" in notification.data) {
    const { client_first_name, client_last_name, client_location } = notification.data.new_client_assignment;
    return (
      <div className="text-sm text-gray-700 space-y-1">
        <p><span className="font-medium">Client:</span> {client_first_name} {client_last_name}</p>
        <p><span className="font-medium">Location:</span> {client_location}</p>
      </div>
    );
  }
  
  if ("client_contract_reminder" in notification.data) {
    const { client_first_name, client_last_name, contract_end, care_type } = notification.data.client_contract_reminder;
    return (
      <div className="text-sm text-gray-700 space-y-1">
        <p><span className="font-medium">Client:</span> {client_first_name} {client_last_name}</p>
        <p><span className="font-medium">Care Type:</span> {care_type}</p>
        <p><span className="font-medium">Contract Ends:</span> {format(new Date(contract_end), "PP")}</p>
      </div>
    );
  }
  
  if ("new_incident_report" in notification.data) {
    const { 
      employee_first_name, 
      employee_last_name, 
      client_first_name, 
      client_last_name, 
      severity_of_incident,
      location_name
    } = notification.data.new_incident_report;
    
    return (
      <div className="text-sm text-gray-700 space-y-1">
        <p><span className="font-medium">Reported by:</span> {employee_first_name} {employee_last_name}</p>
        <p><span className="font-medium">Client:</span> {client_first_name} {client_last_name}</p>
        <p><span className="font-medium">Severity:</span> <span className={severity_of_incident === "high" ? "text-red-600 font-medium" : "text-amber-600"}>{severity_of_incident}</span></p>
        <p><span className="font-medium">Location:</span> {location_name}</p>
      </div>
    );
  }
  
  if ("new_schedule_notification" in notification.data) {
    const { start_time, end_time, location } = notification.data.new_schedule_notification;
    return (
      <div className="text-sm text-gray-700 space-y-1">
        <p><span className="font-medium">Time:</span> {format(new Date(start_time), "PPpp")} to {format(new Date(end_time), "p")}</p>
        <p><span className="font-medium">Location:</span> {location}</p>
      </div>
    );
  }
  
  return null;
};

// Example usage in a notifications list
const NotificationsList = () => {
  // Sample notifications data
  const notifications: NotificationData[] = [
    {
      type: "notification",
      data: {
        new_appointment: {
          appointment_id: "550e8400-e29b-41d4-a716-446655440000",
          created_by: "Dr. Smith",
          start_time: "2025-09-04T10:00:00Z",
          end_time: "2025-09-04T11:00:00Z",
          location: "Room 101"
        }
      },
      created_at: "2025-09-04T09:00:00Z"
    },
    {
      type: "notification",
      data: {
        new_client_assignment: {
          client_id: 12345,
          client_first_name: "Alice",
          client_last_name: "Johnson",
          client_location: "Paris"
        }
      },
      created_at: "2025-09-04T09:05:00Z"
    },
    {
      type: "notification",
      data: {
        client_contract_reminder: {
          client_id: 67890,
          client_first_name: "Bob",
          client_last_name: "Williams",
          contract_id: 2222,
          care_type: "ambulante",
          contract_start: "2024-09-01T00:00:00Z",
          contract_end: "2025-09-01T00:00:00Z",
          reminder_type: "initial",
          last_reminder_sent_at: "2025-08-25T12:00:00Z"
        }
      },
      created_at: "2025-09-04T09:10:00Z"
    },
    {
      type: "notification",
      data: {
        new_incident_report: {
          id: 98765,
          employee_id: 111,
          employee_first_name: "John",
          employee_last_name: "Doe",
          location_id: 555,
          location_name: "Nursing Home A",
          client_id: 444,
          client_first_name: "Emma",
          client_last_name: "Brown",
          severity_of_incident: "high"
        }
      },
      created_at: "2025-09-04T09:15:00Z"
    },
    {
      type: "notification",
      data: {
        new_schedule_notification: {
          schedule_id: "123e4567-e89b-12d3-a456-426614174000",
          created_by: 42,
          start_time: "2025-09-05T08:00:00Z",
          end_time: "2025-09-05T12:00:00Z",
          location: "Main Hall"
        }
      },
      created_at: "2025-09-04T09:20:00Z"
    }
  ];

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-3 bg-gray-50 rounded-lg">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Bell className="h-5 w-5 mr-2" />
        Notifications
      </h2>
      
      {notifications.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No notifications</p>
      ) : (
        notifications.map((notification, index) => (
          <Notification 
            key={index} 
            notification={notification} 
          />
        ))
      )}
    </div>
  );
};

export { Notification, NotificationsList };
export type { NotificationData };