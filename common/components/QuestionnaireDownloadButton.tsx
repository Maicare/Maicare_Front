import { useState } from "react";
import { Download, LoaderCircle, Printer } from "lucide-react";
import IconButton from "@/components/common/Buttons/IconButton";

export type TemplateType =
  | "risk_assessment"
  | "collaboration_agreement"
  | "consent_declaration"
  | "data_sharing_statement"
  | "incident_report"
  | "maturity_matrix"
  | "client_details"
  | "goals_and_objectives_content"
  | "multi_maturity_matrix"
  | "appointment_card"
  | "youth_care_application"
  | "youth_care_intake"
  | "force_development_analysis"
  | "stress_management_plan";


export default function QuestionnaireDownloadButton() {
  const [isPrintTemplateLoading] = useState(false);
  const [pdfTemplate] = useState<string | null>();

  const handlePrintQuestionnaire = () => {
  };

  return (
    <>
      {!pdfTemplate && !isPrintTemplateLoading && (
        <IconButton
          className="bg-strokedark"
          onClick={() => {
            handlePrintQuestionnaire();
          }}
        >
          <Printer className="w-5 h-5" />
        </IconButton>
      )}
      {!pdfTemplate && isPrintTemplateLoading && (
        <IconButton className="bg-strokedark">
          <LoaderCircle className="w-5 h-5 animate-spin" />
        </IconButton>
      )}
      {pdfTemplate && (
        <IconButton
          className="bg-strokedark"
          onClick={() => {
            handlePrintQuestionnaire();
          }}
        >
          <Download className="w-5 h-5" />
        </IconButton>
      )}
    </>
  );
}
