"use client";

import React, { FunctionComponent, useEffect, useState } from "react";
import DetailCell from "../../common/DetailCell";
import { Client as ClientType } from "@/types/client.types";
import Panel from "../../common/Panel/Panel";
import PencilSquare from "../../icons/PencilSquare";
import { OpClientType, OpClientTypeRecord } from "@/types/contacts.types";
import Button from "../../common/Buttons/Button";
import ClientContactModal from "../../common/Modals/ClientContactModal";
import { useModal } from "../../providers/ModalProvider";
import { useClient } from "@/hooks/client/use-client";
import { set } from "nprogress";
import { Any } from "@/common/types/types";
import Loader from "@/components/common/loader";

type Props = {
    client: ClientType | null;
    clientId: number | undefined;
};

const data = {
    types: "main_provider",
    name: "John Doe",
    address: "Fakestreet 123",
    postal_code: "1234 AB",
    place: "Amsterdam",
    phone_number: "+31 6 12345678",
    KVKnumber: "12345678",
    BTWnumber: "NL987654321B01",
    client_number: "C000001"
};


const ClientContactSummary: FunctionComponent<Props> = ({ client, clientId }) => {

    const { open } = useModal(ClientContactModal);
    const { readOneSender } = useClient({});

    const [sender, setSender] = useState<Any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getSender = async () => {
            if (!clientId) return
            try {
                setLoading(true);
                const response = await readOneSender(clientId);
                setSender(response);
                setLoading(false);
            } catch (error) {
                console.log(error)
                setLoading(false);
            }
        }

        getSender()
    }, [clientId])


    if (loading) return <Loader />
    if (sender && sender?.types)
        return (
            <Panel
                title={"Opdrachtgever"}
                containerClassName="px-7 py-4"
                sideActions={
                    <>
                        <Button
                            onClick={() => {
                                open({
                                    client: client?.id,
                                });
                            }}
                            className={"py-2 gap-2 flex items-center px-6"}
                        >
                            <PencilSquare className="w-5 h-5" />
                            Voeg contact toe
                        </Button>
                    </>
                }
            >
                <section className="grid grid-cols-3 gap-2">
                    <DetailCell label={"Opdrachtgever"} value={OpClientTypeRecord[sender.types as OpClientType]} />
                    <DetailCell label={"Naam"} value={sender.name} />
                    <DetailCell label={"Adres"} value={sender.address} />
                    <DetailCell label={"Postcode"} value={sender.postal_code} />
                    <DetailCell label={"Plaats"} value={sender.place} />
                    <DetailCell label={"Telefoonnummer"} type={"phone"} value={sender.phone_number} />
                    <DetailCell label={"KvK nummer"} value={sender.KVKnumber} />
                    <DetailCell label={"BTW nummer"} value={sender.btwnumber} />
                    <DetailCell label={"Cliëntnummer"} value={sender.client_number} />
                </section>
            </Panel>
        );
    return (
        <Panel title={"Opdrachtgever"} containerClassName="px-7 py-4">
            <div className="flex flex-col gap-4 items-center">
                <div>Geen contactgegevens gevonden voor huidige cliënt!</div>
                <Button
                    onClick={() => {
                        open({ client: client?.id });
                    }}
                >
                    Voeg contactgegevens toe
                </Button>
            </div>
        </Panel>
    )
};

export default ClientContactSummary;
