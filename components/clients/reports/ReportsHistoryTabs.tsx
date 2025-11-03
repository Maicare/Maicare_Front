"use client";

import React, { FunctionComponent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageTabs from "@/components/common/PageTabs/PageTabs";
import { useClient } from "@/hooks/client/use-client";
import { Client } from "@/types/client.types";
import { Id } from "@/common/types/types";

const ReportsHistoryTabs: FunctionComponent = () => {
  const { clientId } = useParams();

  const { readOne } = useClient({ autoFetch: false });
  const [client, setClient] = useState<Client | null>(null);
  useEffect(() => {
    if (clientId) {
      readOne(clientId as Id).then(setClient);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  if (!client) {
    return null;
  }

  return (
    <PageTabs
      backHref={`/clients/${clientId}`}
      tabs={[
        {
          label: "Rapporten",
          href: `/clients/${clientId}/reports-record/reports`,
        },
        {
          href: `/clients/${clientId}/reports-record/automatic-reports`,
          label: "Automatische rapporten",
        },
      ]}
      title={
        `Rapportagegeschiedenis` +
        (client ? ` voor ${client.first_name} ${client.last_name}` : "")
      }
    />
  );
};

export default ReportsHistoryTabs;
