"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";

import IncidentForm from "@/components/incident/IncidentFormNew";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import { useIncident } from "@/hooks/incident/use-incident";
import { Incident } from "@/types/incident.types";
import Loader from "@/components/common/loader";

const UpdateEpisodePage = () => {
  const { clientId, incidentId } = useParams();
  const [incident, setIncident] = React.useState<Incident>();
  const { readOne } = useIncident({ clientId: parseInt(clientId as string) });
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    if (!clientId || !incidentId) return;
    const fetchIncident = async () => {
      setIsLoading(true);
      const data = await readOne(Number(incidentId), Number(clientId));
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
        <IncidentForm
          mode={"edit"}
          incident={incident}
          clientId={Number(clientId)}
        />
      </div>
    </>
  );
};

export default UpdateEpisodePage;
