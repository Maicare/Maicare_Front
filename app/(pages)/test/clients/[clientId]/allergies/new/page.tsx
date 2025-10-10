"use client";

import React, { FunctionComponent } from "react";
import AllergyForm from "@/components/medical-record/AllergyForm";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import Panel from "@/components/common/Panel/Panel";
import { useParams } from "next/navigation";

const NewMedicationPage: FunctionComponent = () => {

  const params = useParams();
  const clientId = params?.clientId?.toString();

  if (!clientId)
    return <></>

  return (
    <>
      <Breadcrumb pageName="Nieuwe Allergie" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <Panel title={"Registreer een Nieuwe Allergie"}>
          <AllergyForm clientId={clientId} />
        </Panel>
      </div>
    </>
  );
};

export default NewMedicationPage;
