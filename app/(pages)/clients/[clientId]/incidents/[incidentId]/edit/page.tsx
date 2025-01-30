import React, { FunctionComponent } from "react";
import IncidentForm from "@/components/incident/IncidentFormNew";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";

const UpdateEpisodePage: FunctionComponent<{
  params: { clientId: string; incidentId: number };
}> = ({ params }: { params: { clientId: string; incidentId: number } }) => {
  return (
    <>
      <Breadcrumb pageName="Bijwerken aflevering" />
      <div className="grid grid-cols-1 gap-9">
        <IncidentForm
          mode={"edit"}
          incidentId={params.incidentId}
          clientId={parseInt(params.clientId)}
        />
      </div>
    </>
  );
};

export default UpdateEpisodePage;
