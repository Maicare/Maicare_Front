"use client";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { ClockIcon, CalendarIcon, DollarSignIcon, FileTextIcon, UserIcon, Building2Icon } from "lucide-react"
import { ContractCardSkeleton } from "./contract-card-skeleton";

interface ContractCardProps {
  contract: {
    id: number
    client_id: number
    status: "draft" | "approved" | "terminated" | "stoped"
    start_date: string
    end_date?: string
    price: number
    price_time_unit: "daily" | "weekly" | "monthly" | "minute" | "hourly"
    care_name: string
    care_type: "ambulante" | "accommodation"
    financing_act: "WMO" | "ZVW" | "WLZ" | "JW" | "WPG"
    financing_option: "ZIN" | "PGB"
    created_at: string
    sender_id: number
    sender_name: string
    client_first_name: string
    client_last_name: string
  }|null;
}

export function ContractCard({ contract }: ContractCardProps) {
    if (!contract) return <ContractCardSkeleton />;
  // Status color mapping
  const statusColors = {
    draft: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    approved: "bg-green-100 text-green-800 hover:bg-green-200",
    terminated: "bg-red-100 text-red-800 hover:bg-red-200",
    stoped: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  }

  // Format price with unit
  const formatPrice = () => {
    const unitMap = {
      daily: "/day",
      weekly: "/week",
      monthly: "/month",
      minute: "/min",
      hourly: "/hour",
    }
    return `€${contract.price.toFixed(2)}${unitMap[contract.price_time_unit]}`
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-sm bg-gray-800/10">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FileTextIcon className="h-5 w-5 text-primary" />
              <span className="truncate">{contract.care_name}</span>
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge className={statusColors[contract.status]}>
                {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
              </Badge>
              <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                {contract.care_type}
              </Badge>
              <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700">
                {contract.financing_act}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground">Contract</span>
            <span className="font-mono font-medium">#{contract.id}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Client Section */}
        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex-shrink-0">
            <Avatar className="h-10 w-10 bg-blue-100 border-2 border-blue-200">
              <AvatarImage src={`/clients/${contract.client_id}.jpg`} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                {`${contract.client_first_name[0]}${contract.client_last_name[0]}`}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-blue-600" />
              <h3 className="font-medium text-blue-800">Client</h3>
            </div>
            <p className="text-sm font-medium">
              {contract.client_first_name} {contract.client_last_name}
            </p>
            <div className="mt-1 text-xs text-blue-600 flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-100 rounded-full">
                {contract.financing_option}
              </span>
            </div>
          </div>
        </div>

        {/* Sender Section */}
        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
          <div className="flex-shrink-0">
            <Avatar className="h-10 w-10 bg-green-100 border-2 border-green-200">
              <AvatarImage src={`/senders/${contract.sender_id}.jpg`} />
              <AvatarFallback className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                {contract.sender_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Building2Icon className="h-4 w-4 text-green-600" />
              <h3 className="font-medium text-green-800">Provider</h3>
            </div>
            <p className="text-sm font-medium">{contract.sender_name}</p>
            <div className="mt-1 text-xs text-green-600 flex items-center gap-2">
              <span className="px-2 py-1 bg-green-100 rounded-full">
                Care Provider
              </span>
            </div>
          </div>
        </div>

        {/* Contract Details */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-2 text-sm">
            <DollarSignIcon className="h-4 w-4 text-amber-600" />
            <div>
              <p className="text-muted-foreground">Rate</p>
              <p className="font-medium">{formatPrice()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <ClockIcon className="h-4 w-4 text-indigo-600" />
            <div>
              <p className="text-muted-foreground">Period</p>
              <p className="font-medium">
                {contract.price_time_unit}
              </p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="border-t border-white pt-3 mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-purple-600" />
            <div>
              <p className="text-muted-foreground">Start Date</p>
              <p className="font-medium">
                {format(new Date(contract.start_date), "PPP")}
              </p>
            </div>
          </div>
          {contract.end_date && (
            <div className="flex items-center gap-2 text-sm mt-2">
              <CalendarIcon className="h-4 w-4 text-rose-600" />
              <div>
                <p className="text-muted-foreground">End Date</p>
                <p className="font-medium">
                  {format(new Date(contract.end_date), "PPP")}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-0">
        <div className="text-xs text-muted-foreground">
          Created: {format(new Date(contract.created_at), "PP")}
        </div>
        <div className="text-xs font-medium">
          {contract.status === 'approved' && (
            <span className="text-green-600">Active</span>
          )}
          {contract.status === 'terminated' && (
            <span className="text-red-600">Ended</span>
          )}
          {contract.status === 'stoped' && (
            <span className="text-gray-600">Paused</span>
          )}
          {contract.status === 'draft' && (
            <span className="text-yellow-600">Draft</span>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}