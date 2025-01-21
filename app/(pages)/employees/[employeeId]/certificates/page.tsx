"use client";

import Loader from "@/components/common/loader";
import CertificationForm from "@/components/employee/certificates/CertificateForm";
import CertificatesList from "@/components/employee/certificates/CertificatesList";
import EmployeeBackground from "@/components/employee/EmployeeBackground";
import { useEmployee } from "@/hooks/employee/use-employee";
import { Certification } from "@/types/certification.types";
import { useParams } from "next/navigation";
import React, { FunctionComponent, useEffect, useState } from "react";


const CertificatesPage: FunctionComponent = () => {
  // const query = useListCertificates(+employeeId);
  const { readEmployeeCertificates } = useEmployee({ autoFetch: false });
  const params = useParams(); // Access the dynamic route params
  const { employeeId } = params;
  const [isLoading, setIsLoading] = useState(false);
  const [_isError, setIsError] = useState(false);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        setIsLoading(true);
        const data = await readEmployeeCertificates(Number(employeeId));
        setCertifications(data);
      } catch (error) {
        console.error(error);
        setIsError(true);
      } finally{
        setIsLoading(false);
      }
    };
    fetchCertifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  console.log({employeeId})

  if (!employeeId) {
    return null;
  }

  if (isLoading) {
    return <Loader />
  }
  if (!certifications && !isLoading) {
    return null;
  }

  return (
    <EmployeeBackground
      title={"Certificaten"}
      addButtonText={"+ Certificaat Toevoegen"}
      cancelText={"Toevoegen Certificaat Annuleren"}
      errorText={"Een fout trad op tijdens het ophalen van certificaten."}
      employeeId={+employeeId}
      query={certifications}
      ListComponent={CertificatesList}
      FormComponent={CertificationForm}
    />
  );
};

export default CertificatesPage;
