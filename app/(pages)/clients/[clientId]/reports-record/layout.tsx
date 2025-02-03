import ReportsHistoryTabs from "@/components/clients/reports/ReportsHistoryTabs";
import React, { FunctionComponent, PropsWithChildren } from "react";


const ReportsRecordLayout: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  return (
    <div className="bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
      <ReportsHistoryTabs />
      {children}
    </div>
  );
};

export default ReportsRecordLayout;
