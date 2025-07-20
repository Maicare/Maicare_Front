import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useInvoiceLog } from "@/hooks/invoice-log/use-invoice-log";
import {
    ClipboardList,
    User,
    Calendar,
    FileText,
    Trash2,
    RefreshCw,
    Eye,
    ChevronDown,
    ArrowRight,
    Circle,
    PlusCircle,
    Edit2,
    LogIn,
    LogOut
} from "lucide-react";

export const LogsOverview = ({ invoiceId }: { invoiceId: string }) => {
    const { logs } = useInvoiceLog({ autoFetch: true, invoiceId });
    const getOperationConfig = (operation: string) => {
        const config = {
          create: {
            icon: <PlusCircle className="h-4 w-4" />,
            color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
            label: "Created"
          },
          update: {
            icon: <Edit2 className="h-4 w-4" />,
            color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
            label: "Updated"
          },
          delete: {
            icon: <Trash2 className="h-4 w-4" />,
            color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400",
            label: "Deleted"
          },
          view: {
            icon: <Eye className="h-4 w-4" />,
            color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
            label: "Viewed"
          },
          login: {
            icon: <LogIn className="h-4 w-4" />,
            color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
            label: "Login"
          },
          logout: {
            icon: <LogOut className="h-4 w-4" />,
            color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
            label: "Logout"
          },
          status_change: {
            icon: <RefreshCw className="h-4 w-4" />,
            color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
            label: "Status Changed"
          }
        };
    
        return config[operation.toLowerCase() as keyof typeof config] || {
          icon: <Circle className="h-4 w-4" />,
          color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
          label: operation.replace('_', ' ')
        };
      };
    if (!logs) {
        return;
    }

    return (
        <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
            <CardHeader className="border-b border-gray-200 dark:border-gray-800">
                <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <ClipboardList className="h-5 w-5" />
                    </div>
                    <span>Audit Logs</span>
                    <Badge variant="outline" className="ml-auto rounded-full px-3 py-1 bg-gray-100 dark:bg-gray-800">
                        {logs.length} {logs.length === 1 ? 'entry' : 'entries'}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                        <ClipboardList className="h-10 w-10 mb-3 opacity-50" />
                        <p>No audit activity found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                        {logs.map((log) => {
                            const { icon, color, label } = getOperationConfig(log.operation);
                            const hasChanges = log.changed_fields && log.changed_fields.length > 0;

                            return (
                                <div key={log.audit_id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg ${color} mt-1`}>
                                            {icon}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium capitalize">{label}</span>
                                                {log.invoice_id && (
                                                    <Badge variant="outline" className="rounded-full px-2 py-0.5 text-xs">
                                                        <FileText className="h-3 w-3 mr-1" />
                                                        Invoice #{log.invoice_id}
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                                <User className="h-4 w-4" />
                                                <span>{log.changed_by_first_name && log.changed_by_last_name ? log.changed_by_first_name + " " + log.changed_by_last_name : "System"}</span>
                                                <Circle className="h-1 w-1 opacity-50" />
                                                <Calendar className="h-4 w-4" />
                                                <span>{new Date(log.changed_at).toLocaleString()}</span>
                                            </div>

                                            {hasChanges ? (
                                                <Collapsible>
                                                    <CollapsibleTrigger asChild className="mt-2 flex items-center gap-1 text-sm text-primary hover:underline">
                                                        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                                            <div className="flex items-center gap-2">
                                                                <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                                                                <span>View changes</span>
                                                            </div>
                                                        </button>
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent className="mt-2 space-y-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                                                        {log.changed_fields.map((field) => (
                                                            <div key={field} className="flex items-baseline gap-2 text-sm">
                                                                <span className="font-medium capitalize min-w-[120px]">{field}</span>
                                                                <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                                <div className="flex-1 grid grid-cols-2 gap-2">
                                                                    <div className="bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded text-rose-800 dark:text-rose-200 line-clamp-1">
                                                                        {JSON.stringify(log.old_values[field as keyof typeof log.old_values] || 'Empty')}
                                                                    </div>
                                                                    <div className="bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded text-emerald-800 dark:text-emerald-200 line-clamp-1">
                                                                        {JSON.stringify(log.new_values[field as keyof typeof log.new_values] || 'Empty')}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </CollapsibleContent>
                                                </Collapsible>
                                            ) : (
                                                <div className="mt-2 text-sm text-muted-foreground">
                                                    No field changes recorded
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};