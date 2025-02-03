import { FunctionComponent } from "react";
import { redirect } from "next/navigation";

const Page: FunctionComponent = (_props) => {
  redirect("reports-record/reports");
};

export default Page;
