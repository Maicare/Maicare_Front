"use client";

import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import ScheduleCalendar from "./_components/ScheduleCalendar";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";

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

export default withAuth(
  withPermissions(Page, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewSchedule, // TODO: Add correct permission
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login } 
    );