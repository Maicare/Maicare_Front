"use client";
import { Id } from '@/common/types/types';
import { useEmployee } from '@/hooks/employee/use-employee';
import { EmployeeDetailsResponse } from '@/types/employee.types';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import CertificationPreview from './_components/CertificationPreview';
import EducationPreview from './_components/EducationPreview';
import ExperiencePreview from './_components/ExperiencePreview';
import PersonalInformation from './_components/PersonalInformation';
import WorkInformation from './_components/WorkInformation';
import ProfileInformation from './_components/ProfileInformation';
import withAuth, { AUTH_MODE } from '@/common/hocs/with-auth';
import withPermissions from '@/common/hocs/with-permissions';
import Routes from '@/common/routes';
import { PermissionsObjects } from '@/common/data/permission.data';

const Page = () => {
  const { employeeId } = useParams();

  const { readOne } = useEmployee({ autoFetch: false });
  const [employee, setEmployee] = useState<EmployeeDetailsResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchEmployee = async (id: Id) => {
      setIsLoading(true);
      const data = await readOne(id);
      setEmployee(data);
      setIsLoading(false);
    }
    if (employeeId) fetchEmployee(+employeeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  return (
    <div className='flex flex-col gap-4'>
      <div className="flex items-start gap-4 w-full">
        <ProfileInformation 
          date_of_birth={employee?.date_of_birth || ""}
          first_name={employee?.first_name || ""}
          last_name={employee?.last_name || ""}
          gender={employee?.gender || ""}
          isParentLoading={isLoading}
          profile_picture={employee?.profile_picture || ""}
          role_id={employee?.role_id || 0}
        />
        <PersonalInformation
          email={employee?.email || ""}
          first_name={employee?.first_name || ""}
          last_name={employee?.last_name || ""}
          isParentLoading={isLoading}
          location_id={employee?.location_id || 0}
          private_phone_number={employee?.private_phone_number || ""}
        />
        <WorkInformation 
          department={employee?.department || "Niet gespecificeerd"}
          position={employee?.position || "Niet gespecificeerd"}
          employee_number={employee?.employee_number || "Niet gespecificeerd"}
          employment_number={employee?.employment_number || "Niet gespecificeerd"}
          private_email_address={employee?.private_email_address || "Niet gespecificeerd"}
          work_phone_number={employee?.work_phone_number || "Niet gespecificeerd"}
          isParentLoading={isLoading}
        />
      </div>
      <div className="flex items-start gap-4 w-full">
        <CertificationPreview employeeId={employeeId as string} />
        <EducationPreview employeeId={employeeId as string} />
        <ExperiencePreview employeeId={employeeId as string} />
      </div>
    </div>
  )
}

export default withAuth(
  withPermissions(Page, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permission
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login } 
    );