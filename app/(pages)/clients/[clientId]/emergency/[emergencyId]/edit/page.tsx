'use client';
import EmergencyContactForm from "@/components/client-network/EmergencyContactForm";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import { useParams } from "next/navigation";
import React, { FunctionComponent } from "react";

const UpdateEmergencyContact: FunctionComponent = () => {

  const params = useParams();
  const clientId = params?.clientId?.toString();
  const emergencyId = params?.emergencyId?.toString();

  return (
    <>
      <Breadcrumb pageName="Bijwerken noodcontact" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-slate-800  dark:text-white">Bijwerken noodcontact</h3>
            </div>
            <EmergencyContactForm clientId={clientId} emergencyId={emergencyId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateEmergencyContact;
