"use client";

import React, { FunctionComponent } from "react";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import Panel from "@/components/common/Panel/Panel";
import { useParams } from "next/navigation";
import MedicationForm from "@/components/medical-record/MedicationForm";

const NewMedicationPage: FunctionComponent = () => {

  const params = useParams();
  const clientId = params?.clientId?.toString();

  if (!clientId)
    return <></>

  return (
    <>
      <Breadcrumb pageName="Nieuwe Medicatie" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <Panel title={"Creëer een Nieuwe Medicatie"}>
          <MedicationForm clientId={clientId} />
        </Panel>
      </div>
    </>
  );
};

export default NewMedicationPage;
