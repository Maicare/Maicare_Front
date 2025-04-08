"use client";
import React, { useCallback } from "react";
import { useModal } from "@/components/providers/ModalProvider";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import Panel from "@/components/common/Panel/Panel";
import ContractsList from "@/components/contracts/ContractsList";
import ClientSelectModal from "@/components/common/Modals/ClientSelectModal";
import Button from "@/components/common/Buttons/Button";

const Finances = () => {

  const { open } = useModal(ClientSelectModal);
  const router = useRouter();

  const selectClient = useCallback(() => {
    open({
      onSelect: (clientId: string) => {
        router.push(`/clients/${clientId}/contracts/new/`);
      },
    });
  }, [open, router]);

  return (
    <>
      <Breadcrumb pageName="Contracten" />
      <Panel
        title={"Contracten"}
        sideActions={<Button onClick={selectClient}>Nieuw contract</Button>}
      >
        <ContractsList />
      </Panel>
    </>
  );
};

export default Finances;
