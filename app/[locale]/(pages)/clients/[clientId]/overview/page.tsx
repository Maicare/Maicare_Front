"use client";
import { Id } from '@/common/types/types';
import { useClient } from '@/hooks/client/use-client';
import { Client } from '@/types/client.types';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import ProfileInformation from '../_components/ProfileInformation';
import PersonalInformation from '../_components/PersonalInformation';
import WorkInformation from '../_components/WorkInformation';
import LocationInformation from '../_components/LocationInformation';
import AddressesPreview from '../_components/AddressesPreview';
import ContactPreview from '../_components/ContactPreview';
import InvolvedEmployeesPreview from '../_components/InvolvedEmployeesPreview';
import ContractPreview from '../_components/ContractPreview';
import ReportsPreview from '../_components/ReportsPreview';
import MedicalDossierPreview from '../_components/MedicalDossierPreview';
import DocumentsPreview from '../_components/DocumentsPreview';
import withAuth, { AUTH_MODE } from '@/common/hocs/with-auth';
import withPermissions from '@/common/hocs/with-permissions';
import Routes from '@/common/routes';
import { PermissionsObjects } from '@/common/data/permission.data';
import StatusHistoryPreview from '../_components/StatusHistoryPreview';
import { useI18n } from '@/lib/i18n/client';

const Page = () => {
    const { clientId } = useParams();
    const t = useI18n();
    const { readOne } = useClient({ autoFetch: false });
    const [client, setClient] = useState<Client | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchClient = async (id: Id) => {
            setIsLoading(true);
            const data = await readOne(id);
            setClient(data);
            setIsLoading(false);
        }
        if (clientId) fetchClient(+clientId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clientId]);

    return (
        <div className='flex flex-col gap-4'>
            <div className="grid grid-cols-3 gap-4 w-full">
                <ProfileInformation
                    date_of_birth={client?.date_of_birth || t("common.notSpecified")}
                    first_name={client?.first_name || t("common.notSpecified")}
                    last_name={client?.last_name || t("common.notSpecified")}
                    gender={client?.gender || t("common.notSpecified")}
                    isParentLoading={isLoading}
                    profile_picture={client?.profile_picture || t("common.notSpecified")}
                    status={client?.status || "Onbekend"}
                />
                <PersonalInformation
                    email={client?.email || t("common.notSpecified")}
                    first_name={client?.first_name || t("common.notSpecified")}
                    last_name={client?.last_name || t("common.notSpecified")}
                    isParentLoading={isLoading}
                    birthplace={client?.birthplace || t("common.notSpecified")}
                    private_phone_number={client?.phone_number || t("common.notSpecified")}
                />
                <WorkInformation
                    source={client?.source || t("common.notSpecified")}
                    organisation={client?.organisation || t("common.notSpecified")}
                    filenumber={client?.filenumber || t("common.notSpecified")}
                    bsn={client?.bsn || t("common.notSpecified")}
                    legal_measure={client?.legal_measure || t("common.notSpecified")}
                    infix={client?.infix || t("common.notSpecified")}
                    isParentLoading={isLoading}
                />
                <LocationInformation
                    Zipcode={client?.Zipcode || t("common.notSpecified")}
                    departement={client?.departement || t("common.notSpecified")}
                    city={client?.birthplace || t("common.notSpecified")}
                    street_number={client?.street_number || t("common.notSpecified")}
                    streetname={client?.streetname || t("common.notSpecified")}
                    location={client?.location || t("common.notSpecified")}
                    isParentLoading={isLoading}
                />
                <AddressesPreview
                    isParentLoading={isLoading}
                />
                <ContactPreview
                    clientId={clientId as string}
                    isParentLoading={isLoading}
                />
                <InvolvedEmployeesPreview
                    clientId={clientId as string}
                    isParentLoading={isLoading}
                />
                <ContractPreview
                    isParentLoading={isLoading}
                />
                <ReportsPreview
                    
                    isParentLoading={isLoading}
                />
                <MedicalDossierPreview
                    isParentLoading={isLoading}
                />
                <DocumentsPreview
                    isParentLoading={isLoading}
                />
                <StatusHistoryPreview
                    clientId={clientId as string}
                    isParentLoading={isLoading}
                />
            </div>
        </div>
    )
}

export default withAuth(
    withPermissions(Page, {
        redirectUrl: Routes.Common.NotFound,
        requiredPermissions: PermissionsObjects.ViewClient, // TODO: Add correct permission
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);