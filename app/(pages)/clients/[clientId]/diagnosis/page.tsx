import { FunctionComponent } from "react";
import { redirect } from "next/navigation";

const Page: FunctionComponent = () => {
  redirect("medical-record/diagnosis");
};

export default Page;
