import CopyTooltip from '@/common/components/CopyTooltip'
import PrimaryButton from '@/common/components/PrimaryButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AddressType } from '@/types/client.types';
import {  Edit, MapPinned } from 'lucide-react'
import Image from 'next/image';
import React from 'react'
import { AddressesLoaderSkeleton } from './AddressesLoaderSkeleton';

type Props = {
  addresses: AddressType[];
  isParentLoading: boolean;
}

const AddressesPreview = ({ addresses, isParentLoading }: Props) => {
  if (isParentLoading) {
    return (
      <AddressesLoaderSkeleton />
    )
  }

  if (addresses?.length === 0) {
    return (
      <div className="w-full h-[287px] rounded-sm shadow-md p-4 bg-white">
        <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><MapPinned size={18} className='text-indigo-400' /> Addresses Information</h1>
        <div className="mt-4 w-full h-max border-slate-200 pl-6 p-2 flex flex-col items-center justify-center gap-4 ">
          <Image height={200} width={200} src={"/images/no-data.png"} alt='no data found!' />
          <PrimaryButton
            text='Add Addresses'
            animation='animate-bounce'
            icon={Edit}

          />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-[287px] rounded-sm shadow-md p-4 bg-white overflow-y-scroll">
      <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><MapPinned size={18} className='text-indigo-400' /> Addresses Information</h1>
      <div className="mt-2 w-full">
        <Accordion type="single" collapsible className="w-full" defaultValue='item-1'>
          {
            addresses.map(({ address, belongs_to, city, phone_number, zip_code }, index) => (
              <AccordionItem value={`item-${index + 1}`} key={index}>
                <AccordionTrigger className='text-sm text-slate-600 font-bold'>{address}:</AccordionTrigger>
                <AccordionContent>
                  <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">belongs to:</p>
                    <CopyTooltip text={belongs_to || "Niet gespecificeerd"}>
                      <p className="text-sm text-slate-400 ">{belongs_to || "Niet gespecificeerd"}</p>
                    </CopyTooltip>
                  </div>
                  <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">city:</p>
                    <CopyTooltip text={city || "Niet gespecificeerd"}>
                      <p className="text-sm text-slate-400 ">{city || "Niet gespecificeerd"}</p>
                    </CopyTooltip>
                  </div>
                  <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">Phone number:</p>
                    <CopyTooltip text={phone_number || "Niet gespecificeerd"}>
                      <p className="text-sm text-slate-400 ">{phone_number || "Niet gespecificeerd"}</p>
                    </CopyTooltip>
                  </div>
                  <div className="flex items-center w-full py-2 border-b border-slate-200">
                    <p className="w-[40%] text-sm text-slate-600 font-bold">Postal:</p>
                    <CopyTooltip text={zip_code || "Niet gespecificeerd"}>
                      <p className="text-sm text-slate-400 ">{zip_code || "Niet gespecificeerd"}</p>
                    </CopyTooltip>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))
          }
        </Accordion>
      </div>
    </div>
  )
}

export default AddressesPreview