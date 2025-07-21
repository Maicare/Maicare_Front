"use client";

import LargeErrorMessage from "@/components/common/Alerts/LargeErrorMessage";
import Loader from "@/components/common/loader";
import { useWorkingHours } from "@/hooks/working-hours/use-working-hours";
import { Hourglass } from "lucide-react";
import { useParams } from "next/navigation";
import { WorkingHoursCard } from "./_components/working-hours-card";
import { useState } from "react";
import { useDebounce } from "@/hooks/common/useDebounce";
import Statistics from "./_components/Statistics";
import { Separator } from "@/components/ui/separator";
import { WeekSelector } from "./_components/week-selector";
import { getISOWeek, getISOWeekYear } from "date-fns";

const WorkingHoursPage = () => {
    const { employeeId } = useParams();
    
    // Initialize with current week and year
    const currentDate = new Date();
    const currentWeek = getISOWeek(currentDate);
    const currentYear = getISOWeekYear(currentDate);
    
    const [filters, setFilters] = useState<{
        year: string,
        week: string,
        employee_id: number,
        autoFetch: boolean
    }>({
        week: currentWeek.toString(),
        year: currentYear.toString(),
        autoFetch: true,
        employee_id: parseInt(employeeId as string)
    });
    
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    
    const handleWeekChange = (startDate: Date, endDate: Date) => {
        setSelectedDate(startDate);
        
        // Extract ISO week and year from the selected date
        const selectedWeek = getISOWeek(startDate);
        const selectedYear = getISOWeekYear(startDate);
        
        // Update filters to trigger refetch
        setFilters(prev => ({
            ...prev,
            week: selectedWeek.toString(),
            year: selectedYear.toString()
        }));
    };
    
    const debouncedFilters = useDebounce(filters, 500);
    const { workingHoursReport, isLoading } = useWorkingHours(debouncedFilters);
    
    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'>
                    <Hourglass size={24} className='text-indigo-400' />  Werkuren
                </h1>
                <WeekSelector
                    currentDate={currentDate}
                    selectedDate={selectedDate}
                    onWeekChange={handleWeekChange}
                />
            </div>
            {
                workingHoursReport && (
                    <Statistics 
                        appointment_hours={workingHoursReport.summary.appointment_hours}
                        shift_hours={workingHoursReport.summary.shift_hours}
                        total_days_worked={workingHoursReport.summary.total_days_worked}
                        total_hours={workingHoursReport.summary.total_hours}
                        over_time={workingHoursReport.summary.over_time}
                    />
                )
            }
            <Separator className="" />
            <div className="grid grid-cols-4 gap-4 w-full">
                {
                    isLoading ?
                        <div className="col-span-4 w-full !h-90 flex items-center justify-center">
                            <Loader />
                        </div>
                        : workingHoursReport?.working_hours?.length === 0 ?
                            <div className="col-span-4 w-full flex items-center justify-center">
                                <LargeErrorMessage
                                    firstLine={"Oops!"}
                                    secondLine={
                                        "Het lijkt erop dat er geen medewerkers zijn die aan uw zoekcriteria voldoen."
                                    }
                                    className="w-full"
                                />
                            </div>
                            :
                            workingHoursReport?.working_hours?.map((item, index) => (
                                <WorkingHoursCard key={index} entry={item} />
                            ))
                }
            </div>
        </div>
    );
};

export default WorkingHoursPage;