"use client";
import React, { FunctionComponent } from "react";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import DiagnosisForm from "@/components/medical-record/DiagnosisForm";
import { useParams } from "next/navigation";

const NewDiagnostic: FunctionComponent = () => {

  const params = useParams();
  const clientId = params?.clientId?.toString();

  if (!clientId)
    return <></>

  return (
    <>
      <Breadcrumb pageName="Nieuwe Diagnose" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          {/* <!-- Diagnosis Form --> */}
          <div className="bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-slate-800  dark:text-white">
                Creëer een Nieuwe Diagnose
              </h3>
            </div>
            <DiagnosisForm clientId={clientId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default NewDiagnostic;
