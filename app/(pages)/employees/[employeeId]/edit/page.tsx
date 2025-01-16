"use client";

import EmployeeForm from "@/components/employee/EmployeeForm";
import React from "react";
import { useParams } from "next/navigation";
import Loader from "@/components/common/loader";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

const UpdateEmployee: React.FC = () => {
  const params = useParams();
  const employeeIdParam = params?.employeeId;
  const employeeId = employeeIdParam ? parseInt(employeeIdParam as string, 10) : null;

  if (!employeeId) {
    return <Loader />;
  }

  return (
    <>
      <Breadcrumb pageName="Medewerker Bijwerken" />
      <EmployeeForm employeeId={employeeId} />
    </>
  )
};

export default UpdateEmployee;


