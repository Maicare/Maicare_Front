"use client";

import React, { FunctionComponent, useEffect, useState } from "react";
// import ContractDetails from "@/components/ContractDetails";
// import { useContractDetails } from "@/utils/contracts/getContractDetails";
import Panel from "@/components/common/Panel/Panel";
import LinkButton from "@/components/common/Buttons/LinkButton";
import { useParams } from "next/navigation";
import { useContract } from "@/hooks/contract/use-contract";
import Loader from "@/components/common/loader";
import LargeErrorMessage from "@/components/common/Alerts/LargeErrorMessage";
import ContractDetails from "@/components/contracts/ContractDetails";
import { Any } from "@/common/types/types";

const Page: FunctionComponent = () => {

  const params = useParams();
  const contractId = params?.contractId?.toString();
  const clientId = params?.clientId?.toString();

  const { readOne } = useContract({});

  const [contract, setContract] = useState<Any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getContract = async () => {
      try {
        if (clientId && contractId) {
          setLoading(true);
          const data = await readOne(clientId, contractId);
          setContract(data);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getContract()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractId, clientId]);

  console.log("Contract", contract)

  // const { data: contract, isLoading: isContractLoading } = useContractDetails(
  //   +clientId,
  //   +contractId
  // );


  if (loading)
    return <Loader />
  if (!clientId || !contractId)
    return <LargeErrorMessage
      firstLine="Er is iets mis gegaan"
      secondLine="De client of contract is niet gevonden"
    />
  if (!loading && !contract)
    return <LargeErrorMessage
      firstLine="Er is iets mis gegaan"
      secondLine="Het contract is niet gevonden"
    />
  return (
    <div>
      <Panel
        title={"Contract #" + contractId}
        sideActions={

          <LinkButton
            href={`/clients/${clientId}/contracts/${contractId}/edit`}
            text={"Bewerk contract"}
          />

        }
      >
        <ContractDetails contractData={contract} clientId={clientId} />
        {/* <WorkingHours contractId={parseInt(contractId)} /> */}
      </Panel>
    </div>
  );
};

export default Page;
