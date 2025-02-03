import { FunctionComponent } from "react";
import { redirect } from "next/navigation";

const Page: FunctionComponent = (_props) => {
  redirect("reports/new");
};

export default Page;
