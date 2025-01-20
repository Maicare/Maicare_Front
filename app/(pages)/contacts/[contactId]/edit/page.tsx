"use client";

import React from "react";
import { useParams } from "next/navigation";
import ContactForm from "@/components/contacts/ContactForm";
import Panel from "@/components/common/Panel/Panel";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";

const Page: React.FC = () => {
  const params = useParams();
  const contactIdParam = params?.contactId;
  const contactId = contactIdParam ? parseInt(contactIdParam as string, 10) : 0;

  return (
    <>
      <Breadcrumb pageName={"Bijwerken Opdrachtgevers"} />
      <div className="">
        <Panel title={"Bijwerken Opdrachtgevers"}>

          <ContactForm
            contactId={contactId}
          // onSuccess={() => {
          //   router.replace("/contacts");
          // }}
          />

        </Panel>
      </div>
    </>
  );
};

export default Page;
