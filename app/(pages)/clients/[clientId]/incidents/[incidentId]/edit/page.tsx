"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import IncidentForm from "@/components/incident/IncidentFormNew";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import { useIncident } from "@/hooks/incident/use-incident";
import { Incident } from "@/types/incident.types";
import Loader from "@/components/common/loader";

const UpdateEpisodePage = () => {
  const params = useParams();
  const clientId = parseInt(params.clientId as string);
  const incidentId = parseInt(params.incidentId as string);
  const [incident, setIncident] = useState<Incident>();
  const { readOne } = useIncident({ autoFetch:false,clientId: clientId });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!clientId || !incidentId) return;
    const fetchIncident = async () => {
      setIsLoading(true);
      const data = await readOne(incidentId, clientId);
      setIncident(data);
      setIsLoading(false);
    };
    fetchIncident();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId, incidentId]);

  if (!clientId) return null;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Breadcrumb pageName="Bijwerken aflevering" />
      <div className="grid grid-cols-1 gap-9">
        <IncidentForm mode={"edit"} incident={incident} clientId={clientId} />
      </div>
    </>
  );
};

export default UpdateEpisodePage;
