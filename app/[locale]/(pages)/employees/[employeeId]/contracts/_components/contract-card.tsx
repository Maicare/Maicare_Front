"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateToDutch } from "@/utils/timeFormatting";
import { EmployeeContract } from "@/schemas/employee.schema";
import PrimaryButton from "@/common/components/PrimaryButton";
import { Edit } from "lucide-react";



interface ContractCardProps {
  contract: EmployeeContract;
  toggleEdit: () => void;
}

export function ContractCard({ contract,toggleEdit }: ContractCardProps) {


  // Determine contract type color 'full_time'| 'part_time'| 'temporary'| 'subcontractor'| 'no_type'
  const getContractTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'full_time': return 'bg-emerald-100 text-emerald-800';
      case 'part_time': return 'bg-amber-100 text-amber-800';
      case 'temporary': return 'bg-purple-100 text-purple-800';
      case 'subcontractor': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full bg-white max-w-md border-0 shadow-lg overflow-hidden transition-all hover:shadow-xl">
      {/* Header with gradient background */}
      <CardHeader className={`bg-gradient-to-r from-indigo-500 to-purple-600 p-6`}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white text-2xl font-bold">
            Contract
          </CardTitle>
          <Badge className={`${getContractTypeColor(contract.contract_type)}`}>
            {contract.contract_type.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {/* Date Range */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 bg-indigo-50 p-4 rounded-lg">
            <p className="text-xs text-indigo-500 font-medium">START DATE</p>
            <p className="text-indigo-900 font-semibold">
              {formatDateToDutch(contract.contract_start_date,true)}
            </p>
          </div>
          <div className="flex-1 bg-purple-50 p-4 rounded-lg">
            <p className="text-xs text-purple-500 font-medium">END DATE</p>
            <p className="text-purple-900 font-semibold">
              {formatDateToDutch(contract.contract_end_date,true)}
            </p>
          </div>
        </div>

        {/* Hours Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-amber-50 p-4 rounded-lg">
            <p className="text-xs text-amber-500 font-medium">FIXED HOURS</p>
            <p className="text-amber-900 font-bold text-xl">
              {contract.contract_hours}h
            </p>
          </div>

        </div>

        {/* Status Indicator */}
        <div className="pt-2">
          <div className="flex items-center">
            <span className={`h-2 w-2 rounded-full ${
              new Date(contract.contract_end_date) > new Date() 
                ? 'bg-green-500' 
                : 'bg-red-500'
            } mr-2`}></span>
            <span className="text-sm text-gray-600">
              {new Date(contract.contract_end_date) > new Date()
                ? 'Active contract'
                : 'Expired contract'}
            </span>
            <PrimaryButton
              className="ml-auto"
              onClick={() => toggleEdit()}
              text="Edit Contract"
              icon={Edit}
              />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}