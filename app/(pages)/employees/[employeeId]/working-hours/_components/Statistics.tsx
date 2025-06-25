"use client";
import StatisticCard from '@/common/components/StatisticCard'
import { WorkingHoursSummary } from '@/types/working-hours.types';
import {  CalendarCheck, CalendarDays, Clock, LocateFixed } from 'lucide-react'

const Statistics = ({appointment_hours,shift_hours,total_days_worked,total_hours}:WorkingHoursSummary) => {

    return (
        <div className="w-full grid lg:grid-cols-4 grid-cols-[repeat(3,205px)] md:grid-cols-[repeat(4,205px)]  gap-3 mb-5 ">
            <StatisticCard colorKey="teal" icon={LocateFixed} title="Appointment Hours" value={appointment_hours} />
            <StatisticCard colorKey="sky" icon={CalendarCheck} title="Shifts Hours" value={shift_hours} />
            <StatisticCard colorKey="pink" icon={CalendarDays} title="Total Days" value={total_days_worked} />
            <StatisticCard colorKey="orange" icon={Clock} title="Total Hours" value={total_hours} />
        </div>
    )
}

export default Statistics