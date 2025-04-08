"use client";
import React from "react";
// import ContractFilters from "@/components/ContractFilters";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import Panel from "@/components/common/Panel/Panel";
import ContractsList from "@/components/contracts/ContractsList";

const Finances = () => {

  // const queryResult = useContractsList(filters);
  // const { open } = useModal(ClientSelectModal);
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
