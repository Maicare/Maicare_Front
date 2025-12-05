import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { Clock, User } from "lucide-react";
import { useAuditLog, AuditRecord } from "@/hooks/audit/use-audit-log";

interface AuditLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId?: string;
}

const actionColors: Record<string, string> = {
  INSERT: "bg-green-500",
  UPDATE: "bg-blue-500",
  DELETE: "bg-red-500",
  CREATE: "bg-green-500",
  MODIFY: "bg-blue-500",
  REMOVE: "bg-red-500",
};

const actionLabels: Record<string, string> = {
  INSERT: "Toegevoegd",
  UPDATE: "Gewijzigd",
  DELETE: "Verwijderd",
  CREATE: "Aangemaakt",
  MODIFY: "Gewijzigd",
  REMOVE: "Verwijderd",
};

export function AuditLogDialog({ open, onOpenChange, clientId }: AuditLogDialogProps) {
  const { logs, isLoading, error } = useAuditLog({
    autoFetch: open && !!clientId,
    subjectId: clientId,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Wijzigingshistorie
          </DialogTitle>
          <DialogDescription>
            Overzicht van alle wijzigingen aan dit cliëntdossier
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              Laden...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              Fout bij het laden van audit logs
            </div>
          ) : !logs || logs.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              Geen wijzigingen gevonden
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log: AuditRecord) => {
                const actionKey = log.Action.toUpperCase();
                return (
                  <div key={log.EventID} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={actionColors[actionKey] || "bg-gray-500"}>
                          {actionLabels[actionKey] || log.Action}
                        </Badge>
                        {log.ActorID && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <User className="w-3 h-3" />
                            {log.ActorID}
                          </div>
                        )}
                        {log.Result && (
                          <Badge variant="outline" className="text-xs">
                            {log.Result}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(log.OccuredAt, "d MMMM yyyy 'om' HH:mm", { locale: nl })}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      {log.SubjectType && (
                        <div>
                          <span className="font-medium">Type:</span> {log.SubjectType}
                        </div>
                      )}
                      {log.AccessReason && (
                        <div>
                          <span className="font-medium">Reden:</span> {log.AccessReason.replace(/_/g, ' ')}
                        </div>
                      )}
                      {log.EventType && (
                        <div>
                          <span className="font-medium">Event:</span> {log.EventType}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
