"use client";
import PrimaryButton from "@/common/components/PrimaryButton";
import { DataTable } from "@/components/employee/table/data-table"

import { useDebounce } from "@/hooks/common/useDebounce";
import { Row } from "@tanstack/table-core";
import {  ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {  useState } from "react";
import { columns } from "./_components/columns";
import { useShift } from "@/hooks/shift/use-shift";
import { CreateShift, Shift } from "@/schemas/shift.schema";
import CreateShiftSheet from "./_components/CreateShiftSheet";
import { Id } from "@/common/types/types";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";




const ShiftPage = () => {

  const router = useRouter();

  const { locationId } = useParams();

  const [filters, _setFilters] = useState<{
    location_id: number;
    autoFetch?: boolean;
  }>({
    autoFetch: true,
    location_id: parseInt(locationId as string, 10) || 0,
  });

  const deboucedFilters = useDebounce(filters, 500);
  const { shifts,createOne,updateOne} = useShift({...deboucedFilters,autoFetch:true});

  const handleRowClick = (shiftRow: Row<Shift>) => {
    const shift = shiftRow.original;
    router.push(`/shifts/${shift.id}`);
  };

  const [open, setOpen] = useState(false);
  const [shift, _setShift] = useState<Shift | null>(null);
  const handleOpen = (bool: boolean) => {
    setOpen(bool);
  }
  const handlePrevious = () => {
    // if (page <= 1) {
    //   setPage(1);
    //   return;
    // }
    // setPage(page - 1);
  }
  const handleNext = () => {
    // if (shifts?.next) {
    //   setPage(page + 1);
    //   return;
    // }
  }
  const handleCreate = async (values: CreateShift) => {
    try {
      await createOne(
        values, {
        displayProgress: true,
        displaySuccess: true
      }
      );
    } catch (error) {
      console.log(error);
    }
  }
  const handleUpdate = async (values: CreateShift&{id:Id}) => {
    try {
      await updateOne(
        values.id,
        values,
        {
          displayProgress: true,
          displaySuccess: true
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  // const handlePreUpdate = (shift: Shift) => {
  //   setShift(shift);
  //   setOpen(true);
  // }

  return (
    <div className="">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-semibold">Shifts</h1>
        <CreateShiftSheet
          mode={shift ? "update" : "create"}
          handleCreate={handleCreate}
          handleUpdate={handleUpdate}
          handleOpen={handleOpen}
          shift={shift ?? undefined}
          isOpen={open}
        />
      </div>
      <DataTable columns={columns} data={shifts ?? []} onRowClick={handleRowClick} className="dark:bg-[#18181b] dark:border-black" />
      <div className="flex px-2 py-3 bg-white dark:bg-[#18181b] dark:border-black rounded-md mt-5 justify-between border-2 border-muted">
        <PrimaryButton
          disabled={true}
          onClick={handlePrevious}
          text={"Previous"}
          icon={ArrowBigLeft}
          iconSide="left"
        />
        <PrimaryButton
          disabled={true}
          onClick={handleNext}
          text={"Next"}
          icon={ArrowBigRight}
        />
      </div>
    </div>
  )
}
export default withAuth(
  withPermissions(ShiftPage, {
      redirectUrl: Routes.Common.NotFound,
      requiredPermissions: PermissionsObjects.ViewShift, // TODO: Add correct permission
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);