import React, { useEffect, useState } from "react";
import { useSchedule } from "@/hooks/schedule/use-schedule";
import { X, Clock, User, Calendar, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { pastelHexFromId } from "@/utils/color-utils";
import { Any } from "@/common/types/types";

interface ScheduleDetailsProps {
  date: Date;
  locationId: string;
  onClose: () => void;
  calendarHeight: number;
  onShiftClick: (shift: CalendarScheduleResponse) => void;
  refreshKey: number;
}

interface CalendarScheduleResponse {
  shift_id: number;
  employee_id: number;
  employee_first_name: string;
  employee_last_name: string;
  start_time: string;
  end_time: string;
  location_id: number;
  color: string | null;
}

interface DailyResponse {
  date: string;
  shifts: CalendarScheduleResponse[];
}

const getShiftColor = (shift: CalendarScheduleResponse) =>
  shift.color?.startsWith("#") ? shift.color : pastelHexFromId(shift.employee_id);

const ScheduleDetails = ({
  date,
  locationId,
  calendarHeight,
  onClose,
  onShiftClick,
  refreshKey,
}: ScheduleDetailsProps) => {
  const { readSchedulesByDay } = useSchedule();
  const [dailySchedules, setDailySchedules] = useState<CalendarScheduleResponse[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!locationId) return;

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    setLoading(true);
    setError(null);

    readSchedulesByDay(locationId, year, month, day, { displayProgress: false })
      .then((res) => {
        if (res) {
          const daily = (res as unknown as DailyResponse).shifts;
          setDailySchedules(daily || []);
        } else {
          setDailySchedules([]);
        }
      })
      .catch((err: Any) => setError(err.message || "Failed to load schedules"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, locationId, refreshKey]);

  const groupShiftsByTime = () =>
    dailySchedules?.reduce((groups: Record<string, CalendarScheduleResponse[]>, shift) => {
      const key = `${shift.start_time}-${shift.end_time}`;
      (groups[key] ||= []).push(shift);
      return groups;
    }, {}) || {};

  const groupedShifts = groupShiftsByTime();
  const timeSlots = Object.entries(groupedShifts);

  const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="relative w-full max-w-[350px] overflow-y-auto rounded-md border border-slate-100 bg-white p-4 shadow-xl backdrop-blur-lg custom-scrollbar"
      style={{
        height: calendarHeight,
        background: "linear-gradient(to bottom right, #ffffff, #f9faff)",
        boxShadow:
          "0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 10px 30px -15px rgba(0, 0, 0, 0.05)",
        border: "1px solid rgba(241, 245, 249, 0.8)",
      }}
    >
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(241, 245, 249, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c7d2fe;
          border-radius: 10px;
          transition: background 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a5b4fc;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #c7d2fe rgba(241, 245, 249, 0.5);
        }
      `}</style>
      <button
        className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-center mb-6">
        <div className="bg-indigo-50 p-2 rounded-xl mr-4">
          <Calendar className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-md font-bold text-gray-800">
            {date.toLocaleDateString(undefined, {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric"
            })}
          </h2>
          <div className="flex items-center text-gray-500 mt-1">
            <Briefcase className="h-4 w-4 mr-1.5" />
            <span className="text-sm">Location #{locationId}</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        {!locationId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="bg-indigo-50 p-5 rounded-full mb-4">
              <Briefcase className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-1">Select a Location</h3>
            <p className="text-gray-500 text-center max-w-md">
              Please choose a location from the dropdown to view scheduled shifts.
            </p>
          </motion.div>
        )}


        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="animate-pulse bg-gray-100 rounded-2xl p-5 h-24"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 rounded-xl p-4 border border-red-100 text-red-600 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {!loading && !error && dailySchedules && dailySchedules.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="bg-indigo-50 p-5 rounded-full mb-4">
              <Clock className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-1">No scheduled shifts</h3>
            <p className="text-gray-500 text-center max-w-md">
              There are no shifts scheduled for this day. Click Anywhere on the calendar to create a new shift.
            </p>
          </motion.div>
        )}

        {!loading && !error && dailySchedules && dailySchedules.length > 0 && (
          <AnimatePresence>
            <div className="space-y-5">
              {timeSlots.map(([timeRange, shifts], groupIdx) => (
                <motion.div
                  key={timeRange}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIdx * 0.1 }}
                  className="bg-white rounded-lg p-4 border border-gray-200 shadow"
                >
                  <div className="flex items-center mb-4">
                    <Clock className="h-4 w-4 text-indigo-600 mr-2" />
                    <span className="font-semibold text-indigo-700">
                      {formatTime(shifts[0].start_time)} - {formatTime(shifts[0].end_time)}
                    </span>
                    <div className="ml-auto px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                      {shifts.length} {shifts.length === 1 ? "employee" : "employees"}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {shifts.map((sched) => (
                      <motion.div
                        key={sched.shift_id}
                        whileHover={{ y: -1 }}
                        className="flex items-center p-2 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-all cursor-pointer"
                        onClick={() => onShiftClick(sched)}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-2 text-xs"
                          style={{ backgroundColor: getShiftColor(sched) }}
                        >
                          {sched.employee_first_name[0]}
                          {sched.employee_last_name[0]}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 text-sm">
                            {sched.employee_first_name} {sched.employee_last_name}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center mt-0.5">
                            <User className="h-3 w-3 mr-1" />
                            <span>ID: {sched.employee_id}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

export default ScheduleDetails;