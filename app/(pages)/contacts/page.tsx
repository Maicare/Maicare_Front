"use client";

import React, { FunctionComponent } from "react";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";
import { ArrowBigLeft, ArrowBigRightDash, Contact, PlusCircle } from "lucide-react";
import { DataTable } from "@/components/employee/table/data-table";
import PrimaryButton from "@/common/components/PrimaryButton";
import { useRouter } from "next/navigation";
import { useContact } from "@/hooks/contact/use-contact";
import { columns } from "./_components/columns";

const Page: FunctionComponent = () => {

  const router = useRouter();

  const { contacts, setPage, page } = useContact({ autoFetch: true });

  const handlePrevious = () => {
    if (page <= 1) {
      setPage(1);
      return;
    }
    setPage(page - 1);
  }
  const handleNext = () => {
    if (contacts?.next) {
      setPage(page + 1);
      return;
    }
  }
  const handleAdd = () => {
    router.push(`/contacts/new`);
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'>
          <Contact size={24} className='text-indigo-400' />  Opdrachtgevers
        </h1>
        <PrimaryButton
          text="Add"
          onClick={handleAdd}
          disabled={false}
          icon={PlusCircle}
          animation="animate-bounce"
          className="ml-auto dark:bg-indigo-800 dark:text-white dark:hover:bg-indigo-500"
        />
      </div>
      <div className="grid grid-cols-1 gap-4">

        <div className="grid grid-cols-1 gap-4">
          <DataTable columns={columns} data={contacts?.results ?? []} className="dark:bg-[#18181b] dark:border-black" />
          <div className="flex px-2 py-3 bg-white dark:bg-[#18181b] dark:border-black rounded-md mt-5 justify-between border-2 border-muted">
            <PrimaryButton
              disabled={page === 1}
              onClick={handlePrevious}
              text={"Previous"}
              icon={ArrowBigLeft}
              iconSide="left"
            />
            <PrimaryButton
              disabled={contacts?.next ? false : true}
              onClick={handleNext}
              text={"Next"}
              icon={ArrowBigRightDash}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(
  withPermissions(Page, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewSender, // TODO: Add correct permisssion
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);
