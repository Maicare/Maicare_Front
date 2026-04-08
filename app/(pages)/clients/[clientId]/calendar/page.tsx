"use client";

import { FunctionComponent, use } from "react";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import BookingCalendar from "@/components/calendar/BookingCalendar";

interface PageProps {
  params: Promise<{ clientId: string }>;
}

const Page: FunctionComponent<PageProps> = ({ params }) => {
  const { clientId } = use(params);

  return (
    <>
      <Breadcrumb pageName="Opdrachtgevers" />
      <BookingCalendar clientId={clientId} />
    </>
  );
};

export default Page;
