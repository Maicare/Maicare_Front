"use client";

import React, { FunctionComponent } from "react";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import ContactForm from "@/components/contacts/ContactForm";
import Panel from "@/components/common/Panel/Panel";

const Page: FunctionComponent = () => {
  return (
    <>
      <Breadcrumb pageName={"Nieuw Opdrachtgevers"} />
      <div className="">
        <Panel title={"Creëer een Nieuw Opdrachtgevers"}>
          <ContactForm />
        </Panel>
      </div>
    </>
  );
};

export default Page;
