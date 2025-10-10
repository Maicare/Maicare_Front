"use client";

import PrimaryButton from "@/common/components/PrimaryButton";
import LargeErrorMessage from "@/components/common/Alerts/LargeErrorMessage";
import Loader from "@/components/common/loader";
import { DataTable } from "@/components/employee/table/data-table";
import { ArrowBigLeft, ArrowBigRight, Building2,  } from "lucide-react";
import { useState } from "react";
import { getColumns } from "./_components/columns";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";
import { useOrganisation } from "@/hooks/organisation/use-organisation";
import { Organization } from "@/types/organisation";
import { CreateOrganisation } from "@/schemas/organisation.schema";
import CreateOrganisationSheet from "./_components/create-organisation-sheet";


const OrganisationsPage = () => {
  const { organisations, isLoading, createOne, updateOne } = useOrganisation({ autoFetch: true });
  const [open, setOpen] = useState(false);
  const [organisation, setOrganisation] = useState<Organization | null>(null);
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
    // if (organisations?.next) {
    //   setPage(page + 1);
    //   return;
    // }
  }
  const handleCreate = async (values: CreateOrganisation) => {
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
  const handleUpdate = async (values: CreateOrganisation) => {
    try {
      await updateOne(
        values,
        organisation!.id!.toString(),
        {
          displayProgress: true,
          displaySuccess: true
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  const handlePreUpdate = (organisation: Organization) => {
    setOrganisation(organisation);
    setOpen(true);
  }
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'>
          <Building2 size={24} className='text-indigo-400' />  Organisaties
        </h1>
        <CreateOrganisationSheet
          mode={organisation ? "update" : "create"}
          handleCreate={handleCreate}
          handleUpdate={handleUpdate}
          handleOpen={handleOpen}
          organisation={organisation ?? undefined}
          isOpen={open}
        />

      </div>
      <div className="grid grid-cols-1 gap-4">
        {
          isLoading ?
            <Loader />
            : organisations?.length === 0 ?
              <div className="col-span-4 w-full flex items-center justify-center">
                <LargeErrorMessage
                  firstLine={"Oeps!"}
                  secondLine={
                    "Het lijkt erop dat er geen organisaties zijn die aan uw zoekcriteria voldoen."
                  }
                  className="w-full"
                />
              </div>
              :
              <div className="grid grid-cols-1 gap-4">
                <DataTable columns={getColumns({handlePreUpdate})} data={organisations ?? []} onRowClick={() => { }} className="dark:bg-[#18181b] dark:border-black" />
                <div className="flex px-2 py-3 bg-white dark:bg-[#18181b] dark:border-black rounded-md mt-5 justify-between border-2 border-muted">
                  <PrimaryButton
                    disabled={true}
                    onClick={handlePrevious}
                    text={"Vorige"}
                    icon={ArrowBigLeft}
                    iconSide="left"
                  />
                  <PrimaryButton
                    disabled={true}
                    onClick={handleNext}
                    text={"Volgende"}
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
  withPermissions(OrganisationsPage, {
      redirectUrl: Routes.Common.NotFound,
      requiredPermissions: PermissionsObjects.ViewEmployee,
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);