"use client";

import {
  FunctionComponent,
  useRef,
  useState,
  useEffect,
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
import ScheduleDetails from "./ScheduleDetails";
import { ensureHex } from "@/utils/color-utils";
import { useShift } from "@/hooks/shift/use-shift";
import ShiftPlaceholder from "./ShiftPlaceholder";
import { createRoot } from "react-dom/client";
import { Any } from "@/common/types/types";

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
    color: string | null;
    shift_name: string;
    location_shift_id: string;
  }>;
}

declare global {
  interface String { hashCode(): number }
}
String.prototype.hashCode = function () {
  let h = 0;
  for (let i = 0; i < this.length; i++)
    h = (Math.imul(31, h) + this.charCodeAt(i)) | 0;
  return h;
};

function asLocal(ts: string) {
  return ts.replace(/Z|(\+00:00)$/, "");
}

let holderVersion = 0;

type ShiftHolder = HTMLElement & {
  _root?: ReturnType<typeof createRoot>;
  _version?: number;
};


function destroyHolder(
  cellEl: HTMLElement,
  deferUnmount: boolean = false
) {
  const holder = cellEl.querySelector<ShiftHolder>(".shift-holder");
  if (!holder) return;

  const root = holder._root;
  const myVer = holder._version;

  if (deferUnmount) {
    requestAnimationFrame(() => {
      if (holder.isConnected && holder._version === myVer) {
        root?.unmount?.();
        holder.remove();
      }
    });
  } else {
    root?.unmount?.();
    holder.remove();
  }
}

const sameInstant = (a: Date | string | undefined, b: Date | string) => {
  const d1 = a instanceof Date ? a.getTime() : new Date(a ?? "").getTime();
  const d2 = new Date(b).getTime();
  return d1 === d2;
};

const ScheduleCalendar: FunctionComponent = () => {
  const calendarContainerRef = useRef<HTMLDivElement | null>(null);
  const calendarRef = useRef<FullCalendar>(null);

  const { readSchedulesByMonth, deleteSchedule } = useSchedule();

  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const { shifts } = useShift({ location_id: Number(selectedLocation), autoFetch: true })

  const [events, setEvents] = useState<EventInput[]>([]);
  const [createRange, setCreateRange] = useState<DateSelectArg | null>(null);
  const [editEvent, setEditEvent] = useState<EventClickArg | null>(null);
  const [popupPos, setPopupPos] = useState<{ left: number; top: number } | null>(
    null
  );
  const [calVer, setCalVer] = useState(0);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [sidebarDate, setSidebarDate] = useState<Date | null>(null);
  const [clickedFallbackDates, setClickedFallbackDates] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [calendarHeight, setCalendarHeight] = useState<number>(0);
  const [viewDate, setViewDate] = useState<{ year: number; month: number }>(
    () => {
      const now = new Date();
      return { year: now.getFullYear(), month: now.getMonth() + 1 };
    }
  );

  console.log(calendarHeight)

  // const renderLegend = () => {
  //   const map: Record<
  //     string,
  //     { name: string; color: string }
  //   > = {};
  //   events.forEach((ev) => {
  //     const empId = ev.extendedProps?.employee_id as number;
  //     const empName = ev.extendedProps?.employee_name as string;
  //     const color = ev.extendedProps?.color as string;
  //     map[empId] = { name: empName, color };
  //   });

  //   const container = document.createElement("div");
  //   container.className = "fc-legend flex flex-wrap gap-4 py-2 px-3";

  //   Object.values(map).forEach((info) => {
  //     const dot = document.createElement("span");
  //     dot.className = "w-3 h-3 rounded-full inline-block mr-1";
  //     dot.style.backgroundColor = info.color;

  //     const label = document.createElement("span");
  //     label.textContent = info.name;

  //     const item = document.createElement("div");
  //     item.className = "flex items-center text-sm text-gray-700";
  //     item.append(dot, label);
  //     container.appendChild(item);
  //   });

  //   return container;
  // };

  useEffect(() => {
    if (!calendarContainerRef.current) return;
    const existing = calendarContainerRef.current.querySelector(".fc-legend");
    if (existing) existing.remove();

    const toolbar = calendarContainerRef.current.querySelector(
      ".fc-header-toolbar"
    );
    if (!toolbar) return;
  }, [events]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!selectedLocation) {
        setEvents([]);
        setCalVer(v => v + 1);
        return;
      }

      const { year, month } = viewDate;

      try {
        const data = (await readSchedulesByMonth(
          selectedLocation,
          year,
          month
        )) as DayWithShifts[] | null;

        if (!data) {
          setEvents([]);
          return;
        }

        const newEvents: EventInput[] = [];

        data.forEach((dayEntry) => {
          dayEntry.shifts.forEach((sh) => {

            if (sh.location_id !== Number(selectedLocation)) return;
            const assignedColor = ensureHex(sh.color, sh.employee_id);

            // let displayEnd = sh.end_time;
            if (new Date(sh.end_time).getDate() !== new Date(sh.start_time).getDate()) {
              const tmp = new Date(sh.start_time);
              tmp.setMinutes(tmp.getMinutes() + 1);
              // displayEnd = tmp.toISOString();
            }
            newEvents.push({
              id: sh.shift_id.toString(),
              start: asLocal(sh.start_time),
              end: sh.end_time,
              title: "",
              extendedProps: {
                employee_id: sh.employee_id,
                employee_name: `${sh.employee_first_name} ${sh.employee_last_name}`,
                location_id: sh.location_id,
                rawStart: sh.start_time,
                rawEnd: sh.end_time,
                color: assignedColor,
                shift_name: sh.shift_name,
                location_shift_id: sh.location_shift_id,
                is_custom: false,
              },
              backgroundColor: assignedColor,
              textColor: "#fff",
            });

          });
        });

        const seen = new Set<string>();
        const uniqueEvents = newEvents.filter((ev) => {
          const id = ev.id as string;
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        });

        setEvents(uniqueEvents);
        setCalVer(v => v + 1);
      } catch {
        setEvents([]);
      }
    };

    fetchEvents();
    return () => setEvents([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation, viewDate.year, viewDate.month, refreshFlag]);

  useEffect(() => {
    if (!calendarContainerRef.current) return;
    const el = calendarContainerRef.current;

    const ro = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        let h = entry.contentRect.height;

        const borderSize = entry.borderBoxSize;
        if (borderSize && borderSize.length > 0) {
          h = borderSize[0].blockSize;
        }

        setCalendarHeight(h);
      }
    });

    ro.observe(el);
    setCalendarHeight(el.getBoundingClientRect().height);

    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (shifts) {
      setCalVer(v => v + 1);
    }
  }, [shifts]);

  const handleClosePopup = () => {
    setCreateRange(null);
    setEditEvent(null);
    setPopupPos(null);
    setClickedFallbackDates(null);
  };

  const handleUpsert = (payload: SchedulePayload, isEdit: boolean) => {
    let startDt: Date;
    let endDt: Date;

    if (payload.is_custom) {
      startDt = payload.start_datetime as Date;
      endDt = payload.end_datetime as Date;
    } else {
      const def = shifts?.find(s => s.id === payload.location_shift_id);
      if (!def) {
        console.error("Unknown shift id", payload.location_shift_id);
        return;
      }

      const base = payload.shift_date;
      startDt = new Date(`${base}T${def.start_time}`);
      endDt = new Date(`${base}T${def.end_time}`);
    }

    const assignedColor = ensureHex(payload.color, payload.employee_id);

    const newEvent: EventInput = {
      id: payload.id,
      start: asLocal(startDt.toISOString()),
      end: endDt,
      title: "",
      backgroundColor: assignedColor,
      textColor: "#fff",
      extendedProps: {
        employee_id: payload.employee_id,
        location_id: payload.location_id,
        location_shift_id: payload.location_shift_id,
        rawStart: startDt.toISOString(),
        rawEnd: endDt.toISOString(),
        color: assignedColor,
        is_custom: payload.is_custom,
      },
    };

    setEvents(prev =>
      isEdit ? prev.map(e => (e.id === payload.id ? newEvent : e))
        : [...prev, newEvent]
    );

    handleClosePopup();
    setRefreshFlag(f => f + 1);
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

  const openShiftEditor = (shift: Any) => {
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
        backgroundColor: ensureHex(shift.color, shift.employee_id),
        extendedProps: {
          employee_id: shift.employee_id,
          location_id: shift.location_id,
          location_shift_id: shift.location_shift_id,
          rawStart: shift.start_time,
          rawEnd: shift.end_time,
          color: ensureHex(shift.color, shift.employee_id),
        },
      },
    } as Any);

    setCreateRange(null);
    setPopupPos({ left, top });
  };

  const mkClick = (srcEv?: EventInput) => {
    if (!srcEv?.extendedProps) return undefined;

    const {
      employee_id,
      rawStart,
      rawEnd,
      location_id,
      color,
      shift_name,
    } = srcEv.extendedProps;

    return () =>
      openShiftEditor({
        shift_id: Number(srcEv.id),
        employee_id,
        start_time: rawStart,
        end_time: rawEnd,
        location_id,
        color,
        shift_name,
      });
  };


  const calendarKey = `${selectedLocation}-${calVer}`;

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
            ref={calendarRef}
            key={calendarKey}
            plugins={[dayGridPlugin]}
            initialDate={new Date(viewDate.year, viewDate.month - 1, 1)}
            initialView="dayGridMonth"
            fixedWeekCount={false}
            headerToolbar={{
              start: "prev,next today",
              center: "title",
              end: "",
            }}
            height="auto"
            events={events}
            eventContent={() => null}
            datesSet={(arg: DatesSetArg) => {
              const inMonth = new Date(arg.start);
              inMonth.setDate(inMonth.getDate() + 7);
              setViewDate({
                year: inMonth.getFullYear(),
                month: inMonth.getMonth() + 1,
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

              if (!shifts) {
                destroyHolder(info.el);
                return;
              }

              const numEl = info.el.querySelector<HTMLAnchorElement>(".fc-daygrid-day-number");
              if (numEl) {
                numEl.classList.add(
                  "cursor-pointer", "hover:bg-indigo-600", "hover:text-white",
                  "rounded-full", "transition-colors"
                );
                numEl.addEventListener("click", (e) => {
                  e.stopPropagation();
                  setSidebarDate(info.date);
                });
              }

              info.el.addEventListener("click", (e) => {
                if ((e.target as HTMLElement).closest(".fc-daygrid-day-number")) return;
                const jsEvent = e as Any;
                setCreateRange({
                  start: info.date,
                  end: info.date,
                  startStr: info.date.toISOString(),
                  endStr: info.date.toISOString(),
                  allDay: true,
                  jsEvent,
                  view: info.view.calendar.view,
                });
                setPopupPos({
                  left: Math.min(Math.max(0, jsEvent.clientX), window.innerWidth - 380),
                  top: Math.min(Math.max(0, jsEvent.clientY), window.innerHeight - 450),
                });
              });

              const currentLoc = Number(selectedLocation) || 0;
              const calendarEvents = info.view.calendar.getEvents().filter(ev =>
                ev.extendedProps.location_id === currentLoc
              );


              const eventsForDay = calendarEvents.filter(
                (e) => e.start?.toDateString() === info.date.toDateString()
              );

              const shiftsForDay: EventInput[] = eventsForDay.flatMap((ev) =>
                ev.extendedProps?.group
                  ? (ev.extendedProps.shifts as EventInput[])
                  : [ev]
              );

              const hasEvents = shiftsForDay.length > 0;

              const schedulesForDay = shiftsForDay.map((s) => ({
                shift_name: s.extendedProps?.shift_name as string,
                start_time: s.start instanceof Date ? s.start.toISOString() :
                  typeof s.start === "string" ? s.start : "",
                end_time: s.end instanceof Date ? s.end.toISOString() :
                  typeof s.end === "string" ? s.end : "",
                employee_name:
                  (s.extendedProps?.employee_name as string | undefined) ?? "—",
              }));

              const DEFAULT_NAMES = new Set([
                "Ochtenddienst",
                "Avonddienst",
                "Slaapdienst of Waakdienst",
              ]);

              const customShifts = (() => {
                if (!hasEvents) return [];
                const map = new Map<string, Any>();

                shiftsForDay.forEach((sh) => {
                  const name = sh.extendedProps?.shift_name as string | undefined;
                  if (!name || DEFAULT_NAMES.has(name)) return;

                  const startISO =
                    sh.start instanceof Date
                      ? sh.start.toISOString()
                      : new Date(sh.start as string).toISOString();
                  const endISO =
                    sh.end instanceof Date
                      ? sh.end.toISOString()
                      : new Date(sh.end as string).toISOString();

                  const key = `${name}-${startISO}-${endISO}`;
                  if (map.has(key)) return;

                  console.log("qzdqzd", sh)

                  map.set(key, {
                    id: -Math.abs(key.hashCode?.() ?? key.length),
                    shift: name,
                    start_time: startISO,
                    end_time: endISO,
                  });
                });

                return Array.from(map.values());
              })();

              const mountPoint =
                info.el.querySelector<HTMLElement>(".fc-daygrid-day-top");
              if (!mountPoint) return;

              destroyHolder(info.el);

              const holder = document.createElement("div") as ShiftHolder;
              holder.className = "shift-holder";

              mountPoint.insertAdjacentElement("afterend", holder);

              const root = createRoot(holder);
              holder._root = root;
              holder._version = ++holderVersion;
              (holder as Any)._root = root;

              const allShifts = shifts ?? [];
              const defaultShifts = allShifts.filter((s) =>
                DEFAULT_NAMES.has(s.shift)
              );



              root.render(
                <>
                  <div className="flex flex-col gap-2 p-2">
                    {defaultShifts.map((sh) => {
                      const src = shiftsForDay.find(
                        (ev) => ev.extendedProps?.shift_name === sh.shift
                      );
                      return (
                        <ShiftPlaceholder
                          key={sh.id}
                          shift={sh}
                          isDefault={true}
                          schedule={schedulesForDay}
                          onClick={mkClick(src)}
                        />
                      )
                    })}
                  </div>

                  {customShifts.length > 0 && (
                    <div className="p-2">
                      <div className="text-[0.65rem] mt-1 mb-0.5 text-gray-500">
                        Custom:
                      </div>
                      <div className="flex flex-col gap-2">
                        {customShifts.map((sh) => {

                          const src = shiftsForDay.find(ev =>
                            typeof ev.start !== "number"
                            && sameInstant(ev.start as string | Date | undefined, sh.start_time)
                            && typeof ev.end !== "number"
                            && sameInstant(ev.end as string | Date | undefined, sh.end_time)
                          );

                          return (
                            <ShiftPlaceholder
                              key={sh.id}
                              shift={sh}
                              isDefault={false}
                              schedule={schedulesForDay}
                              onClick={mkClick(src)}
                            />
                          )
                        })}
                      </div>
                    </div>
                  )}
                </>
              );
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
            dayCellClassNames="bg-white hover:bg-slate-50 transition-colors"
            viewClassNames="rounded-lg overflow-hidden p-2"
            buttonText={{ today: "Today", month: "Month" }}
            dayCellWillUnmount={(info) => {
              destroyHolder(info.el, true);
            }}
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

          .available-shifts {
            width: 100%;
            pointer-events: none; /* Disable all interactions */
          }
          
          .available-shift {
            display: flex;
            align-items: center;
            font-size: 0.65rem;
            padding: 0.25rem;
            user-select: none; /* Prevent text selection */
            border-radius: 0.25rem;
            background-color: #f9fafb;
            border: 1px solid #f3f4f6;
          }
          
          .clock-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 16px;
            height: 16px;
          }
          
          .shift-name {
            flex-grow: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-left: 0.25rem;
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
              locationId={Number(selectedLocation)}
              initialShiftId={editEvent?.event.extendedProps.location_shift_id}
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
