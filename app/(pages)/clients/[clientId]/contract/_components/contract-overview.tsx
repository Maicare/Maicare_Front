import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, Clock, Euro, Percent, User,  Clipboard, Download, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Contract } from "@/schemas/contract.schema";

export function ContractOverview({ contract }: { contract: Contract&{type_name:string;sender_name:string;client_first_name:string;client_last_name:string;} }) {
  // Color schemes
  const statusColors = {
    draft: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
    approved: "bg-green-50 text-green-800 border-green-200 hover:bg-green-100",
    terminated: "bg-red-50 text-red-800 border-red-200 hover:bg-red-100",
    stoped: "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100",
  };

  const careTypeColors = {
    ambulante: "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100",
    accommodation: "bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100",
  };

  const sectionColors = {
    terms: "from-blue-50 to-blue-100",
    financing: "from-purple-50 to-purple-100",
    metadata: "from-green-50 to-green-100",
    departure: "from-red-50 to-red-100",
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight drop-shadow-md">
              {contract.care_name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge className={`${statusColors[contract.status]} backdrop-blur-sm capitalize`}>
                {contract.status}
              </Badge>
              <Badge className={`${careTypeColors[contract.care_type]} backdrop-blur-sm capitalize`}>
                {contract.care_type}
              </Badge>
              <span className="text-sm bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                Contract #{contract.id}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 border-white/20 backdrop-blur-sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" className="bg-white text-blue-600 hover:bg-white/90 shadow-sm">
              <Clipboard className="h-4 w-4 mr-2" />
              Copy Details
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Contract Terms - Gradient Card */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-all bg-white">
            <CardHeader className={`bg-gradient-to-r ${sectionColors.terms} rounded-t-lg`}>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <FileText className="h-5 w-5" />
                Contract Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mt-1">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium text-blue-800">{formatDate(contract.start_date)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mt-1">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="font-medium text-blue-800">
                      {contract.end_date ? formatDate(contract.end_date) : (
                        <span className="text-amber-600">Open-ended</span>
                      )}
                    </p>
                  </div>
                </div>

                {contract.care_type === "ambulante" && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mt-1">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Hours</p>
                      <p className="font-medium text-blue-800">
                        {contract.hours} <span className="capitalize">{contract.hours_type}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mt-1">
                    <Euro className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-medium text-blue-800">
                      <span className="text-lg">€{contract.price.toFixed(2)}</span> per{" "}
                      <span className="capitalize">{contract.price_time_unit}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mt-1">
                    <Percent className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">VAT</p>
                    <p className="font-medium text-blue-800">{contract.VAT}%</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mt-1">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reminder Period</p>
                    <p className="font-medium text-blue-800">{contract.reminder_period} days</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financing Details - Gradient Card */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-all bg-white">
            <CardHeader className={`bg-gradient-to-r ${sectionColors.financing} rounded-t-lg`}>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Euro className="h-5 w-5" />
                Financing Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600 mt-1">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Financing Act</p>
                    <p className="font-medium text-purple-800">{contract.financing_act}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600 mt-1">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Financing Option</p>
                    <p className="font-medium text-purple-800">{contract.financing_option}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600 mt-1">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Client</p>
                    <p className="font-medium text-purple-800">{contract.client_first_name + " " + contract.client_last_name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600 mt-1">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sender</p>
                    <p className="font-medium text-purple-800">{contract.sender_name}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Metadata - Gradient Card */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-all bg-white">
            <CardHeader className={`bg-gradient-to-r ${sectionColors.metadata} rounded-t-lg`}>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <FileText className="h-5 w-5" />
                Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg text-green-600 mt-1">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p className="font-medium text-green-800">{formatDate(contract.created_at)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg text-green-600 mt-1">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium text-green-800">{formatDate(contract.updated_at)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg text-green-600 mt-1">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type ID</p>
                  <p className="font-medium text-green-800">{contract.type_id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachments - Gradient Card */}
          {(contract.attachment_ids??[]).length > 0 && (
            <Card className="border-0 shadow-sm hover:shadow-md transition-all bg-white">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <FileText className="h-5 w-5" />
                  Attachments ({(contract.attachment_ids??[]).length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-2">
                {(contract.attachment_ids??[]).map((attachment, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                        <FileText className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-amber-800">{attachment}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-amber-600" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Departure Info - Gradient Card */}
          {(contract.departure_reason || contract.departure_report) && (
            <Card className="border-0 shadow-sm hover:shadow-md transition-all bg-white">
              <CardHeader className={`bg-gradient-to-r ${sectionColors.departure} rounded-t-lg`}>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <User className="h-5 w-5" />
                  Departure Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {contract.departure_reason && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-100 rounded-lg text-red-600 mt-1">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Reason</p>
                      <p className="font-medium text-red-800">{contract.departure_reason}</p>
                    </div>
                  </div>
                )}
                {contract.departure_report && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-100 rounded-lg text-red-600 mt-1">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Report</p>
                      <p className="font-medium text-red-800">{contract.departure_report}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}