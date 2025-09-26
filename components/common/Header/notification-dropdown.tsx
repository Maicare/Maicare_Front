import { useState, useEffect, useRef, useMemo } from "react";
import { Bell} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/hooks/notifications/use-notifications";
import { NotificationData } from "@/types/notification.types";
import { useRouter } from "next/navigation";
import { useWsNotifications } from "@/app/[locale]/(pages)/notifications/_components/use-ws-notifications";
import NotificationItem from "@/app/[locale]/(pages)/notifications/_components/notification-item";




/** ====== Your dropdown (hook integrated) ====== */
const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  // Prefer an env var so you can swap staging/prod easily
  const WS_URL = (process.env.NEXT_PUBLIC_WS_URL ?? "wss://api.maicare.online/ws").trim();
  const { notifications:wsNotifications, clear } = useWsNotifications(WS_URL);
  const { notifications: initialNotifications,markAsRead } = useNotifications({ autoFetch: true });

  // Merge initial fetch with WS updates
  const mergedNotifications = useMemo(() => {
    const map = new Map<string, NotificationData>();
    (initialNotifications ?? []).forEach(n => map.set(n.notification_id, n));
    wsNotifications.forEach(n => map.set(n.notification_id, n));
    return Array.from(map.values()).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [initialNotifications, wsNotifications]);

  // Close dropdown on outside click
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const notifications = mergedNotifications;

  return (
    <div className="relative h-8 w-8 bg-white rounded-full flex items-center justify-center">
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {notifications.filter(n=>!n.is_read).length}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-8 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50" ref={dropdownRef}>
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clear}>
                Clear all
              </Button>
            )}
          </div>

          <ScrollArea className="h-80">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : (
              notifications.map((n, idx) => (
                <NotificationItem
                  key={idx}
                  notification={n}
                  onClose={() => {
                    // remove single
                    // (simple inline remove without extra state)
                    notifications.splice(idx, 1);
                  }}
                  onClick={async() => {
                    try {
                      if (n.is_read) return;
                      await markAsRead(n.notification_id);
                      n.is_read = true; // optimistically mark as read
                    } catch (error) {
                      console.error("Error marking notification as read:", error);
                    }
                  }}
                />
              ))
            )}
          </ScrollArea>

          <div className="p-2 border-t border-gray-200 text-center">
            <Button variant="ghost" size="sm" onClick={() => {
              // Navigate to full notifications page
              router.push("/notifications");
              setIsOpen(false);
            }}>
              View all notifications
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
