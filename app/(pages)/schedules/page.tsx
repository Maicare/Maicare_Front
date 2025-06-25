"use client";

import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import ScheduleCalendar from "./_components/ScheduleCalendar";

const Page = () => {

  return (
    <>
      <Breadcrumb pageName="Roosters" />

      {/* Content Area */}
      <div className="mt-4 p-4">
        <ScheduleCalendar />
      </div>
    </>
  );
};

export default Page;