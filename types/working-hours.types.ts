export type TimePeriod = {
    date_range: {
        end: string;
        start: string;
    };
    is_current_month: boolean;
    month: number;
    month_name: string;
    year: number;
};

export type WorkingHoursSummary = {
    appointment_hours: number;
    shift_hours: number;
    total_days_worked: number;
    total_hours: number;
};

export type WorkingHoursEntry = {
    description: string;
    duration_hours: number;
    end_time: string;
    id: number;
    location: string;
    location_id: number;
    start_time: string;
    status?: "PENDING"|"CONFIRMED"|"CANCELED";
    type: "appointment"|"schedule";
};

export type EmployeeWorkingHoursReport = {
    employee_id: number;
    period: TimePeriod;
    summary: WorkingHoursSummary;
    working_hours: WorkingHoursEntry[];
};