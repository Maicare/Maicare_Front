"use client";

import { Building2, Calendar, Clock, Edit, FileText, User } from "lucide-react";
import { useParams } from "next/navigation";
import { useEmployee } from "@/hooks/employee/use-employee";
import { useEffect, useState } from "react";
import { EmployeeContract } from "@/schemas/employee.schema";
import { Id } from "@/common/types/types";
import Loader from "@/components/common/loader";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { formatDateToDutch } from "@/utils/timeFormatting";
import { EmployeeContractForm } from "./_components/employee-contract-form";
import PrimaryButton from "@/common/components/PrimaryButton";



const Page = () => {
  const { employeeId } = useParams();
  const { readEmployeeContract, updateEmployeeContract } = useEmployee({ autoFetch: false });
  const [employeeContract, setEmployeeContract] = useState<EmployeeContract | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [refetch, setRefetcg] = useState(false);
  const [edit, setEdit] = useState(false);
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
  }, [employeeId, refetch]);
  const onSubmit = async (values: EmployeeContract) => {
    try {
      await updateEmployeeContract(values, +employeeId!, { displayProgress: true, displaySuccess: true });
      setRefetcg(v => !v);
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
        defaultValues={employeeContract}
        toggleEdit={() => setEdit(false)}
      />
    )
  }
  const handleSubcontractorChange = (checked: boolean) => {
    if (!employeeContract) return;
    const updatedContract = { ...employeeContract, is_subcontractor: checked };
    setEmployeeContract(updatedContract);
    try {
      updateEmployeeContract(updatedContract, +employeeId!, { displayProgress: true, displaySuccess: true });
    } catch (error) {
      console.error(error);
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" />
            Employee Contract
          </h1>
          <Badge
            variant={employeeContract.is_subcontractor ? "outline" : "default"}
            className={employeeContract.is_subcontractor ? "bg-orange-100 text-orange-800 border-orange-300" : "bg-blue-100 text-blue-800"}
          >
            {employeeContract.is_subcontractor ? "Subcontractor" : "Employee"}
          </Badge>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">Employment Agreement</CardTitle>
                <CardDescription className="text-blue-100 mt-2">
                  Contract ID: #{employeeContract.id}
                </CardDescription>
              </div>
              <Building2 className="h-10 w-10 opacity-90" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="w-1/2 flex items-center justify-between mb-8 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <Label htmlFor="subcontractor-mode" className="text-lg font-medium text-gray-700">
                    Subcontractor Mode
                  </Label>
                </div>
                <Switch
                  id="subcontractor-mode"
                  checked={employeeContract.is_subcontractor}
                  onCheckedChange={handleSubcontractorChange}
                  className="data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-blue-500"
                />
              </div>
              <div className="flex items-center mb-8 p-4 rounded-lg">
                <PrimaryButton
                  text="Edit Contract"
                  icon={Edit}
                  animation="animate-bounce"
                  onClick={() => setEdit(true)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Contract Hours
                  </h3>
                  <div className="space-y-2">
                    {!employeeContract.is_subcontractor && (
                      <div className="p-3 bg-blue-50 rounded-md">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Fixed Hours:</span>
                          <Badge
                            variant="outline"
                            className={
                              employeeContract.contract_type === 'loondienst'
                                ? "bg-blue-100 text-blue-800 border-blue-300"
                                : "bg-orange-100 text-orange-800 border-orange-300"
                            }
                          >
                            {employeeContract.contract_hours}h/week
                          </Badge>
                        </div>
                      </div>
                    )}
                    {employeeContract.is_subcontractor && (
                      <div className="p-3 bg-blue-50 rounded-md">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Variable Hours:</span>
                          <Badge
                            variant="outline"
                            className={
                              employeeContract.contract_type === 'loondienst'
                                ? "bg-blue-100 text-blue-800 border-blue-300"
                                : "bg-orange-100 text-orange-800 border-orange-300"
                            }
                          >
                            {employeeContract.contract_hours}h/week
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Contract Dates
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium">{formatDateToDutch(employeeContract.contract_start_date, true)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">End Date:</span>
                      <span className="font-medium">{formatDateToDutch(employeeContract.contract_end_date, true)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Contract Type
                  </h3>
                  <div className="p-3 bg-blue-50 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Employment Type:</span>
                      <Badge
                        variant="outline"
                        className={
                          employeeContract.contract_type === 'loondienst'
                            ? "bg-blue-100 text-blue-800 border-blue-300"
                            : "bg-orange-100 text-orange-800 border-orange-300"
                        }
                      >
                        {employeeContract.contract_type}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-700 mb-3">Summary</h3>
                  <p className="text-gray-600 text-sm">
                    This contract is for a {employeeContract.is_subcontractor ? 'subcontractor' : 'regular employee'}
                    with a {employeeContract.contract_type} agreement. The {employeeContract.is_subcontractor ? 'subcontractor' : 'employee'}
                    is expected to work {employeeContract.fixed_contract_hours || employeeContract.variable_contract_hours} hours per week
                    {employeeContract.variable_contract_hours > 0 ? ' with variable scheduling' : ' with fixed hours'}.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>This document represents the official contract agreement. Please review all details carefully.</p>
        </div>
      </div>
    </div>
  )
}

export default withAuth(
  withPermissions(Page, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewEmployeeContract, // TODO: Add correct permission
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);