"use client";

import React, { FunctionComponent } from "react";
import Panel from "@/components/common/Panel/Panel";
import LinkButton from "@/components/common/Buttons/LinkButton";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import BookingCalendar from "./_components/BookingCalendar";

const Page: FunctionComponent = () => {
  return (
    <>
      <Breadcrumb pageName={"Opdrachtgevers"} />
      <BookingCalendar />
    </>
  );
};

export default Page;
