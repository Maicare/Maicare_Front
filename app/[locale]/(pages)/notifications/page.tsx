"use client";

import { useNotifications } from "@/hooks/notifications/use-notifications";
import { useWsNotifications } from "./_components/use-ws-notifications";
import { useMemo, useState } from "react";
import { NotificationData } from "@/types/notification.types";
import { Bell, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import NotificationListingItem from "./_components/notification-listing-item";
import { useI18n } from "@/lib/i18n/client";


const NotificationPage = () => {
    const WS_URL = (process.env.NEXT_PUBLIC_WS_URL ?? "wss://api.maicare.online/ws").trim();
    const [activeTab, setActiveTab] = useState<("all" | "unread" | "read")>("all");
    const t = useI18n();

    const { notifications: wsNotifications, } = useWsNotifications(WS_URL);
    const { notifications: initialNotifications, markAsRead } = useNotifications({ autoFetch: true });
    const mergedNotifications = useMemo(() => {
        const map = new Map<string, NotificationData>();
        (initialNotifications ?? []).forEach(n => map.set(n.notification_id, n));
        wsNotifications.forEach(n => map.set(n.notification_id, n));
        return Array.from(map.values()).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }, [initialNotifications, wsNotifications]);
    const notifications = mergedNotifications;


    const filteredNotifications = activeTab === "all"
        ? notifications
        : activeTab === "unread"
            ? notifications.filter(n => !n.is_read)
            : notifications.filter(n => n.is_read);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const onMarkAsRead = async (id: string) => {
        try {
            await markAsRead(id);
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await Promise.all(unreadCount > 0 ? notifications.filter(n => !n.is_read).map(n => markAsRead(n.notification_id)) : []);
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Bell className="h-8 w-8" />
                    <h1 className="text-3xl font-bold">{t("notifications.title")}</h1>
                    {unreadCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                            {unreadCount} {t("notifications.unread")}
                        </Badge>
                    )}
                </div>

                {unreadCount > 0 && (
                    <Button onClick={markAllAsRead} variant="outline">
                        <Check className="h-4 w-4 mr-2" />
                        {t("notifications.markAllRead")}
                    </Button>
                )}
            </div>

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ("all" | "unread" | "read"))} className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="all">{t("notifications.all")}</TabsTrigger>
                    <TabsTrigger value="unread">{t("notifications.unread")}</TabsTrigger>
                    <TabsTrigger value="read">{t("notifications.read")}</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4 mt-6">
                    {filteredNotifications.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                                <CardTitle className="mb-2">{t("notifications.empty")}</CardTitle>
                                <CardDescription>
                                    {activeTab === "unread"
                                        ? t("notifications.no_unread_notifications")
                                        : t("notifications.no_notifications_yet")}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredNotifications.map(notification => (
                            <NotificationListingItem
                                key={notification.notification_id}
                                notification={notification}
                                onMarkAsRead={onMarkAsRead}
                            />
                        ))
                    )}
                </TabsContent>
            </Tabs>
        </div>

    )
}

export default NotificationPage