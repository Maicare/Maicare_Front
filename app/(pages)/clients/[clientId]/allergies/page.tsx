import { FunctionComponent } from "react";
import { redirect } from "next/navigation";

type Props = {
  params: { clientId: string };
};

const AllergiesPage: FunctionComponent<Props> = ({ params: { clientId } }) => {
  redirect(`/clients/${clientId}/medical-record/allergies`);
};

export default AllergiesPage;
