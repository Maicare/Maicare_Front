import { ArrowRight, Receipt } from 'lucide-react'
import React from 'react'
import { useContract } from '@/hooks/contract/use-contract'
import { formatDateToDutch } from '@/utils/timeFormatting'
import { useParams, useRouter } from 'next/navigation'
import { useLocalizedPath } from '@/hooks/common/useLocalizedPath'
import { useI18n } from '@/lib/i18n/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ContractPreviewSkeleton } from './LoadersItems'
import ContractItem from './ContractItem'

type Props = {
    isParentLoading: boolean;
}

const ContractPreview = ({ isParentLoading }: Props) => {
    const {clientId} = useParams();
    const t = useI18n();
    const { contracts } = useContract({autoFetch:true,clientId:clientId as string});
    const router = useRouter();
    const { currentLocale } = useLocalizedPath();

    if (isParentLoading) {
        return <ContractPreviewSkeleton />
    }
    
    return (
        <Card className="w-full h-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Receipt className="w-4 h-4 text-green-600" />
                        </div>
                        <CardTitle className="text-lg">{t("clients.profile.contracts")}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-green-50 text-green-700">
                            {contracts?.results.length || 0}
                        </Badge>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 gap-1"
                            onClick={() => router.push(`/${currentLocale}/clients/${clientId}/contract`)}
                        >
                            <span className="text-xs">{t("common.viewAll")}</span>
                            <ArrowRight className="w-3 h-3" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="space-y-3 px-6 pb-4">
                    {contracts?.results.slice(0, 3).map((c) => (
                        <ContractItem 
                            key={c.id} 
                            occupation={c.care_name} 
                            price={c.price.toString()} 
                            date={formatDateToDutch(c.start_date,true)} 
                        />
                    ))}
                    {(!contracts || contracts.results.length === 0) && (
                        <div className="text-center py-8 text-gray-500">
                            <Receipt className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p>No contracts found</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default ContractPreview