"use client";

import PrimaryButton from "@/common/components/PrimaryButton";
import { DataTable } from "@/components/employee/table/data-table";
import { useInvoice } from "@/hooks/invoice/use-invoive";
import { ArrowBigLeft, ArrowBigRight, DollarSign } from "lucide-react";
import { columns } from "./_components/columns";


const InvoicesPage = () => {
    const { invoices, setPage, page } = useInvoice({ autoFetch: true });
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
  return (
    <div className="w-full flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'>
        <DollarSign size={24} className='text-indigo-400' />  Invoices
      </h1>

      {/* <Dialog>
        <DialogTrigger asChild>
          <PrimaryButton
            text="Add"
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
            <div className="grid gap-3">
              <ClientSelect
                label="Client"
                value={clientId||""}
                onChange={(value) => {
                  setClientId(value);
                  console.log({clientId,value})
                }}
                className="w-full"
                modal={true}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" disabled={!clientId} onClick={()=>handleAdd()}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}


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

export default InvoicesPage