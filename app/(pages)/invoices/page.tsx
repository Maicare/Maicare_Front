"use client";

import PrimaryButton from "@/common/components/PrimaryButton";
import { DataTable } from "@/components/employee/table/data-table";
import { useInvoice } from "@/hooks/invoice/use-invoive";
import { ArrowBigLeft, ArrowBigRight, DollarSign, PlusCircle } from "lucide-react";
import { columns } from "./_components/columns";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ClientSelect from "../contracts/_components/client-select";
import { useState } from "react";
import { DatePicker } from "./_components/date-picker";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";
import { useRouter } from "next/navigation";


const InvoicesPage = () => {
  const { invoices, setPage, page, generateOne } = useInvoice({ autoFetch: true });
  const router = useRouter();
  const [clientId, setClientId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const handlePrevious = () => {
    if (page <= 1) {
      setPage(1);
      return;
    }
    setPage(page - 1);
  }
  const handleNext = () => {
    if (invoices?.next) {
      setPage(page + 1);
      return;
    }
  }
  const handleCreate = () => {
    if (!clientId) return;
    router.push(`/invoices/create?clientId=${clientId}`);
  }
  const handleAdd = async () => {
    try {
      if (!clientId) return;
      if (!startDate || !endDate) return;
      if (startDate > endDate) {
        alert("Start date cannot be after end date");
        return;
      }
      // Call the createOne function with the necessary data
      await generateOne({
        client_id: parseInt(clientId),
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      }, {
        displayProgress: true,
        displaySuccess: true,
      });
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'>
          <DollarSign size={24} className='text-indigo-400' />  Facturen
        </h1>
        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <PrimaryButton
                text="Create"
                disabled={false}
                icon={PlusCircle}
                animation="animate-bounce"
                className="ml-auto dark:bg-indigo-800 dark:text-white dark:hover:bg-indigo-500"
              />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Select a Client</DialogTitle>
                <DialogDescription>
                  Please select a client to create a contract for. You can also add a new client if needed.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <ClientSelect
                    label="Client"
                    value={clientId || ""}
                    onChange={(value) => {
                      setClientId(value);
                      console.log({ clientId, value })
                    }}
                    className="w-full col-span-2"
                    modal={true}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="button" disabled={!clientId} onClick={() => handleCreate()}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <PrimaryButton
                text="Generate"
                disabled={false}
                icon={PlusCircle}
                animation="animate-bounce"
                className="ml-auto dark:bg-indigo-800 dark:text-white dark:hover:bg-indigo-500"
              />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Select a Client</DialogTitle>
                <DialogDescription>
                  Please select a client to create a contract for. You can also add a new client if needed.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <ClientSelect
                    label="Client"
                    value={clientId || ""}
                    onChange={(value) => {
                      setClientId(value);
                      console.log({ clientId, value })
                    }}
                    className="w-full col-span-2"
                    modal={true}
                  />
                  <DatePicker
                    date={startDate}
                    handleDateChange={(date) => setStartDate(date)}
                    label="Start Date"
                    modal={true}
                  />
                  <DatePicker
                    date={endDate}
                    handleDateChange={(date) => setEndDate(date)}
                    label="End Date"
                    modal={true}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="button" disabled={!clientId} onClick={() => handleAdd()}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>


      </div>
      <div className="grid grid-cols-1 gap-4">

        <div className="grid grid-cols-1 gap-4">
          {/* <TableFilters
          filters={filters}
          setFilters={(filters) => setFilters(filters)}
        /> */}
          <DataTable columns={columns} data={invoices?.results ?? []} className="dark:bg-[#18181b] dark:border-black" />
          <div className="flex px-2 py-3 bg-white dark:bg-[#18181b] dark:border-black rounded-md mt-5 justify-between border-2 border-muted">
            <PrimaryButton
              disabled={page === 1}
              onClick={handlePrevious}
              text={"Previous"}
              icon={ArrowBigLeft}
              iconSide="left"
            />
            <PrimaryButton
              disabled={invoices?.next ? false : true}
              onClick={handleNext}
              text={"Next"}
              icon={ArrowBigRight}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default withAuth(
  withPermissions(InvoicesPage, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permission
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);