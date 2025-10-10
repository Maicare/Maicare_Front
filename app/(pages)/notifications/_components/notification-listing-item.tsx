"use client";
import { format, formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Calendar, User, Clock, AlertTriangle, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ClientContractReminderNotification, NewAppointmentNotification, NewClientAssignmentNotification, NewIncidentReportNotification, NewScheduleNotification, NotificationData } from "@/types/notification.types";
// Notificatie Item Component
const NotificationListingItem = ({ 
  notification, 
  onMarkAsRead 
}: { 
  notification: NotificationData; 
  onMarkAsRead: (id: string) => void;
}) => {
  const [isRead, setIsRead] = useState(notification.is_read);
  
  const handleMarkAsRead = () => {
    if (!isRead) {
      setIsRead(true);
      onMarkAsRead(notification.notification_id);
    }
  };
  
  // Haal notificatietype op
  const getNotificationType = () => {
    if ('new_appointment' in notification.data) return 'new_appointment';
    if ('new_client_assignment' in notification.data) return 'new_client_assignment';
    if ('client_contract_reminder' in notification.data) return 'client_contract_reminder';
    if ('new_incident_report' in notification.data) return 'new_incident_report';
    if ('new_schedule_notification' in notification.data) return 'new_schedule_notification';
    return 'unknown';
  };
  
  const notificationType = getNotificationType();
  
  // Haal icoon en kleur op basis van type
  const getIconAndColor = () => {
    switch (notificationType) {
      case 'new_appointment':
        return {
          icon: <Calendar className="h-5 w-5" />,
          bgColor: 'bg-blue-100',
          iconColor: 'text-blue-600',
          borderColor: 'border-l-blue-500'
        };
      case 'new_client_assignment':
        return {
          icon: <User className="h-5 w-5" />,
          bgColor: 'bg-green-100',
          iconColor: 'text-green-600',
          borderColor: 'border-l-green-500'
        };
      case 'client_contract_reminder':
        return {
          icon: <Clock className="h-5 w-5" />,
          bgColor: 'bg-amber-100',
          iconColor: 'text-amber-600',
          borderColor: 'border-l-amber-500'
        };
      case 'new_incident_report':
        return {
          icon: <AlertTriangle className="h-5 w-5" />,
          bgColor: 'bg-red-100',
          iconColor: 'text-red-600',
          borderColor: 'border-l-red-500'
        };
      case 'new_schedule_notification':
        return {
          icon: <Calendar className="h-5 w-5" />,
          bgColor: 'bg-indigo-100',
          iconColor: 'text-indigo-600',
          borderColor: 'border-l-indigo-500'
        };
      default:
        return {
          icon: <Bell className="h-5 w-5" />,
          bgColor: 'bg-gray-100',
          iconColor: 'text-gray-600',
          borderColor: 'border-l-gray-500'
        };
    }
  };
  
  const { icon, bgColor, iconColor, borderColor } = getIconAndColor();
  
  // Render notificatie inhoud op basis van type
  const renderNotificationContent = () => {
    switch (notificationType) {
      case 'new_appointment':
        const appointment = (notification.data as NewAppointmentNotification["data"]).new_appointment;
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Nieuwe Afspraak</h3>
              {!isRead && <Badge variant="secondary">Nieuw</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">{notification.message}</p>
            <div className="text-sm space-y-1 mt-2">
              <p><span className="font-medium">Met:</span> {appointment.created_by}</p>
              <p><span className="font-medium">Tijd:</span> {format(new Date(appointment.start_time), "d MMM, HH:mm")} - {format(new Date(appointment.end_time), "HH:mm")}</p>
              <p><span className="font-medium">Locatie:</span> {appointment.location}</p>
            </div>
          </div>
        );
      
      case 'new_client_assignment':
        const client = (notification.data as NewClientAssignmentNotification["data"]).new_client_assignment;
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Nieuwe Cliënt Toewijzing</h3>
              {!isRead && <Badge variant="secondary">Nieuw</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">{notification.message}</p>
            <div className="text-sm space-y-1 mt-2">
              <p><span className="font-medium">Cliënt:</span> {client.client_first_name} {client.client_last_name}</p>
              <p><span className="font-medium">Locatie:</span> {client.client_location}</p>
            </div>
          </div>
        );
      
      case 'client_contract_reminder':
        const contract = (notification.data as ClientContractReminderNotification["data"]).client_contract_reminder;
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Contract Herinnering</h3>
              {!isRead && <Badge variant="secondary">Nieuw</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">{notification.message}</p>
            <div className="text-sm space-y-1 mt-2">
              <p><span className="font-medium">Cliënt:</span> {contract.client_first_name} {contract.client_last_name}</p>
              <p><span className="font-medium">Zorgtype:</span> {contract.care_type}</p>
              <p><span className="font-medium">Eindigt:</span> {format(new Date(contract.contract_end), "d MMM, yyyy")}</p>
            </div>
          </div>
        );
      
      case 'new_incident_report':
        const incident = (notification.data as NewIncidentReportNotification["data"]).new_incident_report;
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Incident Rapport</h3>
              {!isRead && <Badge variant="secondary">Nieuw</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">{notification.message}</p>
            <div className="text-sm space-y-1 mt-2">
              <p><span className="font-medium">Gemeld door:</span> {incident.employee_first_name} {incident.employee_last_name}</p>
              <p><span className="font-medium">Cliënt:</span> {incident.client_first_name} {incident.client_last_name}</p>
              <p>
                <span className="font-medium">Ernst:</span> 
                <Badge 
                  variant={incident.severity_of_incident === "high" ? "destructive" : "default"} 
                  className="ml-2"
                >
                  {incident.severity_of_incident === "high" ? "hoog" : incident.severity_of_incident}
                </Badge>
              </p>
              <p><span className="font-medium">Locatie:</span> {incident.location_name}</p>
            </div>
          </div>
        );
      
      case 'new_schedule_notification':
        const schedule = (notification.data as NewScheduleNotification["data"]).new_schedule_notification;
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Nieuwe Rooster</h3>
              {!isRead && <Badge variant="secondary">Nieuw</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">{notification.message}</p>
            <div className="text-sm space-y-1 mt-2">
              <p><span className="font-medium">Tijd:</span> {format(new Date(schedule.start_time), "d MMM, HH:mm")} - {format(new Date(schedule.end_time), "HH:mm")}</p>
              <p><span className="font-medium">Locatie:</span> {schedule.location}</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Notificatie</h3>
              {!isRead && <Badge variant="secondary">Nieuw</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">{notification.message}</p>
          </div>
        );
    }
  };
  
  return (
    <Card className={`${isRead ? 'opacity-80' : ''} transition-opacity ${borderColor} border-l-4`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full ${bgColor} ${iconColor}`}>
            {icon}
          </div>
          
          <div className="flex-1">
            {renderNotificationContent()}
            
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
              </p>
              
              {!isRead && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleMarkAsRead}
                  className="h-8 px-2"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Markeer als gelezen
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default NotificationListingItem;