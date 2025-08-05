"use client";

import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
// import { useAuth } from "@/common/hooks/use-auth";
import ScheduleCalendar from "./_components/ScheduleCalendar";
import { useParams } from "next/navigation";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";

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

export default withAuth(
  withPermissions(Page, {
      redirectUrl: Routes.Common.NotFound,
      requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permission
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);