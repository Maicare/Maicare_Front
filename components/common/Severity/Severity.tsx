import React, { FunctionComponent } from "react";
import { BadgeType } from "@/common/types/badge-type.types";
import StatusBadge from "../StatusBadge/StatusBadge";
import { DiagnosisSeverity } from "@/types/allergy.types";

type Props = {
  severity: DiagnosisSeverity;
};

const mappingRecord: Record<DiagnosisSeverity, BadgeType> = {
  Mild: "Success",
  Moderate: "Warning",
  Severe: "Danger",
};

const labelsRacord: Record<DiagnosisSeverity, string> = {
  Mild: "Mild",
  Moderate: "Matig",
  Severe: "Ernstig",
};

const Severity: FunctionComponent<Props> = ({ severity }) => {
  return (
    <StatusBadge text={labelsRacord[severity]} type={mappingRecord[severity]} />
  );
};

export default Severity;
