"use client";

import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
// import { useAuth } from "@/common/hooks/use-auth";
import ScheduleCalendar from "./_components/ScheduleCalendar";

const Page = () => {
  // const { user } = useAuth();
  // const employeeId = user?.employee_id;

  return (
    <>
      <Breadcrumb pageName="Opdrachtgevers" />

      {/* Content Area */}
      <div className="mt-4 p-4">
        <ScheduleCalendar />
      </div>
    </>
  );
};

export default Page;