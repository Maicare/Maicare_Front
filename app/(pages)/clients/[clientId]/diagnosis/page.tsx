import { FunctionComponent } from "react";
import { redirect } from "next/navigation";

const Page: FunctionComponent = (props) => {
  redirect("medical-record/diagnosis");
};

export default Page;
