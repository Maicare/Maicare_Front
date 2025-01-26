"use client";

import React, { FunctionComponent } from "react";
import { useRouter } from "next/navigation";
import DetailCell from "../../common/DetailCell";

type Props = {
    clientId: number | undefined;
};

const fakeData = [
    {
        id: 1,
        first_name: "Alice",
        last_name: "Anderson",
        relationship: "Mother",
        email: "alice.anderson@example.com",
        phone_number: "555-1111",
    },
    {
        id: 2,
        first_name: "Bob",
        last_name: "Brown",
        relationship: "Brother",
        email: "bob.brown@example.com",
        phone_number: "555-2222",
    },
    {
        id: 3,
        first_name: "Charlie",
        last_name: "Clark",
        relationship: "Friend",
        email: "charlie.clark@example.com",
        phone_number: "555-3333",
    },
];

const EmergencyContactsSummary: FunctionComponent<Props> = ({ clientId }) => {
    // const { data, isLoading } = useEmergencyContacts(clientId);
    const router = useRouter();
    // if (isLoading) return <Loader />;
    // if (!data) return <div>Geen gegevens opgehaald.</div>;
    // if (data.results?.length === 0) return <div>Geen noodcontacten gevonden</div>;
    return (
        <ul className="flex flex-col gap-2">
            {fakeData.map((contact) => {
                return (
                    <li
                        key={contact.id}
                        onClick={() => router.push(`/clients/${clientId}/emergency/${contact.id}`)}
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
