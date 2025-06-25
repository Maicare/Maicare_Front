"use client";

import { FunctionComponent, use } from "react";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import BookingCalendar from "@/components/calendar/BookingCalendar";

interface PageProps {
  params: Promise<{ employeeId: string }>;
}

const Page: FunctionComponent<PageProps> = ({ params }) => {
  const { employeeId } = use(params);

  return (
    <>
      <Breadcrumb pageName="Agenda" />
      <BookingCalendar employeeId={Number(employeeId)} />
    </>
  );
};

export default Page;
