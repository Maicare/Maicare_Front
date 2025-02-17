"use client";

import React, { FunctionComponent, useEffect, useState } from "react";
import { useParams } from "next/navigation";

import PageTabs from "../common/PageTabs/PageTabs";
import { useClient } from "@/hooks/client/use-client";
import { Client } from "@/types/client.types";

const MedicalHistoryTabs: FunctionComponent = () => {
  const { clientId } = useParams();
  const parsedId = typeof clientId === "string" && parseInt(clientId);
  const { readOne } = useClient({ autoFetch: false });
  const [data, setData] = useState<Client | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await readOne(parsedId || 0);
      setData(result);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedId]);
  return (
    <PageTabs
      backHref={`/clients/${clientId}/medical-record`}
      tabs={[
        {
          label: "Diagnose",
          href: `/clients/${clientId}/medical-record/diagnosis`,
        },
        {
          label: "Medicatie",
          href: `/clients/${clientId}/medical-record/medications`,
        },
        {
          label: "Allergieën",
          href: `/clients/${clientId}/medical-record/allergies`,
        },
        // {
        //   label: "Episodes",
        //   href: `/clients/${clientId}/medical-record/episodes`,
        // },
      ]}
      title={
        `Medische Geschiedenis` +
        (data ? ` voor ${data.first_name} ${data.last_name}` : "")
      }
    />
  );
};

export default MedicalHistoryTabs;
