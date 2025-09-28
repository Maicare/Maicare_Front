"use client";

import React, { FunctionComponent } from "react";
import { useRouter } from "next/navigation";
import DetailCell from "../../common/DetailCell";
import { useEmergencyContact } from "@/hooks/client-network/use-emergency-contact";
import Loader from "@/components/common/loader";
import { useLocalizedPath } from "@/hooks/common/useLocalizedPath";

type Props = {
    clientId: number | undefined;
};

const EmergencyContactsSummary: FunctionComponent<Props> = ({ clientId }) => {
    // const { data, isLoading } = useEmergencyContacts(clientId);
    const router = useRouter();

    const { emergencyContacts, isLoading } = useEmergencyContact({ clientId: clientId?.toString() })

    const { currentLocale } = useLocalizedPath();

    if (isLoading) return <Loader />;
    if (!emergencyContacts?.results) return <div>Geen gegevens opgehaald.</div>;
    if (emergencyContacts.results.length === 0) return <div>Geen noodcontacten gevonden</div>;
    return (
        <ul className="flex flex-col gap-2">
            {emergencyContacts.results.map((contact) => {
                return (
                    <li
                        key={contact.id}
                        onClick={() => router.push(`/${currentLocale}/clients/${clientId}/emergency/${contact.id}`)}
                        className="grid grid-cols-2 hover:bg-gray-3 dark:hover:bg-slate-700 p-4 cursor-pointer rounded-xl"
                    >
                        <DetailCell
                            ignoreIfEmpty={true}
                            label={contact.first_name + " " + contact.last_name}
                            value={contact.relationship}
                        />
                        <DetailCell
                            label={
                                <a href={"mailto:" + contact.email} className="block">
                                    <span className="text-primary">{contact.email}</span>
                                </a>
                            }
                            value={
                                <a href={"tel:" + contact.phone_number} className="block">
                                    <span className="text-primary">{contact.phone_number}</span>
                                </a>
                            }
                        />
                    </li>
                );
            })}
        </ul>
    );
};

export default EmergencyContactsSummary;
