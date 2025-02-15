import { FunctionComponent } from "react";
import { redirect } from "next/navigation";

const MedicationsPage: FunctionComponent = () => {
  return redirect("medical-record/medications");
};

export default MedicationsPage;
