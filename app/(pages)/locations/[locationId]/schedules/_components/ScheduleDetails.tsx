"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar as CalendarIco, X } from "lucide-react";

import { useSchedule } from "@/hooks/schedule/use-schedule";
import { useShift } from "@/hooks/shift/use-shift";
import { Any } from "@/common/types/types";
import ShiftPlaceholder, { ScheduleRow } from "@/app/(pages)/schedules/_components/ShiftPlaceholder";

type ShiftDef = {
  id: number;
  shift: string;
  start_time: string;
  end_time: string;
};

interface ScheduleDetailsProps {
  date: Date;
  locationId: string;
  calendarHeight: number;
  onClose: () => void;
  onShiftClick: (row: CalendarScheduleResponse) => void;
  refreshKey: number;
  onCreateDefaultShift: (def: ShiftDef, day: Date) => void;
  onCreateCustomShift: (cust: ShiftDef) => void;
}

const sameUtcDay = (a: Date, b: Date) =>
  a.getUTCFullYear() === b.getUTCFullYear() &&
  a.getUTCMonth() === b.getUTCMonth() &&
  a.getUTCDate() === b.getUTCDate();

export interface CalendarScheduleResponse {
  shift_id: number;
  employee_id: number;
  employee_first_name: string;
  employee_last_name: string;
  start_time: string;
  end_time: string;
  location_id: number;
  color: string | null;
  shift_name: string;
}

interface DailyResponse {
  date: string;
  shifts: CalendarScheduleResponse[];
}

const DEFAULT_NAMES = new Set([
  "Ochtenddienst",
  "Avonddienst",
  "Slaapdienst of Waakdienst",
]);

const ScheduleDetails = ({
  date,
  locationId,
  calendarHeight,
  onClose,
  onShiftClick,
  refreshKey,
  onCreateDefaultShift,
  onCreateCustomShift
}: ScheduleDetailsProps) => {

  const { readSchedulesByDay } = useSchedule();
  const { shifts: shiftDefs } = useShift({
    location_id: Number(locationId),
    autoFetch: Boolean(locationId),
  });

  const [daily, setDaily] = useState<CalendarScheduleResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!locationId) return;

    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();

    setLoading(true);
    setError(null);

    readSchedulesByDay(locationId, y, m, d, { displayProgress: false })
      .then((raw) => {
        const rows = (raw as unknown as DailyResponse)?.shifts ?? [];

        const requestedUtc = new Date(Date.UTC(
          date.getFullYear(), date.getMonth(), date.getDate()
        ));
        const filtered = rows.filter(r =>
          sameUtcDay(new Date(r.start_time), requestedUtc)
        );

        setDaily(filtered);
      })
      .catch((err: Any) => setError(err.message ?? "Failed to load schedules"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, locationId, refreshKey]);

  const defaultShifts: ShiftDef[] = useMemo(
    () =>
      (shiftDefs ?? []).filter((s) => DEFAULT_NAMES.has(s.shift)) as ShiftDef[],
    [shiftDefs]
  );

  const customShifts: ShiftDef[] = useMemo(() => {
    const map = new Map<string, ShiftDef>();

    daily.forEach((row) => {
      if (DEFAULT_NAMES.has(row.shift_name)) return;
      const key = `${row.shift_name}-${row.start_time}-${row.end_time}`;
      if (map.has(key)) return;

      map.set(key, {
        id: -Math.abs(row.shift_name.hashCode?.() ?? row.shift_name.length),
        shift: row.shift_name,
        start_time: row.start_time,
        end_time: row.end_time,
      });
    });
    return Array.from(map.values());
  }, [daily]);

  const scheduleRows: ScheduleRow[] = useMemo(
    () =>
      daily.map((r) => ({
        shift_name: r.shift_name,
        start_time: r.start_time,
        end_time: r.end_time,
        employee_name: `${r.employee_first_name} ${r.employee_last_name}`,
      })),
    [daily]
  );

  const findOriginal = (row: ScheduleRow) =>
    daily.find(
      (r) =>
        r.shift_name === row.shift_name &&
        r.start_time === row.start_time &&
        r.end_time === row.end_time &&
        `${r.employee_first_name} ${r.employee_last_name}` === row.employee_name
    );

  if (!locationId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        style={{ height: calendarHeight }}
        className="relative w-full max-w-[300px] overflow-y-auto rounded-md
                   border border-slate-100 bg-white p-4 shadow-md backdrop-blur-lg
                   custom-scrollbar flex items-center justify-center"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full bg-gray-50 p-1.5 text-gray-500
                   transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="text-center p-4">
          <div className="mx-auto mb-4 rounded-xl bg-indigo-50 p-3 w-14 h-14 flex items-center justify-center">
            <Briefcase className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-md font-bold text-gray-800 mb-2">
            No Location Selected
          </h3>
          <p className="text-sm text-gray-500">
            Please select a location to view schedule details
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      style={{ height: calendarHeight }}
      className="relative w-full max-w-[300px] overflow-y-auto
                  backdrop-blur-lg custom-scrollbar rounded-lg border border-slate-200 bg-white pt-10 p-4 shadow-sm"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 rounded-full bg-gray-50 p-1.5 text-gray-500
                   transition-colors hover:bg-gray-100 hover:text-gray-700"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="mb-6 flex items-center">
        <div className="mr-4 rounded-xl bg-indigo-50 p-2">
          <CalendarIco className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-md font-bold text-gray-800">Schedule details</h2>
          <p className="text-sm text-gray-500">
            {date.toLocaleDateString(undefined, {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <div className="mt-0.5 flex items-center text-xs text-gray-500">
            <Briefcase className="mr-1 h-4 w-4" />
            Location #{locationId}
          </div>
        </div>
      </div>

      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-20 animate-pulse rounded-2xl bg-gray-100 p-5"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="flex items-center rounded-xl border border-red-100 bg-red-50 p-4 text-red-600">
          <svg
            className="mr-2 h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <SectionTitle>Default Shifts</SectionTitle>
          {defaultShifts.length === 0 ? (
            <EmptyNote>No default shifts configured for this location.</EmptyNote>
          ) : (
            <div className="mt-2 grid gap-3">
              {defaultShifts.map((def) => (
                <ShiftPlaceholder
                  key={def.id}
                  shift={def as Any}
                  isDefault
                  detailed
                  schedule={scheduleRows}
                  onClick={() => onCreateDefaultShift(def, date)}
                  onBadgeClick={(sr) => {
                    const orig = sr ? findOriginal(sr) : undefined;
                    if (orig) onShiftClick(orig);
                  }}

                />
              ))}
            </div>
          )}

          <SectionTitle className="mt-6">Custom Shifts</SectionTitle>
          {customShifts.length === 0 ? (
            <EmptyNote>No custom shifts scheduled.</EmptyNote>
          ) : (
            <div className="mt-2 grid gap-3">
              {customShifts.map((cs) => (
                <ShiftPlaceholder
                  key={cs.id}
                  shift={cs as Any}
                  isDefault={false}
                  detailed
                  schedule={scheduleRows}
                  onClick={() => onCreateCustomShift(cs)}
                  onBadgeClick={(sr) => {
                    const orig = sr ? findOriginal(sr) : undefined;
                    if (orig) onShiftClick(orig);
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

interface SectionTitleProps {
  className?: string;
  children: React.ReactNode;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  children,
  className = "",
}) => (
  <h3
    className={`flex items-center text-sm font-semibold tracking-wide text-gray-600 ${className}`}
  >
    {children}
  </h3>
);

interface EmptyNoteProps {
  children: React.ReactNode;
  className?: string;
}

const EmptyNote: React.FC<EmptyNoteProps> = ({
  children,
  className = "",
}) => (
  <p
    className={`mt-1 rounded-md bg-gray-50 p-3 text-center text-xs text-gray-500 ${className}`}
  >
    {children}
  </p>
);

export default ScheduleDetails;
