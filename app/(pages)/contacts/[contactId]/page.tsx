"use client";
import { useParams } from 'next/navigation';
import { ContactOverview } from '../_components/contact-overview'
import { useContact } from '@/hooks/contact/use-contact';
import { useEffect, useState } from 'react';
import { Contact } from '@/schemas/contact.schema';
import { Id } from '@/common/types/types';

const Page = () => {
    const { contactId } = useParams();

    const { readOne } = useContact({ autoFetch: false });
    const [contact, setContact] = useState<Contact | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchEmployee = async (id: Id) => {
            setIsLoading(true);
            const data = await readOne(id);
            setContact(data);
            setIsLoading(false);
        }
        if (contactId) fetchEmployee(+contactId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contactId]);
    if (isLoading || !contact) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    return (
        <div className="container mx-auto py-8 px-4">
            <ContactOverview contact={contact} />
        </div>
    )
}

export default Page