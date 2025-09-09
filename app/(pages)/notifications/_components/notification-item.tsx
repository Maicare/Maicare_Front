"use client";
import { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { X, ChevronDown, ChevronUp, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import { NotificationData } from "@/types/notification.types";
type NotificationProps = {
    notification: NotificationData;
    onClose: () => void;
    onClick?: () => void;
}
const NotificationIcon = ({ type }: { type: string }) => {
    switch (type) {
        case "new_appointment":
            return (
                <div className="p-2 rounded-full bg-blue-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                </div>
            );
        case "new_client_assignment":
            return (
                <div className="p-2 rounded-full bg-green-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                </div>
            );
        case "client_contract_reminder":
            return (
                <div className="p-2 rounded-full bg-amber-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                </div>
            );
        case "new_incident_report":
            return (
                <div className="p-2 rounded-full bg-red-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </div>
            );
        case "new_schedule_notification":
            return (
                <div className="p-2 rounded-full bg-indigo-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                </div>
            );
        default:
            return (
                <div className="p-2 rounded-full bg-gray-100">
                    <Bell className="h-4 w-4 text-gray-600" />
                </div>
            );
    }
};
const NotificationItem = ({ notification, onClose, onClick }: NotificationProps) => {
    const [expanded, setExpanded] = useState(false);
    const notificationType = Object.keys(notification.data)[0] as keyof NotificationData["data"];

    const getNotificationTitle = () => {
        switch (notificationType) {
            case "new_appointment":
                return "New Appointment";
            case "new_client_assignment":
                return "New Client Assignment";
            case "client_contract_reminder":
                return "Contract Reminder";
            case "new_incident_report":
                return "Incident Report";
            case "new_schedule_notification":
                return "New Schedule";
            default:
                return "Notification";
        }
    };

    const getNotificationSummary = () => {
        if ("new_appointment" in notification.data) {
            const { created_by, start_time } = notification.data.new_appointment;
            return `With ${created_by} at ${format(new Date(start_time), "h:mm a")}`;
        }

        if ("new_client_assignment" in notification.data) {
            const { client_first_name, client_last_name } = notification.data.new_client_assignment;
            return `${client_first_name} ${client_last_name}`;
        }

        if ("client_contract_reminder" in notification.data) {
            const { client_first_name, client_last_name } = notification.data.client_contract_reminder;
            return `${client_first_name} ${client_last_name}`;
        }

        if ("new_incident_report" in notification.data) {
            const { client_first_name, client_last_name } = notification.data.new_incident_report;
            return `${client_first_name} ${client_last_name}`;
        }

        if ("new_schedule_notification" in notification.data) {
            const { start_time } = notification.data.new_schedule_notification;
            return `Starts at ${format(new Date(start_time), "h:mm a")}`;
        }

        return "New notification";
    };

    const getNotificationDetails = () => {
        if ("new_appointment" in notification.data) {
            const { created_by, start_time, end_time, location } = notification.data.new_appointment;
            return (
                <div className="text-sm text-gray-600 mt-1 space-y-1">
                    <p><span className="font-medium">With:</span> {created_by}</p>
                    <p><span className="font-medium">Time:</span> {format(new Date(start_time), "MMM d, h:mm a")} - {format(new Date(end_time), "h:mm a")}</p>
                    <p><span className="font-medium">Location:</span> {location}</p>
                </div>
            );
        }

        if ("new_client_assignment" in notification.data) {
            const { client_first_name, client_last_name, client_location } = notification.data.new_client_assignment;
            return (
                <div className="text-sm text-gray-600 mt-1 space-y-1">
                    <p><span className="font-medium">Client:</span> {client_first_name} {client_last_name}</p>
                    <p><span className="font-medium">Location:</span> {client_location}</p>
                </div>
            );
        }

        if ("client_contract_reminder" in notification.data) {
            const { client_first_name, client_last_name, contract_end, care_type } = notification.data.client_contract_reminder;
            return (
                <div className="text-sm text-gray-600 mt-1 space-y-1">
                    <p><span className="font-medium">Client:</span> {client_first_name} {client_last_name}</p>
                    <p><span className="font-medium">Care Type:</span> {care_type}</p>
                    <p><span className="font-medium">Ends:</span> {format(new Date(contract_end), "MMM d, yyyy")}</p>
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
                <div className="text-sm text-gray-600 mt-1 space-y-1">
                    <p><span className="font-medium">Reported by:</span> {employee_first_name} {employee_last_name}</p>
                    <p><span className="font-medium">Client:</span> {client_first_name} {client_last_name}</p>
                    <p>
                        <span className="font-medium">Severity:</span>
                        <Badge variant={severity_of_incident === "high" ? "destructive" : "default"} className="ml-2">
                            {severity_of_incident}
                        </Badge>
                    </p>
                    <p><span className="font-medium">Location:</span> {location_name}</p>
                </div>
            );
        }

        if ("new_schedule_notification" in notification.data) {
            const { start_time, end_time, location } = notification.data.new_schedule_notification;
            return (
                <div className="text-sm text-gray-600 mt-1 space-y-1">
                    <p><span className="font-medium">Time:</span> {format(new Date(start_time), "MMM d, h:mm a")} - {format(new Date(end_time), "h:mm a")}</p>
                    <p><span className="font-medium">Location:</span> {location}</p>
                </div>
            );
        }

        return null;
    };

    return (
        <div className={cn("p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors", notification.is_read && "bg-gray-50")} onClick={onClick}>
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                    <NotificationIcon type={notificationType} />
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900">{getNotificationTitle()}</h4>
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="text-gray-400 hover:text-gray-600 ml-2"
                            >
                                {expanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{getNotificationSummary()}</p>
                        {expanded && getNotificationDetails()}
                        <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-gray-500 mt-2">
                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                            </p>
                            {!notification.is_read && <Badge variant="secondary" className="ml-2">New</Badge>}
                        </div>
                    </div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 ml-2"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default NotificationItem;