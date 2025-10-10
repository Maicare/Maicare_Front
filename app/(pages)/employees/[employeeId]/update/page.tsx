"use client";

import { useParams, useRouter } from "next/navigation";
import UpsertEmployeeForm from "../_components/UpsertEmployeeForm";
import { useEmployee } from "@/hooks/employee/use-employee";
import { useEffect, useState } from "react";
import { EmployeeDetailsResponse } from "@/types/employee.types";
import { Id } from "@/common/types/types";
import EmployeeFormSkeleton from "../_components/UpsertEmployeeFormSkeleton";
import withPermissions from "@/common/hocs/with-permissions";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";


const Page = () => {
    const router = useRouter();
    const { employeeId } = useParams();

    const onSuccess = (id: number) => {
        router.push(`/employees/${id}`)
    }
    const onCancel = () => {
        router.back();
    }
    const { readOne } = useEmployee({ autoFetch: false });
    const [employee, setEmployee] = useState<EmployeeDetailsResponse | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
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
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-xl font-semibold">Medewerker bijwerken</h1>
                <p>Dashboard / <span className="font-medium text-indigo-500 hover:cursor-pointer">Medewerker bijwerken</span></p>
            </div>
            {
                (!employee || isLoading) ?
                    <EmployeeFormSkeleton />
                    :
                    <UpsertEmployeeForm
                        mode="update"
                        onSuccess={onSuccess}
                        defaultValues={employee}
                        onCancel={onCancel}
                    />
            }
        </div>
    )
}

export default withAuth(
  withPermissions(Page, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.UpdateEmployee, // TODO: Add correct permission
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login } 
    );