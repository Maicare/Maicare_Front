"use client";

import React, { FunctionComponent } from "react";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import { useParams } from "next/navigation";
import InvolvedEmployeeForm from "@/components/client-network/InvolvedEmployeeForm";

const NewInvolved: FunctionComponent = () => {

  const params = useParams();
  const clientId = params?.clientId?.toString();


  return (
    <>
      <Breadcrumb pageName="Cliënttoewijzing" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-slate-800  dark:text-white">
                Voeg medewerker toe aan cliënt
              </h3>
            </div>
            <InvolvedEmployeeForm clientId={clientId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default NewInvolved;
