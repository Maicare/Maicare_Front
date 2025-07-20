"use client";

import { Handshake } from "lucide-react";
import { ContractCard } from "./_components/contract-card";
import { useParams } from "next/navigation";
import { useEmployee } from "@/hooks/employee/use-employee";
import { useEffect, useState } from "react";
import { EmployeeContract } from "@/schemas/employee.schema";
import { Id } from "@/common/types/types";
import Loader from "@/components/common/loader";
import { EmployeeContractForm } from "./_components/employee-contract-form";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";

const exampleContract:EmployeeContract = {
    contract_end_date: "2025-12-31",
    contract_start_date: "2023-01-15",
    contract_type: 'loondienst',
    fixed_contract_hours: 40,
    id: 12345,
    variable_contract_hours: 10
};

const Page = () => {
    const { employeeId } = useParams();
    const { readEmployeeContract, updateEmployeeContract } = useEmployee({ autoFetch: false });
    const [employeeContract, setEmployeeContract] = useState<EmployeeContract | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [refetch,setRefetcg] = useState(false);
    const [edit,setEdit] = useState(false);
    useEffect(() => {
        const fetchEmployeeContract = async (id: Id) => {
            try {
                setIsLoading(true);
                const data = await readEmployeeContract(id);
                setEmployeeContract(data);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);

            }
        }
        if (employeeId) fetchEmployeeContract(+employeeId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employeeId,refetch]);
    const onSubmit = async (values: EmployeeContract) => {
        try {
            await updateEmployeeContract(values, +employeeId!, { displayProgress: true, displaySuccess: true });
            setRefetcg(v=>!v);
            setEdit(false);
        } catch (error) {
            console.log(error);
        }
    }
    if (isLoading) {
        return <div className="w-full h-full min-h-screen flex items-center justify-center">
            <Loader />
        </div>
    }
    if (!employeeContract || edit) {
        return (
            <EmployeeContractForm
                onSubmit={onSubmit}
                defaultValues={employeeContract ?? exampleContract}
                toggleEdit={() => setEdit(false)}
            />
        )
    }
    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'>
                    <Handshake size={24} className='text-indigo-400' />  Contracten
                </h1>
            </div>
            <ContractCard contract={employeeContract} toggleEdit={()=>setEdit(true)} />
            {/* Add more contracts as needed */}
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