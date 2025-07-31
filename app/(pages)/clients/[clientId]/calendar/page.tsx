"use client";

import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import BookingCalendar from "@/components/calendar/BookingCalendar";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";
import { useParams } from "next/navigation";



const Page= () => {
  const { clientId } = useParams();

  return (
    <>
      <Breadcrumb pageName="Agenda" />
      <BookingCalendar clientId={Number(clientId)} />
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
