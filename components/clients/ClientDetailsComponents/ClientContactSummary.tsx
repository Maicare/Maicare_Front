"use client";

import React, { FunctionComponent } from "react";
import DetailCell from "../../common/DetailCell";
import { Client as ClientType } from "@/types/client.types";
import Panel from "../../common/Panel/Panel";
import PencilSquare from "../../icons/PencilSquare";
import { OpClientType, OpClientTypeRecord } from "@/types/contacts.types";
import Button from "../../common/Buttons/Button";
import ClientContactModal from "../../common/Modals/ClientContactModal";
import { useModal } from "../../providers/ModalProvider";

type Props = {
    client: ClientType | null;
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


const ClientContactSummary: FunctionComponent<Props> = ({ client }) => {

    const { open } = useModal(ClientContactModal);

    if (client?.sender_id)
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
                    <DetailCell label={"Opdrachtgever"} value={OpClientTypeRecord[data.types as OpClientType]} />
                    <DetailCell label={"Naam"} value={data.name} />
                    <DetailCell label={"Adres"} value={data.address} />
                    <DetailCell label={"Postcode"} value={data.postal_code} />
                    <DetailCell label={"Plaats"} value={data.place} />
                    <DetailCell label={"Telefoonnummer"} type={"phone"} value={data.phone_number} />
                    <DetailCell label={"KvK nummer"} value={data.KVKnumber} />
                    <DetailCell label={"BTW nummer"} value={data.BTWnumber} />
                    <DetailCell label={"Cliëntnummer"} value={data.client_number} />
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
