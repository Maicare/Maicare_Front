"use client";

import React, { FunctionComponent } from "react";
import { useParams } from "next/navigation";
import PageTabs from "../common/PageTabs/PageTabs";

const ClientNetworkTabs: FunctionComponent = () => {
    const { clientId } = useParams();
    return (
        <PageTabs
            backHref={`/clients/${clientId}`}
            tabs={[
                {
                    label: "Noodcontacten",
                    href: `/clients/${clientId}/client-network/emergency`,
                },
                {
                    label: "Betrokken medewerkers",
                    href: `/clients/${clientId}/client-network/involved-employees`,
                },
            ]}
            title={`Cliëntennetwerk`}
        />
    );
};

export default ClientNetworkTabs;
