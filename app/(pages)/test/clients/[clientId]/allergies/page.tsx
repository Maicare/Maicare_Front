"use client";
import { FunctionComponent } from "react";
import { redirect, useParams } from "next/navigation";

const AllergiesPage: FunctionComponent = () => {
  const params = useParams();
  const clientId = params?.clientId?.toString();

  redirect(`/clients/${clientId}/medical-record/allergies`);
};

export default AllergiesPage;
