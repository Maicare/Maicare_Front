"use client"

import { useState } from "react"
import { Calendar, Users, Clock, Target, Zap, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MultiSelect } from "./_components/multi-select"
import { useSchedule } from "@/hooks/schedule/use-schedule"
import { useEmployee } from "@/hooks/employee/use-employee"
import { Id } from "@/common/types/types"
import { useLocation } from "@/hooks/location/use-location"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import AutoGenerateScheduleModal from "./_components/auto-generate-schedule-modal"
export interface Shift {
    shift_id: number;
    shift_name: string;
    start_time: string;
    end_time: string;
    hours: number;
    date: string;
    day_name: string;
    employees: {
        employee_id: string;
        employee_name: string;
    }[];
}
export interface Employee {
    id: string;
    first_name: string;
    last_name: string;
}


export interface EmployeeSummary {
    id: string;
    first_name: string;
    last_name: string;
    status: string;
    target_hours: number;
    actual_hours: number;
    deviation: number;
    shifts: Record<string, number>;
}

export interface GridView {
    dates: string[];
    days: string[];
    shifts_by_day: Record<string, Array<{
        date: string;
        shifts: Record<string, Shift[]>;
    }>>;
}

export interface ScheduleResponse {
    grid_view: GridView;
    shifts: Shift[];
    summary: EmployeeSummary[];
    status: string;
    week: number;
    year: number;

}

export interface AutoGenerateRequest {
    employee_ids: string[];
    location_id: number;
    week: number;
    year: number;
}

export default function AutoGenerateSchedulePage() {
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
    const [locationId, setLocationId] = useState<number>(0);
    const [week, setWeek] = useState<number>(new Date().getWeek())
    const [year, setYear] = useState<number>(new Date().getFullYear())
    const [isGenerating, setIsGenerating] = useState(false)
    const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
    const { autoGenerateSchedule } = useSchedule();
    const { locations } = useLocation({ autoFetch: true });
    const { employees } = useEmployee({ autoFetch: true });
    const employeeOptions = (employees?.results || [])?.map(emp => ({
        label: `${emp.first_name} ${emp.last_name}`,
        value: emp.id
    }))
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

    const handleGenerateSchedule = async () => {
        setIsGenerating(true)

        const requestData: AutoGenerateRequest = {
            employee_ids: selectedEmployees,
            location_id: locationId,
            week,
            year
        }

        try {
            // Replace with actual API call
            const response = await autoGenerateSchedule(requestData);
            setSchedule(response);
        } catch (error) {
            console.error('Error generating schedule:', error)
        } finally {
            setIsGenerating(false)
        }
    }

    const formatTime = (time: string) => {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Auto-Generate Schedule</h1>
                    <p className="text-gray-600 mt-2">
                        Create optimized schedules based on employee availability and shift requirements
                    </p>
                </div>
                <div className="flex items-center gap-2 text-indigo-600">
                    <Zap className="h-8 w-8" />
                    <span className="text-xl font-semibold">Smart Scheduler</span>
                </div>
            </div>

            <Button onClick={() => setIsScheduleModalOpen(true)}>
                Generate Schedule
            </Button>

            <AutoGenerateScheduleModal
                isOpen={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                onScheduleGenerated={(schedule) => {
                    // Handle the generated schedule if needed
                    console.log('Schedule generated:', schedule);
                }}
            />
            {/* Configuration Card */}
            <Card className="border-indigo-200">
                <CardHeader className="bg-indigo-50 border-b border-indigo-100">
                    <CardTitle className="flex items-center gap-2 text-indigo-900">
                        <Calendar className="h-5 w-5" />
                        Schedule Configuration
                    </CardTitle>
                    <CardDescription>
                        Select employees and parameters for automatic schedule generation
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Employee Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Select Employees
                            </label>
                            <MultiSelect
                                options={employeeOptions}
                                selected={selectedEmployees}
                                onChange={setSelectedEmployees}
                                placeholder="Choose employees..."
                                className="w-full"
                            />
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <Select value={locationId.toString()} onValueChange={(e) => setLocationId(parseInt(e))} >
                                <SelectTrigger className="w-[180px] dark:bg-[#18181b] dark:ring-offset-black focus:ring-indigo-800">
                                    <SelectValue placeholder="Selecteer een locatie" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-[#18181b] dark:border-black dark:text-white">
                                    <SelectGroup>
                                        <SelectLabel>Locaties</SelectLabel>
                                        {
                                            locations?.map((item, index) => (
                                                <SelectItem key={index} value={item.id.toString()} className="hover:bg-slate-100 dark:hover:bg-gray-500 cursor-pointer">{item.name}</SelectItem>
                                            ))
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Week and Year */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Week Number
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="52"
                                value={week}
                                onChange={(e) => setWeek(Number(e.target.value))}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Year
                            </label>
                            <input
                                type="number"
                                value={year}
                                onChange={(e) => setYear(Number(e.target.value))}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            />
                        </div>
                    </div>

                    <Button
                        onClick={handleGenerateSchedule}
                        disabled={isGenerating || selectedEmployees.length === 0}
                        className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        {isGenerating ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                Generating Schedule...
                            </>
                        ) : (
                            <>
                                <Zap className="h-4 w-4 mr-2" />
                                Generate Schedule
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Results Section */}
            {schedule && (
                <div className="space-y-6">
                    {/* Status Card */}
                    <Card className={`border-l-4 ${schedule.status === "optimized"
                        ? "border-green-500"
                        : "border-yellow-500"
                        }`}>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                {schedule.status === "optimized" ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                                )}
                                <div>
                                    <h3 className="font-semibold capitalize">{schedule.status} Schedule</h3>
                                    <p className="text-sm text-gray-600">{schedule.status}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Week</p>
                                        <p className="text-2xl font-bold text-indigo-600">
                                            {schedule.week}
                                        </p>
                                    </div>
                                    <Calendar className="h-8 w-8 text-indigo-400" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Employees</p>
                                        <p className="text-2xl font-bold text-indigo-600">
                                            {selectedEmployees.length}
                                        </p>
                                    </div>
                                    <Users className="h-8 w-8 text-indigo-400" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Shifts</p>
                                        <p className="text-2xl font-bold text-indigo-600">
                                            {schedule.shifts.length}
                                        </p>
                                    </div>
                                    <Clock className="h-8 w-8 text-indigo-400" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Status</p>
                                        <Badge className={
                                            schedule.status === "optimized"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-yellow-100 text-yellow-800"
                                        }>
                                            {schedule.status}
                                        </Badge>
                                    </div>
                                    <Target className="h-8 w-8 text-indigo-400" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Employee Summary */}
                    <Card>
                        <CardHeader className="bg-indigo-50 border-b border-indigo-100">
                            <CardTitle className="flex items-center gap-2 text-indigo-900">
                                <Users className="h-5 w-5" />
                                Employee Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Employee
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Target Hours
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actual Hours
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Deviation
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {schedule.summary.map((employee: EmployeeSummary) => (
                                            <tr key={employee.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {employee.first_name} {employee.last_name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{employee.target_hours}h</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{employee.actual_hours}h</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`text-sm font-medium ${employee.deviation >= 0
                                                        ? 'text-green-600'
                                                        : 'text-red-600'
                                                        }`}>
                                                        {employee.deviation >= 0 ? '+' : ''}{employee.deviation}h
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Badge className={
                                                        employee.status === "optimal"
                                                            ? "bg-green-100 text-green-800"
                                                            : employee.status === "under"
                                                                ? "bg-yellow-100 text-yellow-800"
                                                                : "bg-red-100 text-red-800"
                                                    }>
                                                        {employee.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shifts Grid */}
                    <Card>
                        <CardHeader className="bg-indigo-50 border-b border-indigo-100">
                            <CardTitle className="flex items-center gap-2 text-indigo-900">
                                <Clock className="h-5 w-5" />
                                Generated Shifts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {schedule.shifts.map((shift: Shift) => (
                                    <div
                                        key={shift.shift_id}
                                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-semibold text-gray-900">{shift.shift_name}</h4>
                                                <Badge variant="outline" className="text-indigo-700 border-indigo-200">
                                                    {shift.day_name}
                                                </Badge>
                                                <span className="text-sm text-gray-500">{shift.date}</span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                                                </span>
                                                <span>{shift.hours}h</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-gray-900">
                                                {shift.employees.length} employee(s)
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {shift.employees.map(emp => emp.employee_name).join(', ')}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

// Add week number utility to Date prototype
declare global {
    interface Date {
        getWeek(): number;
    }
}

Date.prototype.getWeek = function () {
    const date = new Date(this.getTime())
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7)
    const week1 = new Date(date.getFullYear(), 0, 4)
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7)
}