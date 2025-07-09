"use client";
import { useRouter } from "next/navigation";

import { ArrowBigLeft, ArrowBigRight, Contrast, PlusCircle } from "lucide-react";
import PrimaryButton from "@/common/components/PrimaryButton";
import { DataTable } from "@/components/employee/table/data-table";
import { useContract } from "@/hooks/contract/use-contract";
import { columns, ContractResults } from "./_components/columns";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ClientSelect from "./_components/client-select";
import { useState } from "react";
import TableFilters from "./_components/table-filters";
import { ContractFilterFormType } from "@/types/contracts.types";
import { useDebounce } from "@/hooks/common/useDebounce";

const Finances = () => {
  const router = useRouter();
const [filters, setFilters] = useState<ContractFilterFormType>({
    search: "",
    status: "",
    care_type: "",
    financing_act: "",
    financing_option: "",
    location_id: "",
});

    const deboucedFilters = useDebounce(filters, 500);
  const { contracts, setPage, page } = useContract({ autoFetch: true,...deboucedFilters });

  const [clientId, setClientId] = useState<string | null>(null);

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
    if (clientId) {
      router.push(`/clients/${clientId}/contract/create`);
      return;
    }
  }
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'>
          <Contrast size={24} className='text-indigo-400' />  Contracten
        </h1>

        <Dialog>
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
        </Dialog>


      </div>
      <div className="grid grid-cols-1 gap-4">

        <div className="grid grid-cols-1 gap-4">
          <TableFilters
            filters={filters}
            setFilters={(filters) => setFilters(filters)}
          />
          <DataTable columns={columns} data={(contracts as PaginatedResponse<ContractResults>)?.results ?? []} className="dark:bg-[#18181b] dark:border-black" />
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

export default Finances;
