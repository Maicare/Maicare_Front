import React, { FunctionComponent } from "react";
// import DiagnosisSummary from "@/components/medicalRecordOverview/DiagnosisSummary";
// import MedicationsSummary from "@/components/medicalRecordOverview/MedicationsSummary";
// import AllergiesSummary from "@/components/medicalRecordOverview/AllergiesSummary";
type Props = {

};

const ClientMedicalRecordSummary: FunctionComponent<Props> = () => {
  return (
    <div>
      <h2 className="py-2 px-4 text-sm font-medium uppercase">ALLERGIEËN</h2>
      <div>Geen geregistreerde allergie voor cliënt</div>
      {/* <AllergiesSummary clientId={clientId} count={2} /> */}
      <div className="border-stroke w-full border-t my-4" />
      <h2 className="py-2 px-4 text-sm font-medium uppercase">DIAGNOSE</h2>
      <div>Geen diagnose gevonden</div>
      {/* <DiagnosisSummary clientId={clientId} /> */}
      <div className="border-stroke w-full border-t my-4" />
      <h2 className="py-2 px-4 text-sm font-medium uppercase">MEDICATIE</h2>
      <div>Geen medicatie geregistreerd voor cliënt</div>
      {/* <MedicationsSummary clientId={clientId} count={2} /> */}
    </div>
  );
};

export default ClientMedicalRecordSummary;
