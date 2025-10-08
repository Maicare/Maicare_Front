import CopyTooltip from '@/common/components/CopyTooltip'
import PrimaryButton from '@/common/components/PrimaryButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AddressType } from '@/types/client.types';
import { Edit, MapPinned, Plus } from 'lucide-react'
import Image from 'next/image';
import React from 'react'
import { useParams, useRouter } from 'next/navigation';
import { useClient } from '@/hooks/client/use-client';
import { useLocalizedPath } from '@/hooks/common/useLocalizedPath';
import { useI18n } from '@/lib/i18n/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AddressesLoaderSkeleton } from './LoadersItems';

type Props = {
  isParentLoading: boolean;
}

const AddressesPreview = ({ isParentLoading }: Props) => {
  const { clientId } = useParams();
  const t = useI18n();
  const { readClientAddresses } = useClient({});
  const [addressesData, setAddressesData] = React.useState<AddressType[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();
  const { currentLocale } = useLocalizedPath();
  
  React.useEffect(() => {
    const fetchAddresses = async () => {
      setIsLoading(true);
      const numericClientId = Number(Array.isArray(clientId) ? clientId[0] : clientId);
      const response = await readClientAddresses(numericClientId);
      const data = response;
      setAddressesData(data.addresses);
      setIsLoading(false);
    }
    if (clientId) fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  if (isParentLoading || isLoading) {
    return <AddressesLoaderSkeleton />
  }

  if (addressesData?.length === 0) {
    return (
      <Card className="w-full h-full border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors">
        <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <MapPinned className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-lg mb-2">{t("clients.create.addressDetails")}</CardTitle>
          <CardDescription className="mb-4">
            No addresses found for this client
          </CardDescription>
          <Button 
            onClick={() => router.push(`/${currentLocale}/clients/${clientId}/update`)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("clients.profile.addAddress")}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPinned className="w-4 h-4 text-blue-600" />
            </div>
            <CardTitle className="text-lg">{t("clients.create.addressDetails")}</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
            {addressesData.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="w-full">
          {addressesData.map(({ address, belongs_to, city, phone_number, zip_code }, index) => (
            <AccordionItem value={`item-${index + 1}`} key={index} className="border-b last:border-b-0 px-6">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-semibold text-gray-900">{address}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t("clients.create.belongsTo")}</p>
                    <CopyTooltip text={belongs_to || t("common.notSpecified")}>
                      <p className="text-sm text-gray-900 font-medium">{belongs_to || t("common.notSpecified")}</p>
                    </CopyTooltip>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t("clients.profile.city")}</p>
                    <CopyTooltip text={city || t("common.notSpecified")}>
                      <p className="text-sm text-gray-900 font-medium">{city || t("common.notSpecified")}</p>
                    </CopyTooltip>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t("clients.create.phoneNumber")}</p>
                    <CopyTooltip text={phone_number || t("common.notSpecified")}>
                      <p className="text-sm text-gray-900 font-medium">{phone_number || t("common.notSpecified")}</p>
                    </CopyTooltip>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t("clients.profile.postalCode")}</p>
                    <CopyTooltip text={zip_code || t("common.notSpecified")}>
                      <p className="text-sm text-gray-900 font-medium">{zip_code || t("common.notSpecified")}</p>
                    </CopyTooltip>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

export default AddressesPreview