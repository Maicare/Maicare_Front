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

const Page = () => {
    const { clientId } = useParams();

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
                    date_of_birth={client?.date_of_birth || "Niet Beschikbaar"}
                    first_name={client?.first_name || "Niet Beschikbaar"}
                    last_name={client?.last_name || "Niet Beschikbaar"}
                    gender={client?.gender || "Niet Beschikbaar"}
                    isParentLoading={isLoading}
                    profile_picture={client?.profile_picture || "Niet Beschikbaar"}
                    status={client?.status || "Onbekend"}
                />
                <PersonalInformation
                    email={client?.email || "Niet Beschikbaar"}
                    first_name={client?.first_name || "Niet Beschikbaar"}
                    last_name={client?.last_name || "Niet Beschikbaar"}
                    isParentLoading={isLoading}
                    birthplace={client?.birthplace || "Niet Beschikbaar"}
                    private_phone_number={client?.phone_number || "Niet Beschikbaar"}
                />
                <WorkInformation
                    source={client?.source || "Niet gespecificeerd"}
                    organisation={client?.organisation || "Niet gespecificeerd"}
                    filenumber={client?.filenumber || "Niet gespecificeerd"}
                    bsn={client?.bsn || "Niet gespecificeerd"}
                    legal_measure={client?.legal_measure || "Niet gespecificeerd"}
                    infix={client?.infix || "Niet gespecificeerd"}
                    isParentLoading={isLoading}
                />
                <LocationInformation
                    Zipcode={client?.Zipcode || ""}
                    departement={client?.departement || ""}
                    city={client?.birthplace || ""}
                    street_number={client?.street_number || ""}
                    streetname={client?.streetname || ""}
                    location={client?.location || ""}
                    isParentLoading={isLoading}
                />
                <AddressesPreview
                    addresses={client?.addresses ?? []}
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
            </div>
        </div>
    )
}

export default Page