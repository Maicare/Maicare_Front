"use client";

import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import AppointmentsDetails from "./_components/AppointmentsDetails";
import BookingCalendar from "@/components/calendar/BookingCalendar";
import { useAuth } from "@/common/hooks/use-auth";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";

const Page = () => {
  const { user } = useAuth({});
  const employeeId = user?.employee_id;

  return (
    <>
      <Breadcrumb pageName="Agenda" />

      {/* Tabs Container */}
      <div className="mt-6">
        <Tabs defaultValue={employeeId ? "calendar" : "details"}>
          <TabsList className="flex p-1 gap-1 bg-slate-100 rounded-lg border border-slate-200">
            {employeeId && (
              <TabsTrigger
                value="calendar"
                className="
                  px-4 py-2 text-sm font-medium rounded-md w-full
                  transition-colors focus-visible:outline-none
                  data-[state=active]:bg-white data-[state=active]:shadow-sm
                  data-[state=active]:text-indigo-600 hover:bg-slate-50
                  border border-transparent data-[state=active]:border-slate-200
                "
              >
                Calendar
              </TabsTrigger>
            )}
            <TabsTrigger
              value="details"
              className="
                px-4 py-2 text-sm font-medium rounded-md w-full
                transition-colors focus-visible:outline-none
                data-[state=active]:bg-white data-[state=active]:shadow-sm
                data-[state=active]:text-indigo-600 hover:bg-slate-50
                border border-transparent data-[state=active]:border-slate-200
              "
            >
              Details
            </TabsTrigger>
          </TabsList>

          {/* Content Area */}
          <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            {employeeId && (
              <TabsContent value="calendar">
                <BookingCalendar />
              </TabsContent>
            )}

            <TabsContent value="details">
              <AppointmentsDetails />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default withAuth(
  withPermissions(Page, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewAppointment, // TODO: Add correct permission
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);