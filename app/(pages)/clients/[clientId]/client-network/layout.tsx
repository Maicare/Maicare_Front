import ClientNetworkTabs from "@/components/client-network/ClientNetworkTabs";
import React, { FunctionComponent, PropsWithChildren } from "react";

type Props = {
  children: React.ReactNode;
};

const MedicalRecordLayout: FunctionComponent<PropsWithChildren<Props>> = ({
  children,
}) => {
  return (
    <div className="bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
      <ClientNetworkTabs />
      {children}
    </div>
  );
};

export default MedicalRecordLayout;
