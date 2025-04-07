"use client";

import React, { FunctionComponent } from "react";
// import ContractForm from "@/components/forms/ContractForm";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import Panel from "@/components/common/Panel/Panel";
import { useParams } from "next/navigation";
import ContractForm from "@/components/contracts/ContractForm";



const NewContractPage: FunctionComponent = () => {

  const params = useParams();
  const clientId = params?.clientId?.toString();

  if (!clientId)
    return <></>

  return (
    <>
      <Breadcrumb pageName="Nieuw Contract" />
      <Panel
        title={"Creëer een Nieuw Contract"}
        containerClassName="px-7 py-4"
        className="col-span-2"
      >
        <ContractForm
          clientId={clientId}
        />
      </Panel>
    </>
  );
};

export default NewContractPage;
