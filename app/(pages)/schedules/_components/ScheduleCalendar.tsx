"use client";

import {
  FunctionComponent,
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  DateSelectArg,
  EventClickArg,
  EventInput,
  DatesSetArg,
} from "@fullcalendar/core";
import SchedulePopup, { SchedulePayload } from "./SchedulePopup";
import { useSchedule } from "@/hooks/schedule/use-schedule";
import { LocationSelect } from "@/components/employee/LocationSelect";
import { ClockIcon } from "lucide-react";
import ScheduleDetails from "./ScheduleDetails";

interface DayWithShifts {
  date: string;
  shifts: Array<{
    shift_id: number;
    employee_id: number;
    employee_first_name: string;
    employee_last_name: string;
    start_time: string;
    end_time: string;
    location_id: number;
  }>;
}

const ScheduleCalendar: FunctionComponent = () => {
  const calendarContainerRef = useRef<HTMLDivElement | null>(null);
  const { readSchedulesByMonth, deleteSchedule } = useSchedule();

  const [events, setEvents] = useState<EventInput[]>([]);

  const [createRange, setCreateRange] = useState<DateSelectArg | null>(null);
  const [editEvent, setEditEvent] = useState<EventClickArg | null>(null);
  const [popupPos, setPopupPos] = useState<{ left: number; top: number } | null>(
    null
  );
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [sidebarDate, setSidebarDate] = useState<Date | null>(null);

  const [clickedFallbackDates, setClickedFallbackDates] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [calendarHeight, setCalendarHeight] = useState<number>(0);

  const [viewDate, setViewDate] = useState<{ year: number; month: number }>(
    () => {
      const now = new Date();
      return { year: now.getFullYear(), month: now.getMonth() + 1 };
    }
  );

  useEffect(() => {
    const fetchEvents = async () => {
      if (!selectedLocation) {
        setEvents([]);
        return;
      }

      const locationId = selectedLocation;
      const { year, month } = viewDate;

      try {
        const data = (await readSchedulesByMonth(locationId, year, month)) as DayWithShifts[] | null;

        if (!data) {
          setEvents([]);
          return;
        }

        const newEvents: EventInput[] = [];

        data.forEach((dayEntry) => {
          dayEntry.shifts.forEach((sh) => {
            const idStr = sh.shift_id.toString();
            newEvents.push({
              id: idStr,
              start: sh.start_time,
              end: sh.end_time,
              title: "",
              extendedProps: {
                employee_id: sh.employee_id,
                location_id: sh.location_id,
                rawStart: sh.start_time,
                rawEnd: sh.end_time,
              },
              backgroundColor: "#4f46e5",
              textColor: "#fff",
            });
          });
        });

        const seen = new Set<string>();
        const uniqueEvents: EventInput[] = [];
        newEvents.forEach((ev) => {
          const evId = ev.id as string;
          if (!seen.has(evId)) {
            seen.add(evId);
            uniqueEvents.push(ev);
          }
        });

        setEvents(uniqueEvents);
      } catch {
        setEvents([]);
      }
    };

    fetchEvents();
  }, [selectedLocation, viewDate.year, viewDate.month, refreshFlag]);

  useEffect(() => {
    const updateHeight = () => {
      if (calendarContainerRef.current) {
        setCalendarHeight(calendarContainerRef.current.clientHeight);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [events, viewDate.year, viewDate.month]);

  const handleClosePopup = () => {
    setCreateRange(null);
    setEditEvent(null);
    setPopupPos(null);
    setClickedFallbackDates(null);
  };

  const handleUpsert = (payload: SchedulePayload, isEdit: boolean) => {
    const { id, start_datetime, end_datetime, employee_id, location_id } = payload;

    const newEvent: EventInput = {
      id,
      start: start_datetime,
      end: end_datetime,
      title: "", // no text
      extendedProps: {
        employee_id,
        location_id,
        rawStart: start_datetime.toISOString(),
        rawEnd: end_datetime.toISOString(),
      },
      backgroundColor: "#4f46e5",
      textColor: "#fff",
    };

    setEvents((prev) => {
      if (isEdit) {
        return prev.map((e) => (e.id === id ? newEvent : e));
      } else {
        return [...prev, newEvent];
      }
    });

    handleClosePopup();
    setRefreshFlag((prev) => prev + 1);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSchedule(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      setRefreshFlag((prev) => prev + 1);
    } finally {
      handleClosePopup();
    }
  };

  const groupEventsByTimeRange = (events: EventInput[]): EventInput[] => {
    const groups: Record<string, EventInput> = {};

    events.forEach((event) => {
      if (!event.start || !event.end) return;

      const timeRangeKey = `${event.start}-${event.end}`;

      if (!groups[timeRangeKey]) {
        groups[timeRangeKey] = {
          id: String(event.id),
          start: event.start,
          end: event.end,
          title: "",
          extendedProps: {
            ...event.extendedProps,
            group: true,
            shifts: [event],
          },
          backgroundColor: "transparent",
        };
      } else {
        groups[timeRangeKey].extendedProps!.shifts.push(event);
      }
    });

    return Object.values(groups);
  };

  const groupedEvents = useMemo(() => groupEventsByTimeRange(events), [events]);

  const openShiftEditor = (shift: any) => {
    const left = window.innerWidth / 2 - 190;
    const top = window.innerHeight / 2 - 225;

    setClickedFallbackDates({
      start: new Date(shift.start_time),
      end: new Date(shift.end_time),
    });

    setEditEvent({
      event: {
        id: shift.shift_id.toString(),
        start: new Date(shift.start_time),
        end: new Date(shift.end_time),
        extendedProps: {
          employee_id: shift.employee_id,
          location_id: shift.location_id,
          rawStart: shift.start_time,
          rawEnd: shift.end_time,
        },
      },
    } as any);

    setCreateRange(null);
    setPopupPos({ left, top });
  };


  return (
    <>
      <div className="flex justify-end mb-4">
        <LocationSelect
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-50 rounded-lg border-gray-300 bg-red py-2 text-sm text-gray-800 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 hover:border-gray-400"
        />
      </div>

      <div className="relative flex w-full rounded-lg gap-2">
        <div
          ref={calendarContainerRef}
          className="relative w-full rounded-lg border border-slate-200 bg-white pt-10 p-4 shadow-sm "
        >
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            fixedWeekCount={false}
            headerToolbar={{
              start: "prev,next today",
              center: "title",
              end: "",
            }}
            height="auto"
            events={groupedEvents}
            datesSet={(arg: DatesSetArg) => {
              const newDate = new Date(arg.start);
              setViewDate({
                year: newDate.getFullYear(),
                month: newDate.getMonth() + 1,
              });
            }}
            dayHeaderClassNames={(arg) =>
              arg.isToday
                ? ["bg-indigo-600", "text-white", "font-semibold"]
                : ["bg-slate-50", "text-slate-700", "font-semibold"]
            }
            dayHeaderContent={(arg) => {
              const weekday = new Intl.DateTimeFormat("en", {
                weekday: "short",
              }).format(arg.date);
              if (arg.view.type === "dayGridMonth") {
                return <span className="text-sm">{weekday}</span>;
              }
              return null;
            }}
            dayCellDidMount={(info) => {
              if (info.view.type !== "dayGridMonth") return;

              const numEl = info.el.querySelector<HTMLAnchorElement>(
                ".fc-daygrid-day-number"
              );
              if (numEl) {
                numEl.classList.add(
                  "cursor-pointer",
                  "hover:bg-indigo-600",
                  "hover:text-white",
                  "rounded-full",
                  "transition-colors"
                );
                numEl.addEventListener("click", (e) => {
                  e.stopPropagation();
                  setSidebarDate(info.date);
                });
              }

              info.el.addEventListener("click", (e: MouseEvent) => {
                if (
                  (e.target as HTMLElement).closest(".fc-daygrid-day-number")
                ) {
                  return;
                }
                const calendarApi = info.view.calendar;
                const jsEvent = e as any;
                const dateArg: DateSelectArg = {
                  start: info.date,
                  end: info.date,
                  startStr: info.date.toISOString(),
                  endStr: info.date.toISOString(),
                  allDay: true,
                  jsEvent,
                  view: calendarApi.view,
                };

                const left = Math.min(
                  Math.max(0, jsEvent.clientX),
                  window.innerWidth - 380
                );
                const top = Math.min(
                  Math.max(0, jsEvent.clientY),
                  window.innerHeight - 450
                );
                setCreateRange(dateArg);
                setPopupPos({ left, top });
              });
            }}
            eventClick={(clickInfo) => {
              const jsEvent = clickInfo.jsEvent;
              const left = Math.min(
                Math.max(0, jsEvent.clientX),
                window.innerWidth - 380
              );
              const top = Math.min(
                Math.max(0, jsEvent.clientY),
                window.innerHeight - 450
              );

              let startDt: Date | null = clickInfo.event.start;
              let endDt: Date | null = clickInfo.event.end;

              if (!startDt) {
                const fallback = clickInfo.event.extendedProps
                  .rawStart as string | undefined;
                if (fallback) startDt = new Date(fallback);
              }
              if (!endDt) {
                const fallback = clickInfo.event.extendedProps
                  .rawEnd as string | undefined;
                if (fallback) endDt = new Date(fallback);
              }
              if (!startDt) startDt = new Date();
              if (!endDt) endDt = startDt;

              setEditEvent(clickInfo);
              setClickedFallbackDates({ start: startDt, end: endDt });
              setPopupPos({ left, top });
            }}
            dayMaxEvents={false}
            eventContent={(arg) => {
              const id = arg.event.id;
              const numeric = parseInt(id, 10) || 1;
              const hue = (numeric * 137) % 360;
              const pastel = `hsl(${hue}, 50%, 75%)`;
              if (arg.event.extendedProps.group) {
                const shifts = arg.event.extendedProps.shifts || [];
                const start = arg.event.start;
                const end = arg.event.end;

                const formatTime = (date: Date) =>
                  date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

                return (
                  <div className="shift-group">
                    <div className="shift-time-range flex items-center text-xs text-gray-600 mb-1">
                      <ClockIcon className="w-3 h-3 mr-1" />
                      {start && end ? (
                        `${formatTime(start)} - ${formatTime(end)}`
                      ) : 'All Day'}
                    </div>
                    <div className="shift-dots flex flex-wrap gap-1">
                      {shifts.slice(0, 4).map((shift: any) => {
                        const id = shift.id;
                        const numeric = parseInt(id, 10) || 1;
                        const hue = (numeric * 137) % 360;
                        const pastel = `hsl(${hue}, 50%, 75%)`;

                        return (
                          <div
                            key={shift.id}
                            className="shift-dot w-5 h-5 rounded-full"
                            style={{ backgroundColor: pastel }}
                            tabIndex={0}
                          />
                        );
                      })}
                      {shifts.length > 4 && (
                        <div className="shift-dot w-5 h-5 rounded-full flex items-center justify-center text-xs text-gray-700 bg-gray-200">
                          +{shifts.length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  className="shift-dot w-6 h-6 rounded-full"
                  style={{ backgroundColor: pastel }}
                  tabIndex={0}
                />
              );
            }}
            dayCellClassNames="bg-white hover:bg-slate-50 transition-colors"
            viewClassNames="rounded-lg overflow-hidden p-2"
            buttonText={{ today: "Today", month: "Month" }}
          />

          <style jsx global>{`
          .fc-daygrid-day.fc-day-other {
            background-color: #f9fafb !important;
            pointer-events: none;
          }
          .fc-daygrid-day.fc-day-other .fc-daygrid-day-number {
            display: none;
          }
          .fc-daygrid-day.fc-day-other:hover {
            background-color: #f9fafb !important;
          }

          .fc-daygrid-event-harness {
            display: block !important;
            width: 100% !important;
            margin: 2px 0 !important; /* gap between stacked groups */
          }

          .fc-daygrid-event {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          .fc-daygrid-event .fc-event-main {
            padding: 0 !important;
          }

          .fc-daygrid-event .fc-event-title,
          .fc-daygrid-event .fc-event-time {
            display: none !important;
          }

          
            
          .fc .fc-daygrid-day-frame {
            min-height: 120px !important;
            }
            
            .fc-timegrid-col.fc-day-today,
            .fc-daygrid-day.fc-day-today {
            background-color: white !important;
            }
            
            .fc-header-toolbar {
              margin-bottom: 1rem;
              gap: 0.75rem;
          }

          .fc-button {
            padding: 0.375rem 0.75rem !important;
            border-radius: 0.25rem !important;
            font-size: 0.875rem !important;
            font-weight: 500 !important;
            transition: all 0.2s ease !important;
            border: 1px solid #e2e8f0 !important;
            background-color: white !important;
            color: #64748b !important;
            box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          }

          .fc-button:hover {
            background-color: #f8fafc !important;
            color: #475569 !important;
            border-color: #cbd5e1 !important;
          }

          .fc-button-primary:not(.fc-button-active) {
            background-color: white !important;
            border-color: #e2e8f0 !important;
            color: #64748b !important;
          }

          .fc-button-active {
            background-color: #4f46e5 !important;
            border-color: #4f46e5 !important;
            color: white !important;
          }

          .fc-today-button {
            background-color: #f8fafc !important;
            border-color: #e2e8f0 !important;
            color: #475569 !important;
            font-weight: 600 !important;
          }

          .fc-today-button:hover {
            background-color: #f1f5f9 !important;
          }

          .fc-toolbar-title {
            font-size: 1.25rem !important;
            font-weight: 600 !important;
            color: #1e293b !important;
          }

          .fc-daygrid-day.fc-day .fc-daygrid-day-number {
            border-radius: 50% !important;
            width: 2rem !important;
            height: 2rem !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          .fc .fc-timegrid-axis,
          .fc .fc-timegrid-axis-cushion {
            background-color: white !important;
            border-right: 1px solid #e2e8f0 !important;
          }

          .fc .fc-scrollgrid {
            border-top: none !important;
          }

          .fc .fc-timegrid-axis {
            background-color: #f9fafb !important;
            border-right: 1px solid #e5e7eb !important;
          }

          .fc .fc-timegrid-axis-cushion {
            font-size: 0.875rem !important;
            font-weight: 500 !important;
            color: #4b5563 !important;
            width: 4rem !important;
            text-align: right !important;
            padding-right: 0.5rem !important;
          }

          .form-scroll {
            scrollbar-width: thin;
            scrollbar-color: #9ca3af transparent;
          }
          .form-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .form-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .form-scroll::-webkit-scrollbar-thumb {
            background-color: #9ca3af;
            border-radius: 3px;
          }
          .form-scroll::-webkit-scrollbar-thumb:hover {
            background-color: #6b7280;
          }

          .fc-event-description {
            line-height: 1.1;
            margin-top: 0.125rem;
            white-space: pre-wrap;
            word-break: break-word;
          }

          .react-datepicker {
            border: 1px solid #e2e8f0 !important;
            border-radius: 8px !important;
            box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          }

          .react-datepicker__header {
            background-color: #f8fafc !important;
            border-bottom: 1px solid #e2e8f0 !important;
          }

          .react-datepicker__time-list-item--selected {
            background-color: #4f46e5 !important;
          }

          .react-datepicker__day--selected {
            background-color: #4f46e5 !important;
            color: white !important;
          }

          .react-datepicker__day:hover {
            background-color: #f1f5f9 !important;
          }

          .fc-daygrid-event:focus,
          .fc-daygrid-event:active {
            background: transparent !important;
            box-shadow: none !important;
            outline: none !important;
          }

          .shift-dot:active,
          .shift-dot:focus {
            outline: none; /* suppress focus outline */
          }

          .shift-dot {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .shift-dot:hover {
            transform: scale(1.10);
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
          }

          .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
            background-color: #4f46e5 !important;
            color: white !important;
          }
        `}</style>

          {popupPos && (createRange || editEvent) && (
            <SchedulePopup
              createRange={createRange}
              editEvent={editEvent}
              eventStart={clickedFallbackDates?.start}
              eventEnd={clickedFallbackDates?.end}
              position={popupPos}
              containerRef={calendarContainerRef}
              onClose={handleClosePopup}
              onUpsert={handleUpsert}
              onDelete={handleDelete}
              initialEmployeeId={editEvent?.event.extendedProps.employee_id}
              initialLocationId={editEvent?.event.extendedProps.location_id}
            />
          )}
        </div>

        {sidebarDate && (
          <ScheduleDetails
            date={sidebarDate}
            locationId={selectedLocation}
            calendarHeight={calendarHeight}
            onClose={() => setSidebarDate(null)}
            onShiftClick={openShiftEditor}
            refreshKey={refreshFlag}
          />
        )}
      </div >
    </>
  );
};

export default ScheduleCalendar;
