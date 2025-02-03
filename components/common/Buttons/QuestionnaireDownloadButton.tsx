// import { useState } from "react";
// import { Download, LoaderCircle, Printer } from "lucide-react";
// import { getQuestionnaireTemplate } from "@/utils/questionnairs/templates/getQuestionnaireTemplate";
// import IconButton from "./IconButton";

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

// type QuestionnaireDownloadButtonProps = {
//   type: TemplateType;
//   questId: number;
// };

export default function QuestionnaireDownloadButton() {
  //   type,
  //   questId,
  // }: QuestionnaireDownloadButtonProps) {
  // const [isPrintTemplateLoading, setIsPrintTemplateLoading] = useState(false);
  // const [pdfTemplate, setPdfTemplate] = useState<string | null>();

  // const handlePrintQuestionnaire = () => {
  //   if (pdfTemplate) {
  //     // open in a new tab
  //     var link = document.createElement("a");
  //     link.href = pdfTemplate;
  //     link.target = "_blank";
  //     link.download = pdfTemplate;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   } else {
  //     setIsPrintTemplateLoading(true);
  //     getQuestionnaireTemplate({ questionnaireId: questId, templateType: type })
  //       .then(({ link }) => {
  //         setPdfTemplate(link);
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       })
  //       .finally(() => {
  //         setIsPrintTemplateLoading(false);
  //       });
  //   }
  // };

  return (
    <>
      {/* {!pdfTemplate && !isPrintTemplateLoading && (
        <IconButton
          className="bg-strokedark"
          onClick={() => {
            // handlePrintQuestionnaire();
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
            // handlePrintQuestionnaire();
          }}
        >
          <Download className="w-5 h-5" />
        </IconButton>
      )} */}
    </>
  );
}
