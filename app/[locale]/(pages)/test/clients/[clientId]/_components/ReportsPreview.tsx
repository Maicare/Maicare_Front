import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, PlusCircle, FileText } from 'lucide-react';
import React from 'react';
import ReportItem from './ReportItem';
import { useReport } from '@/hooks/report/use-report';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLocalizedPath } from '@/hooks/common/useLocalizedPath';
import { useI18n } from '@/lib/i18n/client';
import { ReportsPreviewSkeleton } from './LoadersItems';

type Props = {
    isParentLoading: boolean;
}

const ReportsPreview = ({ isParentLoading }: Props) => {
    const { clientId } = useParams();
    const router = useRouter();
    const t = useI18n();
    const { reports, isLoading } = useReport({ autoFetch: true, clientId: parseInt(clientId as string) });
    const { currentLocale } = useLocalizedPath();

    if (isParentLoading || isLoading) {
        return <ReportsPreviewSkeleton />;
    }

    if (!reports || reports.results.length === 0) {
        return (
            <Card className="w-full h-full border-2 border-dashed border-gray-200 hover:border-amber-300 transition-colors">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-amber-600" />
                    </div>
                    <CardTitle className="text-lg mb-2">{t("clients.profile.reports")}</CardTitle>
                    <CardDescription className="mb-4">
                        No reports available for this client
                    </CardDescription>
                    <Button 
                        onClick={() => router.push(`/${currentLocale}/clients/${clientId}/reports/user-reports`)}
                        className="bg-amber-600 hover:bg-amber-700"
                    >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        {t("clients.profile.addReport")}
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full h-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-amber-600" />
                        </div>
                        <CardTitle className="text-lg">{t("clients.profile.reports")}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-amber-50 text-amber-700">
                            {reports.results.length}
                        </Badge>
                        <Link href={`/${currentLocale}/clients/${clientId}/reports/user-reports`}>
                            <Button variant="ghost" size="sm" className="h-8 gap-1">
                                <span className="text-xs">{t("common.viewAll")}</span>
                                <ArrowRight className="w-3 h-3" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="space-y-3 px-6 pb-4 max-h-64 overflow-y-auto">
                    {reports.results.slice(0, 3).map(({ date, report_text, emotional_state, type, employee_profile_picture }, index) => (
                        <ReportItem
                            key={index}
                            image={employee_profile_picture ?? "/images/avatar-1.jpg"}
                            date={date}
                            report={report_text}
                            state={emotional_state}
                            type={type}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default ReportsPreview;