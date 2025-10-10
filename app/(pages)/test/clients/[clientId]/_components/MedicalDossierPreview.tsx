import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, HeartPulse } from 'lucide-react';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDiagnosis } from '@/hooks/diagnosis/use-diagnosis';
import Link from 'next/link';
import { formatDateToDutch } from '@/utils/timeFormatting';
import { MedicalDossierPreviewSkeleton } from './LoadersItems';

type Props = {
    isParentLoading: boolean;
}

const MedicalDossierPreview = ({ isParentLoading }: Props) => {
    const { clientId } = useParams();
    const { diagnosis } = useDiagnosis({ autoFetch: true, clientId: parseInt(clientId as string) });
    const router = useRouter();

    if (isParentLoading) {
        return <MedicalDossierPreviewSkeleton />;
    }

    return (
        <Card className="w-full h-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <HeartPulse className="w-4 h-4 text-red-600" />
                        </div>
                        <CardTitle className="text-lg">Medisch Dossier</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-red-50 text-red-700">
                            {diagnosis?.results.length || 0}
                        </Badge>
                        <Link href={`/clients/${clientId}/medical-record`}>
                            <Button variant="ghost" size="sm" className="h-8 gap-1">
                                <span className="text-xs">Alles bekijken</span>
                                <ArrowRight className="w-3 h-3" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="space-y-3 px-6 pb-4 max-h-64 overflow-y-auto">
                    {diagnosis?.results.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <HeartPulse className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <CardDescription>
                                Geen medisch dossier gevonden
                            </CardDescription>
                        </div>
                    ) : (
                        diagnosis?.results.slice(0, 4).map(({ title, diagnosis_code, created_at, description }, index) => (
                            <div 
                                key={index} 
                                className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                                onClick={() => router.push(`/clients/${clientId}/medical-record`)}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                        {title}
                                    </Badge>
                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                        {diagnosis_code}
                                    </Badge>
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                        {formatDateToDutch(created_at!, true)}
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-700 line-clamp-2">
                                    {description}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default MedicalDossierPreview;