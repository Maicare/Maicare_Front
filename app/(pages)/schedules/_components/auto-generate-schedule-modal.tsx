"use client"

import { useState } from "react"
import { Calendar, Users, Clock, Target, Zap, CheckCircle2, AlertCircle, X, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MultiSelect } from "./multi-select"
import { useSchedule } from "@/hooks/schedule/use-schedule"
import { useEmployee } from "@/hooks/employee/use-employee"
import { Id } from "@/common/types/types"
import { useLocation } from "@/hooks/location/use-location"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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

interface AutoGenerateScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onScheduleGenerated?: (schedule: ScheduleResponse) => void;
}

export default function AutoGenerateScheduleModal({
    isOpen,
    onClose,
    onScheduleGenerated
}: AutoGenerateScheduleModalProps) {
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
    const [locationId, setLocationId] = useState<number>(0);
    const [week, setWeek] = useState<number>(new Date().getWeek())
    const [year, setYear] = useState<number>(new Date().getFullYear())
    const [isGenerating, setIsGenerating] = useState(false)
    const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
    const { autoGenerateSchedule, saveGeneration } = useSchedule();
    const { locations } = useLocation({ autoFetch: true });
    const { employees } = useEmployee({ autoFetch: true });
    const employeeOptions = (employees?.results || [])?.map(emp => ({
        label: `${emp.first_name} ${emp.last_name}`,
        value: emp.id
    }))

    const handleGenerateSchedule = async () => {
        setIsGenerating(true)

        const requestData: AutoGenerateRequest = {
            employee_ids: selectedEmployees,
            location_id: locationId,
            week,
            year
        }

        try {
            const response = await autoGenerateSchedule(requestData);
            setSchedule(response);
            onScheduleGenerated?.(response);
        } catch (error) {
            console.error('Fout bij genereren rooster:', error)
        } finally {
            setIsGenerating(false)
        }
    }

    const formatTime = (time: string) => {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString('nl-NL', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: false
        })
    }

    const handleClose = () => {
        setSchedule(null);
        setSelectedEmployees([]);
        onClose();
    }

    // Dagnamen voor de kalenderkop
    const dayNames = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];

    // Groepeer diensten per datum voor het kalendergrid
    const shiftsByDate = schedule?.shifts.reduce((acc, shift) => {
        if (!acc[shift.date]) {
            acc[shift.date] = [];
        }
        acc[shift.date].push(shift);
        return acc;
    }, {} as Record<string, Shift[]>) || {};

    // Haal alle datums op uit het rooster of genereer voor de huidige week
    const scheduleDates = schedule?.grid_view?.dates || [];
    const displayDates = scheduleDates.length > 0 ? scheduleDates : generateWeekDates(week, year);

    function generateWeekDates(week: number, year: number): string[] {
        const firstDayOfYear = new Date(year, 0, 1);
        const daysToFirstMonday = firstDayOfYear.getDay() === 0 ? 1 : 8 - firstDayOfYear.getDay();
        const firstMonday = new Date(year, 0, daysToFirstMonday);
        const startDate = new Date(firstMonday);
        startDate.setDate(firstMonday.getDate() + (week - 1) * 7);

        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            dates.push(date.toISOString().split('T')[0]);
        }
        return dates;
    }

    // Hulpfunctie om start- en einddatums voor een week te krijgen
    const getWeekDates = (weekNumber: number, year: number) => {
        const firstDayOfYear = new Date(year, 0, 1);
        const daysToFirstMonday = firstDayOfYear.getDay() === 0 ? 1 : 8 - firstDayOfYear.getDay();
        const firstMonday = new Date(year, 0, daysToFirstMonday);

        const startDate = new Date(firstMonday);
        startDate.setDate(firstMonday.getDate() + (weekNumber - 1) * 7);

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);

        return {
            start: startDate,
            end: endDate
        };
    };

    // Hulpfunctie om te controleren of een week de huidige datum bevat
    const isWeekInCurrentDateRange = (weekNumber: number, year: number) => {
        const today = new Date();
        const weekDates = getWeekDates(weekNumber, year);

        return today >= weekDates.start && today <= weekDates.end;
    };

    // Hulpfunctie om huidige weeknummer op basis van werkelijke datum te krijgen
    const _getCurrentWeekNumber = () => {
        const today = new Date();
        const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
        const pastDaysOfYear = (today.getTime() - firstDayOfYear.getTime()) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    };

    const handleSave = async () => {
        if (!schedule) return;
        try {
            await saveGeneration({ scheduled_shifts: schedule.shifts, location_id: locationId },{displayProgress:true,displaySuccess:true});
            handleClose();
        } catch (error) {
            console.error('Fout bij opslaan gegenereerd rooster:', error);
        }
    };

    const handleDiscard = () => {
        setSchedule(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] h-[70vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Zap className="h-6 w-6 text-indigo-600" />
                            Rooster Automatisch Genereren
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Configuratiekaart */}
                    <Card className="border-indigo-200">
                        <CardHeader className="bg-indigo-50 border-b border-indigo-100">
                            <CardTitle className="flex items-center gap-2 text-indigo-900">
                                <Calendar className="h-5 w-5" />
                                Roosterconfiguratie
                            </CardTitle>
                            <CardDescription>
                                Selecteer medewerkers en parameters voor automatische roostergeneratie
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Medewerker Selectie */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        Selecteer Medewerkers
                                    </label>
                                    <MultiSelect
                                        options={employeeOptions}
                                        selected={selectedEmployees}
                                        onChange={setSelectedEmployees}
                                        placeholder="Kies medewerkers..."
                                        className="w-full"
                                    />
                                </div>

                                {/* Locatie */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        Selecteer Locatie
                                    </label>
                                    <Select value={locationId.toString()} onValueChange={(e) => setLocationId(parseInt(e))} >
                                        <SelectTrigger className="w-full ">
                                            <SelectValue placeholder="Selecteer een locatie" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectGroup>
                                                <SelectLabel>Locaties</SelectLabel>
                                                {locations?.map((item, index) => (
                                                    <SelectItem key={index} value={item.id.toString()}>
                                                        {item.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Week en Jaar */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Weeknummer
                                    </label>
                                    <Select value={week.toString()} onValueChange={(value) => setWeek(Number(value))}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecteer een week" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60 bg-white">
                                            <SelectGroup>
                                                <SelectLabel>Weken van {year}</SelectLabel>
                                                {Array.from({ length: 52 }, (_, i) => i + 1).map((weekNum) => {
                                                    const weekDates = getWeekDates(weekNum, year);
                                                    const isCurrentWeek = isWeekInCurrentDateRange(weekNum, year);

                                                    return (
                                                        <SelectItem key={weekNum} value={weekNum.toString()} className="flex flex-col items-start py-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium">Week {weekNum}</span>
                                                                {isCurrentWeek && (
                                                                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                                                        Huidig
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                {weekDates.start.toLocaleDateString('nl-NL')} - {weekDates.end.toLocaleDateString('nl-NL')}
                                                            </div>
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Jaar
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
                                        Rooster Genereren...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="h-4 w-4 mr-2" />
                                        Genereer Rooster
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Resultatensectie */}
                    {schedule && (
                        <div className="space-y-6">
                            {/* Statuskaart */}
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
                                            <h3 className="font-semibold capitalize">{schedule.status === "optimized" ? "geoptimaliseerd" : schedule.status} Rooster</h3>
                                            <p className="text-sm text-gray-600">Week {schedule.week}, {schedule.year}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Samenvatting Kaarten */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                                                <p className="text-sm font-medium text-gray-600">Medewerkers</p>
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
                                                <p className="text-sm font-medium text-gray-600">Totaal Diensten</p>
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
                                                    {schedule.status === "optimized" ? "geoptimaliseerd" : schedule.status}
                                                </Badge>
                                            </div>
                                            <Target className="h-8 w-8 text-indigo-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Kalender Grid Weergave */}
                            <Card>
                                <CardHeader className="bg-indigo-50 border-b border-indigo-100">
                                    <CardTitle className="flex items-center gap-2 text-indigo-900">
                                        <Calendar className="h-5 w-5" />
                                        Rooster Kalender
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="border rounded-lg overflow-hidden">
                                        {/* Kalenderkop */}
                                        <div className="grid grid-cols-7 bg-gray-50 border-b">
                                            {dayNames.map((day, index) => {
                                                const date = displayDates[index];
                                                const displayDate = date ? new Date(date).getDate() : '';
                                                return (
                                                    <div key={index} className="p-3 text-center border-r last:border-r-0">
                                                        <div className="text-sm font-medium text-gray-600">{day}</div>
                                                        <div className="text-lg font-bold text-gray-900">{displayDate}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Kalenderlichaam */}
                                        <div className="grid grid-cols-7 min-h-[400px]">
                                            {dayNames.map((day, dayIndex) => {
                                                const date = displayDates[dayIndex];
                                                const dayShifts = date ? shiftsByDate[date] || [] : [];

                                                return (
                                                    <div key={dayIndex} className="border-r last:border-r-0 p-2 bg-white min-h-[100px]">
                                                        <div className="space-y-2">
                                                            {dayShifts.map((shift) => (
                                                                <div
                                                                    key={shift.shift_id}
                                                                    className="p-2 bg-indigo-50 border border-indigo-200 rounded text-xs"
                                                                >
                                                                    <div className="font-medium text-indigo-900">
                                                                        {shift.shift_name}
                                                                    </div>
                                                                    <div className="text-indigo-700">
                                                                        {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                                                                    </div>
                                                                    <div className="text-indigo-600 mt-1">
                                                                        {shift.employees.map(emp => (
                                                                            <div key={emp.employee_id} className="truncate">
                                                                                {emp.employee_name}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {dayShifts.length === 0 && (
                                                                <div className="text-center text-gray-400 text-xs py-4">
                                                                    Geen diensten
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Medewerker Samenvatting */}
                            <Card>
                                <CardHeader className="bg-indigo-50 border-b border-indigo-100">
                                    <CardTitle className="flex items-center gap-2 text-indigo-900">
                                        <Users className="h-5 w-5" />
                                        Medewerkeroverzicht
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Medewerker
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Doeluren
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Werkelijke Uren
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Afwijking
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
                                                            <div className="text-sm text-gray-900">{employee.target_hours}u</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{employee.actual_hours}u</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className={`text-sm font-medium ${employee.deviation >= 0
                                                                ? 'text-green-600'
                                                                : 'text-red-600'
                                                                }`}>
                                                                {employee.deviation >= 0 ? '+' : ''}{employee.deviation}u
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
                                                                {employee.status === "optimal" ? "optimaal" : 
                                                                 employee.status === "under" ? "onderbezet" : 
                                                                 employee.status}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actieknoppen */}
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex flex-col sm:flex-row gap-4 justify-end">
                                        <Button
                                            onClick={handleDiscard}
                                            variant="outline"
                                            className="flex items-center gap-2 border-red-200 text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Verwerp Rooster
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            <Save className="h-4 w-4" />
                                            Opslaan Rooster
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

// Voeg weeknummer utility toe aan Date prototype
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