"use client";
import React from "react";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import ClientDetails from "@/components/clients/ClientDetails";

const Page: React.FC = () => {
  const params = useParams();
  const clientIdParam = params?.clientId;
  const clientId = clientIdParam ? parseInt(clientIdParam as string, 10) : 0;


  return (
    <>
      <Breadcrumb pageName="Cliëntgegevens" />
      <ClientDetails clientId={clientId} />
    </>
  );
};

export default Page;
