import { FunctionComponent } from "react";
import { redirect } from "next/navigation";

const Page: FunctionComponent = () => {
  redirect("client-network/involved-employees");
};

export default Page;
