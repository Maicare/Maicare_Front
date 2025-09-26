"use client";

import PrimaryButton from "@/common/components/PrimaryButton";
import LargeErrorMessage from "@/components/common/Alerts/LargeErrorMessage";
import Loader from "@/components/common/loader";
import { DataTable } from "@/components/employee/table/data-table";
import { useLocation } from "@/hooks/location/use-location";
import { CreateLocation } from "@/schemas/location.schema";
import { Location } from "@/types/location.types";
import { ArrowBigLeft, ArrowBigRight, Locate } from "lucide-react";
import { useState } from "react";
import { getColumns } from "./_components/columns";
import CreateLocationSheet from "./_components/CreateLocationSheet";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";


const LocationsPage = () => {
  const { locations, isLoading, createOne, updateOne } = useLocation({ autoFetch: true });
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
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
    // if (locations?.next) {
    //   setPage(page + 1);
    //   return;
    // }
  }
  const handleCreate = async (values: CreateLocation) => {
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
  const handleUpdate = async (values: CreateLocation) => {
    try {
      await updateOne(
        values,
        location!.id!.toString(),
        {
          displayProgress: true,
          displaySuccess: true
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  const handlePreUpdate = (location: Location) => {
    setLocation(location);
    setOpen(true);
  }
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'>
          <Locate size={24} className='text-indigo-400' />  Locatie
        </h1>
        <CreateLocationSheet
          mode={location ? "update" : "create"}
          handleCreate={handleCreate}
          handleUpdate={handleUpdate}
          handleOpen={handleOpen}
          location={location ?? undefined}
          isOpen={open}
        />

      </div>
      <div className="grid grid-cols-1 gap-4">
        {
          isLoading ?
            <Loader />
            : locations?.length === 0 ?
              <div className="col-span-4 w-full flex items-center justify-center">
                <LargeErrorMessage
                  firstLine={"Oops!"}
                  secondLine={
                    "Het lijkt erop dat er geen medewerkers zijn die aan uw zoekcriteria voldoen."
                  }
                  className="w-full"
                />
              </div>
              :
              <div className="grid grid-cols-1 gap-4">
                <DataTable columns={getColumns({handlePreUpdate})} data={locations ?? []} onRowClick={() => { }} className="dark:bg-[#18181b] dark:border-black" />
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
        }
      </div>
    </div>
  )
}

export default withAuth(
  withPermissions(LocationsPage, {
      redirectUrl: Routes.Common.NotFound,
      requiredPermissions: PermissionsObjects.ViewLocation, // TODO: Add correct permission
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);