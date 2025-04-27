"use client";
import PrimaryButton from '@/common/components/PrimaryButton'
import LargeErrorMessage from '@/components/common/Alerts/LargeErrorMessage';
import Loader from '@/components/common/loader';
import { useEmergencyContact } from '@/hooks/client-network/use-emergency-contact';
import { ArrowBigLeft, ArrowBigRight, UsersRound } from 'lucide-react'
import { useParams } from 'next/navigation';
import React, { useState } from 'react'
import CreateEmergencySheet from './_components/CreateEmergencySheet';
import { EmergencyContactList } from '@/types/emergency.types';
import { CreateEmergencyContact } from '@/schemas/emergencyContact.schema';
import { DataTable } from '@/components/employee/table/data-table';
import { getColumns } from './_components/columns';

const EmergencyPage = () => {
  const { clientId } = useParams();
  const { emergencyContacts, isLoading, page, setPage, createOne, updateOne } = useEmergencyContact({ clientId: clientId as string, autoFetch: true });
  const [open, setOpen] = useState(false);
  const [ emergencyContact, setEmergencyContact ] = useState<EmergencyContactList|null>(null);
  const handleOpen = (bool: boolean) => {
    setOpen(bool);
  }
  const handlePrevious = () => {
    if (page <= 1) {
      setPage(1);
      return;
    }
    setPage(page - 1);
  }
  const handleNext = () => {
    if (emergencyContacts?.next) {
      setPage(page + 1);
      return;
    }
  }
  const handleCreate = async (values: CreateEmergencyContact) => {
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
  const handleUpdate = async (values: CreateEmergencyContact) => {
    try {
      await updateOne(
        values,
        values.id!.toString(),
        {
          displayProgress: true,
          displaySuccess: true
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  // const handleDelete = async (id: number) => {
  //   try {
  //     alert("deleted !")
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }
  const handlePreUpdate = (report: EmergencyContactList) => {
    setEmergencyContact(report);
    setOpen(true);
  }
  return (
      <div className="w-full flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'>
            <UsersRound size={24} className='text-indigo-400' />  Noodcontact
          </h1>
          <CreateEmergencySheet
            mode={emergencyContact ? "update" : "create"}
            handleCreate={handleCreate}
            handleUpdate={handleUpdate}
            handleOpen={handleOpen}
            emergencyContact={emergencyContact ?? undefined}
            isOpen={open}
          />

        </div>
        <div className="grid grid-cols-1 gap-4">
          {
            isLoading ?
              <Loader />
              : emergencyContacts?.results?.length === 0 ?
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
                  <DataTable columns={getColumns(handlePreUpdate)} data={emergencyContacts?.results ?? []} onRowClick={() => { }} className="dark:bg-[#18181b] dark:border-black" />
                  <div className="flex px-2 py-3 bg-white dark:bg-[#18181b] dark:border-black rounded-md mt-5 justify-between border-2 border-muted">
                    <PrimaryButton
                      disabled={page === 1}
                      onClick={handlePrevious}
                      text={"Previous"}
                      icon={ArrowBigLeft}
                      iconSide="left"
                    />
                    <PrimaryButton
                      disabled={emergencyContacts?.next ? false : true}
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

export default EmergencyPage