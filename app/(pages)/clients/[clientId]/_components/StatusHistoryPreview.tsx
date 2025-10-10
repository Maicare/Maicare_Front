"use client";
import { Clock, ArrowRight } from 'lucide-react';
import Button from '@/components/common/Buttons/Button';
import Image from 'next/image';
import Link from 'next/link';
import StatusHistoryLoader from './StatusHistoryLoader';
import { useClient } from '@/hooks/client/use-client';
import { useEffect, useState } from 'react';
import { ClientStatusHistoryItem } from '@/types/client.types';


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
            <div className="w-full h-[287px] rounded-sm shadow-md p-4 bg-white">
                <div className="flex justify-between items-center">
                    <h1 className="flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600">
                        <Clock size={18} className="text-indigo-400" /> Status geschiedenis
                    </h1>
                </div>
                <div className="mt-4 w-full h-max border-slate-200 pl-6 p-2 flex flex-col items-center justify-center gap-4">
                    <Image
                        height={200}
                        width={200}
                        src="/images/no-data.webp"
                        alt="Geen gegevens gevonden!"
                    />
                </div>
            </div>
        );
    }
    if (statusHistory.length === 0) {
        return null;
    }

    return (
        <div className="w-full h-[287px] rounded-sm shadow-md p-4 bg-white overflow-y-scroll">
            <div className="flex justify-between items-center">
                <h1 className="flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600">
                    <Clock size={18} className="text-indigo-400" /> Status geschiedenis
                </h1>
                <Link href={`/clients/${clientId}/status-history`}>
                    <Button className="bg-indigo-400 text-white text-xs py-1 px-2 rounded-md flex items-center gap-2">
                        <span>Alles bekijken</span>
                        <ArrowRight size={15} className="arrow-animation" />
                    </Button>
                </Link>
            </div>
            <div className="mt-4 w-full p-2 flex flex-col gap-4">
                {statusHistory?.map((historyItem, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-md border border-slate-200"
                    >
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-700">
                                {historyItem.old_status} → {historyItem.new_status}
                            </span>
                            <span className="text-xs text-slate-500">
                                {new Date(historyItem.changed_at).toLocaleDateString('nl-NL')}
                            </span>
                            {historyItem.reason && (
                                <span className="text-xs text-slate-500 mt-1">
                                    Reden: {historyItem.reason}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatusHistoryPreview;