import React, { FunctionComponent, useEffect, useState } from "react";
import Link from "next/link";
import { shortDateTimeFormat } from "@/utils/timeFormatting";
import { Any } from "@/common/types/types";

const NotificationTypes = [
  "calendar",
  "client",
  "invoice",
  "payment",
  "task",
  "user",
  "workorder",
  "medication_time",
  "other",
] as const;

type NotificationType = (typeof NotificationTypes)[number];

export type NotificationItem = {
  metadata: Any;
  content: string;
  title: string;
  event: NotificationType;
  is_read: boolean;
  id: number;
  created: string;
};

type Props = {
  notifications: NotificationItem[];
};

// Add this helper function above your Notifications component
const transformNotification = (raw: Any): NotificationItem => {
  if (raw.type === "employee_assigned") {
    return {
      id: raw.id || Math.floor(Math.random() * 100000), // Fallback: generate an ID if needed
      metadata: raw.data,
      content: `Employee ID ${raw.data.employee_id} was assigned to Client ID ${raw.data.client_id}.`,
      title: "Employee Assigned",
      event: raw.type,
      is_read: false,
      created: raw.created_at,
    };
  }

  // Default mapping for other notification types
  return {
    id: raw.id || Math.floor(Math.random() * 100000),
    metadata: raw.metadata || {},
    content: raw.content || "",
    title: raw.title || "",
    event: raw.event || raw.type,
    is_read: raw.is_read || false,
    created: raw.created_at || new Date().toISOString(),
  };
};

const Notifications: FunctionComponent<Props> = ({ notifications: initialNotifications }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    // Include the token in the query string with the "Bearer" prefix
    const wsUrl = token
      ? `wss://maicare-back.onrender.com/ws?access_token=${encodeURIComponent(`${token}`)}`
      : "wss://maicare-back.onrender.com/ws";
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected");
      console.log("TOKEN", token);
    };

    ws.onmessage = (event) => {
      try {
        const raw = JSON.parse(event.data);
        const newNotification: NotificationItem = transformNotification(raw);
        console.log("Received new notification:", newNotification);
        setNotifications((prev) => [newNotification, ...prev]);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleClear = () => {
    setNotifications([]);
  }

  return (
    <>
      <div className="flex justify-between items-center px-4 py-2">
        <h5 className="font-medium text-bodydark2">Meldingen</h5>
        <div
          onClick={handleClear}
          className="cursor-pointer flex flex-col px-3 py-1 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl border"
        >
          Clear
        </div>
      </div>

      <ul className="flex flex-col overflow-y-auto">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </ul>
    </>
  );
};

export default Notifications;

type NotificationItemProps = {
  notification: NotificationItem;
};

const NotificationItem: FunctionComponent<NotificationItemProps> = ({ notification }) => {
  return (
    <li className={notification.is_read ? "" : "font-bold"}>
      <Link
        className="flex flex-col border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
        href="#"
      >
        <p className="text-sm mb-0 text-black dark:text-white">{notification.title}</p>
        <p className="text-sm mb-2.5 max-h-20 overflow-hidden line-clamp-4 text-ellipsis">
          {notification.content}
        </p>
        <p className="text-xs">{shortDateTimeFormat(notification.created)}</p>
      </Link>
    </li>
  );
};
