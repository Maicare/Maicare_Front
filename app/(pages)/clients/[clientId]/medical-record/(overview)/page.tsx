"use client";

import React, { FunctionComponent } from "react";
import Panel from "@/components/common/Panel/Panel";
import LinkButton from "@/components/common/Buttons/LinkButton";
import AllergiesSummary from "@/components/medical-record/AllergiesSummary";
import DiagnosisSummary from "@/components/medical-record/DiagnosisSummary";
import MedicationsSummary from "@/components/medical-record/MedicationsSummary";
import { useParams } from "next/navigation";

const Page: FunctionComponent = () => {
  const params = useParams();
  const clientIdParam = params?.clientId;
  const clientId = clientIdParam as string;

  if (!clientId) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
      <div className="flex flex-col gap-9">
        <Panel
          title={"Diagnose"}
          containerClassName="px-7 py-4"
          sideActions={
            <LinkButton
              text={"Volledige Diagnosegeschiedenis"}
              href={`medical-record/diagnosis`}
            />
          }
        >
          <DiagnosisSummary clientId={parseInt(clientId)} />
        </Panel>
        <Panel
          title={"Medicatie"}
          containerClassName="px-7 py-4"
          sideActions={
            <LinkButton
              text={"Volledige Medicatielijst"}
              href={`medical-record/medications`}
            />
          }
        >
          <MedicationsSummary clientId={parseInt(clientId)} />
        </Panel>
      </div>
      <div className="flex flex-col gap-9">
        <Panel
          title={"Allergieën"}
          containerClassName="px-7 py-4"
          sideActions={
            <LinkButton
              text={"Volledige Allergielijst"}
              href={`medical-record/allergies`}
            />
          }
        >
          <AllergiesSummary clientId={parseInt(clientId)} />
        </Panel>
        {/* <Panel
          title={"Episodes"}
          containerClassName="px-7 py-4"
          sideActions={
            <LinkButton
              text={"Geschiedenis Emotionele Toestand"}
              href={`medical-record/episodes`}
            />
          }
        >
          <EpisodesSummary clientId={parseInt(clientId)} />
        </Panel> */}
      </div>
    </div>
  );
};

export default Page;
