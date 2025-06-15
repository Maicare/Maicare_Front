"use client";

import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
// import { useAuth } from "@/common/hooks/use-auth";
import ScheduleCalendar from "./_components/ScheduleCalendar";
import { useParams } from "next/navigation";

const Page = () => {
  // const { user } = useAuth();
  // const employeeId = user?.employee_id;
  const {locationId} = useParams();
  return (
    <>
      <Breadcrumb pageName="Opdrachtgevers" />

      {/* Content Area */}
      <div className="mt-4 p-4">
        <ScheduleCalendar locationId={locationId as string} />
      </div>
    </>
  );
};

export default Page;