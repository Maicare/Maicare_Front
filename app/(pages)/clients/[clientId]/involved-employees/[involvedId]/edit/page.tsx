"use client";

import InvolvedEmployeeForm from "@/components/client-network/InvolvedEmployeeForm";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import { useParams } from "next/navigation";
import React, { FunctionComponent } from "react";

const UpdateInvolved: FunctionComponent = () => {

  const params = useParams();
  const clientId = params?.clientId?.toString();
  const involvedId = params?.involvedId?.toString();

  return (
    <>
      <Breadcrumb pageName="Bijwerken betrokken medewerkers" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-slate-800  dark:text-white">
                Bijwerken betrokken medewerkers
              </h3>
            </div>
            <InvolvedEmployeeForm
              involvedId={involvedId}
              clientId={clientId}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateInvolved;
