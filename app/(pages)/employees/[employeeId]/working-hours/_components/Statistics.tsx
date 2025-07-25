"use client";
import StatisticCard from '@/common/components/StatisticCard'
import { WorkingHoursSummary } from '@/types/working-hours.types';
import {  CalendarCheck, CalendarDays, Clock, LocateFixed, ClockAlert } from 'lucide-react'

const Statistics = ({appointment_hours,shift_hours,total_days_worked,total_hours, over_time}:WorkingHoursSummary) => {

    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-5">
            <StatisticCard colorKey="teal" icon={LocateFixed} title="Appointment Hours" value={appointment_hours} />
            <StatisticCard colorKey="sky" icon={CalendarCheck} title="Shifts Hours" value={shift_hours} />
            <StatisticCard colorKey="pink" icon={CalendarDays} title="Total Days" value={total_days_worked} />
            <StatisticCard colorKey="orange" icon={Clock} title="Total Hours" value={total_hours} />
            <StatisticCard colorKey="red" icon={ClockAlert} title="Overtime Hours" value={over_time} />
        </div>
    )
}

export default Statistics