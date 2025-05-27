"use client";

import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import AppointmentsDetails from "./_components/AppointmentsDetails";

const Page = () => {

  return (
    <>
      <Breadcrumb pageName="Opdrachtgevers" />
      <AppointmentsDetails />
    </>
  );
};

export default Page;
