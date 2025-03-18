"use client";
import React, { useState } from "react";
import { useModal } from "@/components/providers/ModalProvider";
import { useRouter } from "next/navigation";
// import ContractFilters from "@/components/ContractFilters";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import Panel from "@/components/common/Panel/Panel";
import Button from "@/components/common/Buttons/Button";
import ContractsList from "@/components/contracts/ContractsList";
import { ContractFilterFormType } from "@/types/contracts.types";

const Finances = () => {
  const [filters, setFilters] = useState<ContractFilterFormType>();

  // const queryResult = useContractsList(filters);
  // const { open } = useModal(ClientSelectModal);
  const router = useRouter();
  // const selectClient = useCallback(() => {
  //   open({
  //     onSelect: (clientId: any) => {
  //       router.push(`/clients/${clientId}/contracts/new/`);
  //     },
  //   });
  // }, [open, router]);

  return (
    <>
      <Breadcrumb pageName="Contracten" />
      <Panel
        title={"Contracten"}
      // sideActions={<Button onClick={selectClient}>Nieuw contract</Button>}
      >
        <ContractsList />
      </Panel>
    </>
  );
};

export default Finances;
