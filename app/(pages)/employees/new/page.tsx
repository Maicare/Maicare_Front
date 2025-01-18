import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import EmployeeForm from "@/components/employee/EmployeeForm";
import React, { FunctionComponent } from "react";

const NewEmployeePage: FunctionComponent = () => {
  return (
    <>
      <Breadcrumb pageName="Medewerker Aanmaken" />
      <EmployeeForm />
    </>
  );
};

export default NewEmployeePage;
