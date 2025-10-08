import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, PlusCircle, Users } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';
import InvolvedEmployeeItem from './InvolvedEmployeeItem';
import { useInvolvedEmployee } from '@/hooks/client-network/use-involved-employee';
import Image from 'next/image';
import Link from 'next/link';
import { useLocalizedPath } from '@/hooks/common/useLocalizedPath';
import { useI18n } from '@/lib/i18n/client';
import { ContactPreviewLoader } from './LoadersItems';

type Props = {
    clientId: string;
    isParentLoading: boolean;
}

const InvolvedEmployeesPreview = ({ clientId, isParentLoading }: Props) => {
    const router = useRouter();
    const t = useI18n();
    const { involvedEmployees, isLoading } = useInvolvedEmployee({ clientId: clientId })
    const { currentLocale } = useLocalizedPath();

    if (isLoading || isParentLoading) {
        return <ContactPreviewLoader />;
    }

    if (involvedEmployees?.results.length === 0) {
        return (
            <Card className="w-full h-full border-2 border-dashed border-gray-200 hover:border-indigo-300 transition-colors">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-indigo-600" />
                    </div>
                    <CardTitle className="text-lg mb-2">{t("clients.profile.involvedEmployees")}</CardTitle>
                    <CardDescription className="mb-4">
                        No involved employees assigned to this client
                    </CardDescription>
                    <Button 
                        onClick={() => router.push(`/${currentLocale}/clients/${clientId}/client-network/involved-employees`)}
                        className="bg-indigo-600 hover:bg-indigo-700"
                    >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        {t("clients.profile.addEmployee")}
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
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <Users className="w-4 h-4 text-indigo-600" />
                        </div>
                        <CardTitle className="text-lg">{t("clients.profile.involvedEmployees")}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">
                            {involvedEmployees?.results.length}
                        </Badge>
                        <Link href={`/${currentLocale}/clients/${clientId}/client-network/involved-employees`}>
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
                    {involvedEmployees?.results.slice(0, 3).map(({ start_date, employee_name, role }, index) => (
                        <InvolvedEmployeeItem
                            key={index}
                            start_date={start_date}
                            fullName={employee_name || ""}
                            relation={role}
                            image='/images/avatar-1.jpg'
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default InvolvedEmployeesPreview;