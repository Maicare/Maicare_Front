import { FunctionComponent, useEffect, useState } from "react";
import Panel from "../common/Panel/Panel";
import Link from "next/link";
import IconButton from "../common/Buttons/IconButton";
import PencilSquare from "../icons/PencilSquare";
import DownloadIcon from "../icons/DownloadIcon";
import CheckIcon from "../icons/CheckIcon";
import TrashIcon from "../icons/TrashIcon";
import { useClient } from "@/hooks/client/use-client";
import { Client as ClientType } from "@/types/client.types";
import LinkButton from "../common/Buttons/LinkButton";
import { DOCUMENT_LABEL_OPTIONS, DOCUMENT_LABELS } from "@/consts";
import ClientInformation from "./ClientDetailsComponents/ClientInformation";
import ClientLocationDetails from "./ClientDetailsComponents/ClientLocationDetails";
import EmergencyContactsSummary from "./ClientDetailsComponents/EmergencyContactsSummary";
import InvolvedEmployeesSummary from "./ClientDetailsComponents/InvolvedEmployeesSummary";
import ClientContactSummary from "./ClientDetailsComponents/ClientContactSummary";
import ClientContractsSummary from "./ClientDetailsComponents/ClientContractsSummary";
import ClientDocumentsSummary from "./ClientDetailsComponents/ClientDocumentsSummary";
import UpdateClientStatus from "./ClientDetailsComponents/UpdateClientStatus";
import ClientStatusHistory from "./ClientDetailsComponents/ClientStatusHistory";
import ClientDeparture from "./ClientDetailsComponents/ClientDeparture";
import ClientIdentityDetails from "./ClientDetailsComponents/ClientIdentityDetails";
import ClientAddressDetails from "./ClientDetailsComponents/ClientAddressDetails";
import ClientMedicalRecordSummary from "./ClientDetailsComponents/ClientMedicalRecordSummary";
import ClientReportsSummary from "./ClientDetailsComponents/ClientReportsSummary";

type PropsType = {
    clientId?: number;
}

const ClientDetails: FunctionComponent<PropsType> = ({ clientId }) => {

    const { readOne } = useClient({});
    const [clientData, setClientData] = useState<ClientType | null>(null);

    const TOTAL_REQUIRED_DOCUMENTS = Object.keys(DOCUMENT_LABELS).length - 1;
    // let ALREADY_UPLOADED_DOCUMENTS = [];

    const JUST_DOCUMENT_LABEL_OPTIONS = DOCUMENT_LABEL_OPTIONS.filter(
        (option) => option.value !== ""
    );
    const NOT_UPLOADED_DOCUMENTS = JUST_DOCUMENT_LABEL_OPTIONS.filter(
        (option) => option.value != "other"
    );

    useEffect(() => {
        const fetchClient = async (id: number) => {
            const data = await readOne(id);
            setClientData(data);
        }
        if (clientId) fetchClient(clientId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clientId]);

    return (
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
            <div className="flex flex-col gap-9">
                <Panel
                    title={"Cliëntinformatie"}
                    containerClassName="px-7 py-4"
                    sideActions={
                        <div className="flex gap-4">
                            <Link href={`/clients/${clientId}/edit`}>
                                <IconButton>
                                    <PencilSquare className="w-5 h-5" />
                                </IconButton>
                            </Link>
                            <IconButton>
                                <DownloadIcon className="w-5 h-5" />
                            </IconButton>
                            {/* <QuestionnaireDownloadButton type="client_details" questId={+clientId} /> */}
                            <IconButton
                                buttonType="Danger"
                                onClick={() => { }}
                                disabled={false}
                                isLoading={false}
                            >
                                {false ? (
                                    <CheckIcon className="w-5 h-5" />
                                ) : (
                                    <TrashIcon className="w-5 h-5" />
                                )}
                            </IconButton>
                        </div>
                    }
                >
                    <ClientInformation client={clientData} />
                </Panel>

                <Panel title={"Locatiegegevens"} containerClassName="px-7 py-4">
                    <ClientLocationDetails client={clientData} />
                </Panel>

                <Panel
                    title={"Noodcontacten"}
                    containerClassName="px-7 py-4"
                    sideActions={
                        <LinkButton
                            text={"Volledige Contactenlijst"}
                            href={`/clients/${clientId}/emergency`}
                        />
                    }
                >
                    <EmergencyContactsSummary clientId={clientData?.id} />
                </Panel>

                <Panel
                    title={"Betrokken medewerkers"}
                    containerClassName="px-7 py-4"
                    sideActions={
                        <div className="flex gap-4">
                            <LinkButton
                                href={`/clients/${clientId}/client-network/involved-employees`}
                                text={"Volledige medewerkerslijst"}
                            />
                        </div>
                    }
                >
                    <InvolvedEmployeesSummary />
                </Panel>

                <ClientContactSummary client={clientData} />

                <Panel
                    title={"Contracten"}
                    containerClassName="px-7 py-4"
                    sideActions={
                        <LinkButton text={"Bekijk Cliëntcontracten"} href={`${clientId}/contracts`} />
                    }
                >
                    <ClientContractsSummary />
                </Panel>

                <Panel
                    title={`Documenten (0/${TOTAL_REQUIRED_DOCUMENTS})`}
                    containerClassName="px-7 py-4"
                    sideActions={
                        <LinkButton
                            text={
                                NOT_UPLOADED_DOCUMENTS.length
                                    ? `Moet ${NOT_UPLOADED_DOCUMENTS.length} extra documenten toevoegen`
                                    : "Volledige Documenten"
                            }
                            href={`${clientId}/document`}
                            className={NOT_UPLOADED_DOCUMENTS.length ? "bg-red-600" : ""}
                        />
                    }
                >
                    {NOT_UPLOADED_DOCUMENTS.length > 0 && (
                        <div className="p-5 bg-c_red text-white font-bold rounded-lg mb-5">
                            Zorg ervoor dat u de rest van de documenttypen uploadt:
                            <ul>
                                {NOT_UPLOADED_DOCUMENTS.map((doc, index) => (
                                    <li key={index}>- {doc.label}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <ClientDocumentsSummary />
                </Panel>
            </div>

            <div className="flex flex-col gap-9">
                <Panel title={"Cliëntstatus"} containerClassName="py-4">
                    <div className="px-4 mt-7">
                        <UpdateClientStatus client={clientData} />
                    </div>
                    <ClientStatusHistory />
                </Panel>

                <ClientDeparture client={clientData} />

                <Panel title={"Identiteitsgegevens"} containerClassName="px-7 py-4">
                    <ClientIdentityDetails client={clientData} />
                </Panel>

                <Panel title={"Adresgegevens"} containerClassName="px-7 py-4">
                    <ClientAddressDetails client={clientData} />
                </Panel>

                <Panel
                    title={"Medisch Dossier"}
                    containerClassName="px-7 py-4"
                    sideActions={
                        <LinkButton text={"Volledig Medisch Dossier"} href={`${clientId}/medical-record`} />
                    }
                >
                    <ClientMedicalRecordSummary />
                </Panel>

                <Panel
                    title={"Rapporten"}
                    containerClassName="px-7 py-4"
                    sideActions={
                        <LinkButton
                            text={"Volledige Rapporten"}
                            href={`${clientId}/reports-record/reports`}
                        />
                    }
                >
                    <ClientReportsSummary />
                </Panel>
            </div>
        </div>
    );
}

export default ClientDetails;