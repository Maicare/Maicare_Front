"use client";
import { Clock, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useClient } from '@/hooks/client/use-client';
import { useEffect, useState } from 'react';
import { ClientStatusHistoryItem } from '@/types/client.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusHistoryLoader } from './LoadersItems';

type Props = {
    clientId: string;
    isParentLoading: boolean;
};

const StatusHistoryPreview = ({ clientId, isParentLoading }: Props) => {
    const { getStatusHistory } = useClient({ autoFetch: false });
    const [isLoading, setIsLoading] = useState(false);
    const [statusHistory, setStatusHistory] = useState<ClientStatusHistoryItem[]>([]);

    useEffect(() => {
        const readStatusHistory = async (id: string) => {
            try {
                setIsLoading(true);
                const res = await getStatusHistory(id);
                setStatusHistory(res || []);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        if (clientId) {
            readStatusHistory(clientId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clientId]);

    if (isLoading || isParentLoading) {
        return <StatusHistoryLoader />;
    }

    if (statusHistory.length === 0) {
        return (
            <Card className="w-full h-full border-2 border-dashed border-gray-200 hover:border-orange-300 transition-colors">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                        <Clock className="w-8 h-8 text-orange-600" />
                    </div>
                    <CardTitle className="text-lg mb-2">Status History</CardTitle>
                    <CardDescription>
                        No status history available for this client
                    </CardDescription>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full h-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-4 h-4 text-orange-600" />
                        </div>
                        <CardTitle className="text-lg">Status History</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-orange-50 text-orange-700">
                            {statusHistory.length}
                        </Badge>
                        <Link href={`/clients/${clientId}/status-history`}>
                            <Button variant="ghost" size="sm" className="h-8 gap-1">
                                <span className="text-xs">View All</span>
                                <ArrowRight className="w-3 h-3" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="space-y-3 px-6 pb-4 max-h-64 overflow-y-auto">
                    {statusHistory?.slice(0, 5).map((historyItem, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-semibold text-gray-900">
                                        {historyItem.old_status}
                                    </span>
                                    <ArrowRight className="w-3 h-3 text-gray-400" />
                                    <span className="text-sm font-semibold text-green-600">
                                        {historyItem.new_status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span>{new Date(historyItem.changed_at).toLocaleDateString()}</span>
                                    {historyItem.reason && (
                                        <span className="truncate">Reason: {historyItem.reason}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default StatusHistoryPreview;