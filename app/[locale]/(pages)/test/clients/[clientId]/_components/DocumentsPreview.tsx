import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, FileText, PlusCircle, CheckCircle, XCircle } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useDocument } from '@/hooks/document/use-document';
import { useLocalizedPath } from '@/hooks/common/useLocalizedPath';
import { useI18n } from '@/lib/i18n/client';
import { DocumentPreviewSkeleton } from './LoadersItems';

type Props = {
    isParentLoading: boolean;
}

const DocumentsPreview = ({ isParentLoading }: Props) => {
    const { clientId } = useParams();
    const t = useI18n();
    const { isLoading, documents } = useDocument({ autoFetch: true, clientId: parseInt(clientId as string) })
    const router = useRouter();
    const { currentLocale } = useLocalizedPath();

    // Sample document labels - replace with your actual DOCUMENT_LABELS
    const DOCUMENT_LABELS = {
        id_document: 'ID Document',
        insurance_card: 'Insurance Card',
        medical_history: 'Medical History',
        treatment_plan: 'Treatment Plan',
        consent_forms: 'Consent Forms',
        // Add more as needed
    };

    if (isParentLoading || isLoading) {
        return <DocumentPreviewSkeleton />;
    }

    const availableDocuments = Object.keys(DOCUMENT_LABELS).filter(key => 
        documents.results.some(doc => doc.label === key)
    ).length;

    if (documents.results.length === 0) {
        return (
            <Card className="w-full h-full border-2 border-dashed border-gray-200 hover:border-violet-300 transition-colors">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-violet-600" />
                    </div>
                    <CardTitle className="text-lg mb-2">{t("clients.profile.documents")}</CardTitle>
                    <CardDescription className="mb-4">
                        No documents uploaded for this client
                    </CardDescription>
                    <Button 
                        onClick={() => router.push(`/${currentLocale}/clients/${clientId}/documents`)}
                        className="bg-violet-600 hover:bg-violet-700"
                    >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        {t("clients.profile.addDocuments")}
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
                        <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-violet-600" />
                        </div>
                        <CardTitle className="text-lg">{t("clients.profile.documents")}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-violet-50 text-violet-700">
                            {availableDocuments}/{Object.keys(DOCUMENT_LABELS).length}
                        </Badge>
                        <Link href={`/${currentLocale}/clients/${clientId}/documents`}>
                            <Button variant="ghost" size="sm" className="h-8 gap-1">
                                <span className="text-xs">{t("common.viewAll")}</span>
                                <ArrowRight className="w-3 h-3" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="space-y-2 px-6 pb-4 max-h-64 overflow-y-auto">
                    {Object.entries(DOCUMENT_LABELS).slice(0, 6).map(([key, value], index) => {
                        const hasDocument = documents.results.some(doc => doc.label === key);
                        
                        return (
                            <div 
                                key={index}
                                className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                                    hasDocument 
                                        ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                                        : 'bg-red-50 border-red-200 hover:bg-red-100'
                                }`}
                                onClick={() => router.push(`/${currentLocale}/clients/${clientId}/documents`)}
                            >
                                <div className="flex items-center gap-3">
                                    {hasDocument ? (
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-red-600" />
                                    )}
                                    <span className={`text-sm font-medium ${
                                        hasDocument ? 'text-green-800' : 'text-red-800'
                                    }`}>
                                        {value}
                                    </span>
                                </div>
                                <Badge 
                                    variant="secondary" 
                                    className={
                                        hasDocument 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }
                                >
                                    {hasDocument ? 'Available' : 'Missing'}
                                </Badge>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};

export default DocumentsPreview;