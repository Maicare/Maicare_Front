"use client";
import { Any } from "@/common/types/types";
import { BaseNotification, NotificationData } from "@/types/notification.types";
import { useEffect, useRef, useState, useMemo } from "react";
type AuthMode = "protocol" | "access_token_query" | "token_query";

function buildUrl(base: string, token: string | null, mode: AuthMode) {
  if (!token) return base;
  const glue = base.includes("?") ? "&" : "?";
  if (mode === "access_token_query") return `${base}${glue}access_token=${encodeURIComponent(token)}`;
  if (mode === "token_query") return `${base}${glue}token=${encodeURIComponent(token)}`;
  return base; // protocol mode puts token in subprotocols, not the URL
}
function transformNotification(raw: Any): NotificationData | null {
  try {
    // Normalize container
    const created = raw?.created_at ?? new Date().toISOString();
    const container: BaseNotification = {
      type: "notification",
      created_at: created,
      is_read: raw?.is_read ?? false,
      message: raw?.message ?? "",
      notification_id: raw?.notification_id ?? raw?.id ?? "",
      data: raw?.data ?? raw?.payload ?? raw,
    };

    // If server sends {event:"new_appointment", ...}
    if (raw?.event && !container.data?.[raw.event]) {
      container.data = { [raw.event]: raw?.data ?? raw };
    }

    // Ensure exactly one known key inside data
    const key = container?.data ? Object.keys(container.data)[0] : undefined;
    if (!key) return null;

    // Return as-is; your UI branches on keys like new_appointment, etc.
    return container as NotificationData;
  } catch {
    return null;
  }
}
function buildProtocols(token: string | null, mode: AuthMode): string[] | undefined {
  if (mode !== "protocol" || !token) return undefined;
  // MAny servers accept either `authorization` or `Bearer <token>` as a subprotocol.
  // We offer both; server picks one via Sec-WebSocket-Protocol.
  return ["authorization", `Bearer ${token}`];
}
export function useWsNotifications(baseUrl: string) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const hbRef = useRef<NodeJS.Timeout | null>(null);
  const retryRef = useRef<NodeJS.Timeout | null>(null);
  const attemptRef = useRef(0);
  const triedModesRef = useRef<Set<AuthMode>>(new Set());

  const token = useMemo(() => {
    try { return localStorage.getItem("accessToken"); } catch { return null; }
  }, []);

  const modes: AuthMode[] = ["protocol", "access_token_query", "token_query"];

  useEffect(() => {
    let closedManually = false;
    const connect = (preferredMode?: AuthMode) => {
      if (closedManually) return;

      const mode: AuthMode =
        preferredMode ??
        modes.find(m => !triedModesRef.current.has(m)) ??
        "access_token_query"; // default rotate

      const url = buildUrl(baseUrl, token, mode);
      const protocols = buildProtocols(token, mode);
      const ws = new WebSocket(url, protocols);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log("[WS] open via", mode);
        triedModesRef.current.add(mode);
        attemptRef.current = 0;

        // If server expects an auth message after open:
        if (token) {
          ws.send(JSON.stringify({ type: "auth", authorization: `Bearer ${token}` }));
        }

        // Heartbeat ping every 25s
        if (hbRef.current) clearInterval(hbRef.current);
        hbRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            console.log("[WS] ping");
            ws.send(JSON.stringify({ type: "ping", ts: Date.now() }));
          }else{
            console.log("[WS] not open");
          }
        }, 25000);
      };

      ws.onmessage = (event) => {
        // Ignore pings/keepalive frames that aren’t JSON
        let msg: Any;
        try { msg = JSON.parse(event.data); } catch { return; }

        if (msg?.type === "pong") return;

        const n = transformNotification(msg);
        if (n) {
          setNotifications((prev) => [n, ...prev]);
        } else {
          console.debug("[WS] ignored message:", msg);
        }
      };

      ws.onerror = (err) => {
        console.error("[WS] error:", err);
      };

      ws.onclose = (evt) => {
        console.warn("[WS] close:", evt.code, evt.reason || "");
        if (hbRef.current) { clearInterval(hbRef.current); hbRef.current = null; }
        socketRef.current = null;

        if (closedManually) return;

        // If we closed early (e.g., unauthorized/policy) try another auth mode once
        const unauthorized = [1008, 4401, 4403].includes(evt.code);
        if (unauthorized) {
          const nextMode = modes.find((m) => !triedModesRef.current.has(m));
          if (nextMode) {
            console.log("[WS] retry using auth mode:", nextMode);
            connect(nextMode);
            return;
          }
        }

        // Exponential backoff
        const base = 1000;
        const max = 30000;
        attemptRef.current += 1;
        const delay = Math.min(max, base * 2 ** (attemptRef.current - 1));
        if (retryRef.current) clearTimeout(retryRef.current);
        retryRef.current = setTimeout(() => connect(), delay);
      };
    };

    connect("access_token_query");

    return () => {
      closedManually = true;
      if (retryRef.current) clearTimeout(retryRef.current);
      if (hbRef.current) clearInterval(hbRef.current);
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close(1000, "component unmount");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseUrl, token]);

  return { notifications, clear: () => setNotifications([]) };
}