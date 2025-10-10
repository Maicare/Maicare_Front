"use client";

import { useParams } from "next/navigation";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import BookingCalendar from "@/components/calendar/BookingCalendar";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";



const Page = () => {
  const { employeeId } = useParams();

  return (
    <>
      <Breadcrumb pageName="Agenda" />
      <BookingCalendar employeeId={Number(employeeId)} />
    </>
  );
};

export default withAuth(
  withPermissions(Page, {
      redirectUrl: Routes.Common.NotFound,
      requiredPermissions: PermissionsObjects.ViewEmployeeAppointment, // TODO: Add correct permission
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);
