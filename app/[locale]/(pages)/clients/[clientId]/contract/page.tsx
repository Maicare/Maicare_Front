"use client";
import { useParams, useRouter } from "next/navigation";

import { ArrowBigLeft, ArrowBigRight, Contrast, PlusCircle } from "lucide-react";
import PrimaryButton from "@/common/components/PrimaryButton";
import { DataTable } from "@/components/employee/table/data-table";
import { useContract } from "@/hooks/contract/use-contract";
import { columns } from "./_components/columns";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { Contract } from "@/schemas/contract.schema";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";

const Finances = () => {
  const router = useRouter();

  const {clientId} = useParams();

  const { contracts, setPage, page } = useContract({ autoFetch: true,clientId:clientId as string });

  const handlePrevious = () => {
    if (page <= 1) {
      setPage(1);
      return;
    }
    setPage(page - 1);
  }
  const handleNext = () => {
    if (contracts?.next) {
      setPage(page + 1);
      return;
    }
  }
  const handleAdd = () => {
    router.push(`contract/create`);
  }
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'>
          <Contrast size={24} className='text-indigo-400' />  Contracten
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
          <DataTable columns={columns} data={(contracts as PaginatedResponse<Contract>)?.results ?? []} className="dark:bg-[#18181b] dark:border-black" />
          <div className="flex px-2 py-3 bg-white dark:bg-[#18181b] dark:border-black rounded-md mt-5 justify-between border-2 border-muted">
            <PrimaryButton
              disabled={page === 1}
              onClick={handlePrevious}
              text={"Previous"}
              icon={ArrowBigLeft}
              iconSide="left"
            />
            <PrimaryButton
              disabled={contracts?.next ? false : true}
              onClick={handleNext}
              text={"Next"}
              icon={ArrowBigRight}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(
  withPermissions(Finances, {
      redirectUrl: Routes.Common.NotFound,
      requiredPermissions: PermissionsObjects.ViewContract, // TODO: Add correct permission
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);
