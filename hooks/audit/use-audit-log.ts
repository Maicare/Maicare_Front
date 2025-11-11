import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { Any } from "@/common/types/types";
import { InvoiceAuditLog } from "@/types/invoice-log";
import { constructUrlSearchParams } from "@/utils/construct-search-params";
import { stringConstructor } from "@/utils/string-constructor";
import { useState } from "react";
import useSWR from "swr";

export interface AuditRecord {
  EventID: string;
  EventType: string;
  OccuredAt: Date;
  ActorRole: string[];
  ActorID: string;
  SubjectType: string;
  SubjectID: string;
  Action: string;
  Result: string;
  AccessReason: string;
  Ip?: string;
  SelfHash: string;
  PreviousHash: string;
}
export function useAuditLog({ autoFetch = false, actorId, subjectId, endTime, startTime }: { autoFetch?: boolean, actorId?: string, subjectId?: string ,startTime?: string, endTime?: string}) {
    const [page,setPage] = useState(1)
    const {
        data: logs,
        error,
    } = useSWR<AuditRecord[] | null>(
        autoFetch ? stringConstructor(
      ApiRoutes.AuditLogs.ReadAll,
      constructUrlSearchParams({page, actorId, subjectId, endTime, startTime,  page_size: 10 })
    ) : null, // Endpoint to fetch Locations
        async (url) => {
            if (!url) {
                return null;
            }
            const response = await api.get(url);
            if (!response.data.data) {
                return null;
            }
            return response.data.data.map((item: Any) => ({
                ...item,
                OccuredAt: new Date(item.occured_at),
                EventID: item.event_id,
                EventType: item.event_type,
                ActorRole: item.actor_role,
                ActorID: item.actor_id,
                SubjectType: item.subject_type,
                SubjectID: item.subject_id,
                Action: item.action,
                Result: item.result,
                AccessReason: item.access_reason,
                Ip: item.ip,
                SelfHash: item.self_hash,
                PreviousHash: item.previous_hash,
            })); // Assuming API returns data inside a "data" field
        },
        { shouldRetryOnError: false }
    );

    const isLoading = !logs && !error;


    return {
        logs,
        error,
        isLoading,
        page,
        setPage
      };
}