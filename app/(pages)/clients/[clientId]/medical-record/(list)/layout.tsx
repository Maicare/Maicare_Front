import MedicalHistoryTabs from "@/components/medical-record/MedicalHistoryTabs";
import React, { FunctionComponent, PropsWithChildren } from "react";

const MedicalRecordLayout: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  return (
    <div className="bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
      <MedicalHistoryTabs />
      {children}
    </div>
  );
};

export default MedicalRecordLayout;
