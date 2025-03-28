"use client";

import LargeErrorMessage from "@/components/common/Alerts/LargeErrorMessage";
import LinkButton from "@/components/common/Buttons/LinkButton";
import Panel from "@/components/common/Panel/Panel";
import ContractsList from "@/components/contracts/ContractsList";
import { useParams } from "next/navigation";
import React, { FunctionComponent } from "react";


const ContractsPage: FunctionComponent = () => {

  const params = useParams();
  const clientId = params?.clientId?.toString();


  if (!clientId)
    return <LargeErrorMessage
      firstLine="Er is iets mis gegaan"
      secondLine="De client of contract is niet gevonden"
    />

  return (
    <Panel
      title={"Contractenlijst"}
      sideActions={

        <LinkButton text={"Nieuw contract toevoegen"} href={`contracts/new`} />

      }
    >
      <ContractsList clientId={clientId} />
    </Panel>
  );
};

export default ContractsPage;
