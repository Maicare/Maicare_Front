"use client";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import Panel from "@/components/common/Panel/Panel";
import AllergyForm from "@/components/medical-record/AllergyForm";
import { useParams } from "next/navigation";
import React, { FunctionComponent } from "react";

const UpdateMedicationPage: FunctionComponent = () => {

  const params = useParams();
  const allergyId = params?.allergieId?.toString();
  const clientId = params?.clientId?.toString();


  if (!clientId || !allergyId)
    return <></>


  return (
    <>
      <Breadcrumb pageName="Bijwerken allergie" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <Panel title={"Bijwerken allergie"}>
          <AllergyForm
            allergyId={allergyId}
            clientId={clientId}
          />
        </Panel>
      </div>
    </>
  );
};

export default UpdateMedicationPage;
