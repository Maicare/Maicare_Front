"use client";

import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import React, { FunctionComponent } from "react";
import IncidentForm from "@/components/incident/IncidentFormNew";
import { useParams } from "next/navigation";

const NewIncidentsPage: FunctionComponent = () => {
  const params = useParams();
  const clientIdParam = params?.clientId;
  const clientId = clientIdParam as string;
  return (
    <>
      <Breadcrumb pageName="New Incident" />
      <div className="grid grid-cols-1 gap-9">
        <IncidentForm mode={"new"} clientId={parseInt(clientId)} />
      </div>
    </>
  );
};

export default NewIncidentsPage;
