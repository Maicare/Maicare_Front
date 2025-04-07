"use client";

import React, { FunctionComponent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import Panel from "@/components/common/Panel/Panel";
import { useContract } from "@/hooks/contract/use-contract";
import { ContractResDto } from "@/types/contracts.types";
import LargeErrorMessage from "@/components/common/Alerts/LargeErrorMessage";
import Loader from "@/components/common/loader";
import ContractForm from "@/components/contracts/ContractForm";

const EditContract: FunctionComponent = () => {
  const params = useParams();
  const contractId = params?.contractId?.toString();
  const clientId = params?.clientId?.toString();

  const { readOne } = useContract({});

  const [contract, setContract] = useState<ContractResDto | null>(null);
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
  }, [contractId, clientId]);

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
    <>
      <Breadcrumb pageName="Contract Bewerken" />
      <Panel title={"Bewerk zijn contract"} containerClassName="px-7 py-4" className="col-span-2">
        {contract && <ContractForm
          clientId={clientId}
          contract={contract}
        />}
      </Panel>
    </>
  );
};

export default EditContract;
