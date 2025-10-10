"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  DateSelectArg,
  EventClickArg,
  EventInput,
} from "@fullcalendar/core";

import BookingPopup, { UpsertPayload } from "./BookingPopup";
import { CalendarAppointment, RecurrenceType } from "@/types/calendar.types";
import { useCalendar } from "@/hooks/calendar/use-calendar";
import { BriefcaseIcon, MapPinIcon, UserIcon, UsersIcon } from "lucide-react";
import { Any, Id } from "@/common/types/types";
import MultiPartySelect from "./MultiPartySelect";

/* ───────────────────────── helpers ───────────────────────── */
const POPUP_WIDTH = 380;
const POPUP_HEIGHT = 460;

const getContrast = (hex: string) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 >= 128 ? "#000" : "#fff";
};


interface Props {
  employeeId?: number;
  clientId?: number;
  initialEvents?: EventInput[];
}

export default function BookingCalendar({
  employeeId,
  clientId,
  initialEvents = [],
}: Props) {
  const [selection, setSelection] = useState<{ type: "client" | "employee"; id: Id } | null>(null);
  const dropdownContainerRef = useRef<HTMLDivElement | null>(null);

  const active = useMemo(() => {
    if (clientId) return { type: "client" as const, id: clientId };
    if (employeeId) return { type: "employee" as const, id: employeeId };
    return selection;
  }, [clientId, employeeId, selection]);

  const {
    fetchAppointmentsWindowByEmployee,
    fetchAppointmentsWindowByClient,
    readOneAppointment,
    deleteAppointment,
  } = useCalendar(String(active?.type === "employee" ? active.id : ""));

  const fcRef = useRef<FullCalendar | null>(null);
  const containerRef = useRef<HTMLDivElement>(null!);
  const ignoreSelect = useRef(false);

  const [events, setEvents] = useState<EventInput[]>(initialEvents);
  const [createRange, setCreateRange] = useState<DateSelectArg | null>(null);
  const [editEvent, setEditEvent] = useState<EventClickArg | null>(null);
  const [popupPos, setPopupPos] = useState<{ left: number; top: number } | null>(
    null,
  );

  const toEventInput = (a: CalendarAppointment): EventInput => {
    const bg = a.color ?? "#4f46e5";
    const fg = getContrast(bg);
    const clientIds = a.clients_details?.map((c) => c.client_id) ?? [];
    const employeeIds = a.participants_details?.map((p) => p.employee_id) ?? [];

    return {
      id: String((a as Any).id),
      title: a.description ?? "",
      start: new Date(a.start_time),
      end: new Date(a.end_time),
      backgroundColor: bg,
      textColor: fg,
      extendedProps: {
        ...a,
        client_ids: clientIds,
        participant_employee_ids: employeeIds,
      },
    };
  };

  // const dedupeById = (arr: EventInput[]) => {
  //   const map = new Map<string, EventInput>();
  //   for (const ev of arr) {
  //     map.set(ev.id as string, ev);
  //   }
  //   return Array.from(map.values());
  // };

  const loadEvents = async (start: Date, end: Date) => {
    if (!active) return setEvents([]);
    try {
      const data =
        active.type === "client"
          ? await fetchAppointmentsWindowByClient(String(active.id), start, end)
          : await fetchAppointmentsWindowByEmployee(start, end);

      setEvents(data.map(toEventInput));
    } catch (e) {
      console.error("Kon afspraken niet ophalen", e);
    }
  };

  useEffect(() => {
    if (!fcRef.current) return;
    const view = fcRef.current.getApi().view;
    loadEvents(view.currentStart, view.currentEnd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, clientId, active]);

  useEffect(() => {
    const todayBtn = document.querySelector(
      ".fc-header-toolbar .fc-today-button"
    );

    if (
      todayBtn instanceof HTMLElement &&
      dropdownContainerRef.current &&
      todayBtn.parentElement &&
      !todayBtn.parentElement.contains(dropdownContainerRef.current)
    ) {
      // voeg dropdown toe direct na de Vandaag knop
      todayBtn.parentElement.insertBefore(
        dropdownContainerRef.current,
        todayBtn.nextSibling
      );
    }
  }, []);

  /* ---------- popup helpers ---------- */
  const openPopupAt = (x: number, y: number) =>
    setPopupPos({
      left: Math.min(Math.max(0, x), window.innerWidth - POPUP_WIDTH),
      top: Math.min(Math.max(0, y), window.innerHeight - POPUP_HEIGHT),
    });

  const closePopup = () => {
    if (createRange) createRange.view.calendar.unselect();
    setCreateRange(null);
    setEditEvent(null);
    setPopupPos(null);
  };

  /* ---------- FullCalendar interaction ---------- */
  const handleDateSelect = (info: DateSelectArg) => {
    setEditEvent(null);
    setCreateRange(info);
    openPopupAt(info.jsEvent!.clientX, info.jsEvent!.clientY);
  };

  const handleEventClick = async (click: EventClickArg) => {
    setCreateRange(null);

    const full = await readOneAppointment(click.event.id);
    if (full) {
      /* converteer geneste arrays naar de platte IDs die de popup verwacht */
      click.event.setExtendedProp(
        "client_ids",
        full.clients_details?.map(c => c.client_id) ?? [],
      );
      click.event.setExtendedProp(
        "participant_employee_ids",
        full.participants_details?.map(p => p.employee_id) ?? [],
      );

      /* houd een paar andere dingen synchroon met de server response */
      click.event.setExtendedProp("location", full.location);
      click.event.setExtendedProp("description", full.description);
      click.event.setStart(new Date(full.start_time));
      click.event.setEnd(new Date(full.end_time));
    }

    setEditEvent(click);
    openPopupAt(click.jsEvent!.clientX, click.jsEvent!.clientY);
  };

  /* ---------- upsert from popup ---------- */
  const handleUpsert = (p: UpsertPayload, isEdit: boolean) => {
    const api = fcRef.current?.getApi();
    if (!api) return;

    const bg = p.color ?? "#4f46e5";
    const fg = getContrast(bg);

    const fcEvent: EventInput = {
      id: p.id,
      title: p.description ?? "",
      start: p.start_time,
      end: p.end_time,
      backgroundColor: bg,
      textColor: fg,
      extendedProps: {
        ...p,
        recurrence_type: p.recurrence_type as RecurrenceType,
        color: bg,
      },
    };

    if (isEdit) {
      /* update FC instance */
      const ev = api.getEventById(p.id);
      if (ev) {
        ev.setStart(p.start_time);
        ev.setEnd(p.end_time);
        ev.setProp("backgroundColor", bg);
        ev.setProp("textColor", fg);
        ev.setProp("title", p.description ?? "");
        Object.entries(p).forEach(([k, v]) => ev.setExtendedProp(k, v));
      }
      /* update lokale state array */
      setEvents((prev) =>
        prev.map((e) => (e.id === p.id ? fcEvent : e)),
      );
    } else {
      api.addEvent(fcEvent);
      setEvents((prev) => [...prev, fcEvent]);
    }
    closePopup();
  };

  const handleDelete = async (id: string) => {
    // verwijder eerst op de server
    await deleteAppointment(id);

    // verwijder dan uit FullCalendar lokale state
    fcRef.current?.getApi().getEventById(id)?.remove();
    setEvents(prev => prev.filter(e => e.id !== id));
    closePopup();
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('nl-NL', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false
    });
  };

  const calendarViews = useMemo(
    () => ({
      timeGridWeek: { buttonText: "Week" },
      workWeek: {
        type: "timeGridWeek",
        hiddenDays: [0, 6],
        buttonText: "Werkweek",
      },
    }),
    []
  );

  const headerToolbar = useMemo(
    () => ({
      start: "prev,next today",
      center: "title",
      end: "dayGridMonth,timeGridWeek,workWeek,timeGridDay",
    }),
    []
  );



  return (
    <div ref={containerRef} className="relative">
      {!employeeId && !clientId && (
        <div ref={dropdownContainerRef} className="ml-2 inline-block">
          <MultiPartySelect
            value={selection}
            onChange={setSelection}
          />
        </div>
      )}

      <FullCalendar
        ref={fcRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable
        selectMirror
        events={events}
        datesSet={(info) => loadEvents(info.start, info.end)}
        select={handleDateSelect}
        eventClick={handleEventClick}
        fixedWeekCount={false}
        views={calendarViews}
        headerToolbar={headerToolbar}
        allDaySlot={false}
        unselectAuto={false}
        unselectCancel=".fc-popup"
        nowIndicator
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        height="auto"
        aspectRatio={1.35}
        dayMaxEvents={4}

        dayHeaderClassNames={arg =>
          arg.isToday
            ? ["bg-indigo-600", "text-white", "font-semibold"]
            : ["bg-slate-50", "text-slate-700", "font-semibold"]
        }

        dayHeaderContent={arg => {
          const weekday = new Intl.DateTimeFormat("nl", { weekday: "short" }).format(arg.date);
          if (arg.view.type === "dayGridMonth") return <span className="text-sm">{weekday}</span>;

          const dayNum = new Intl.DateTimeFormat("nl", { day: "numeric" }).format(arg.date);
          return (
            <div className="flex flex-col items-center">
              <span className="text-sm">{weekday}</span>
              <button
                type="button"
                className="text-xl font-semibold mt-3 rounded-full px-3 py-2 transition-colors hover:bg-indigo-600 hover:text-white"
                onClick={() => fcRef.current?.getApi().changeView("timeGridDay", arg.date)}
              >
                {dayNum}
              </button>
            </div>
          );
        }}

        dayCellDidMount={info => {
          if (info.view.type !== "dayGridMonth") return;
          const numEl = info.el.querySelector<HTMLAnchorElement>(".fc-daygrid-day-number");
          if (!numEl) return;

          numEl.classList.add(
            "cursor-pointer", "hover:bg-indigo-600", "hover:text-white",
            "rounded-full", "transition-colors"
          );
          numEl.addEventListener("click", () => {
            ignoreSelect.current = true;
            fcRef.current?.getApi().changeView("timeGridDay", info.date);
          });
        }}

        eventContent={(arg) => {
          const event = arg.event;
          const desc = event.extendedProps.description || "(Geen beschrijving)";
          const location = event.extendedProps.location;
          const showTime = arg.view.type.startsWith('timeGrid');

          const clientIds = event.extendedProps.client_ids || [];
          const employeeIds = event.extendedProps.participant_employee_ids || [];
          const totalParticipants = clientIds.length + employeeIds.length;

          return (
            <div className="flex flex-col w-full h-full justify-between">
              <div>
                {showTime && event.start && event.end && (
                  <div className="text-[0.65rem] font-medium mb-0.5 opacity-90">
                    {formatTime(event.start)} - {formatTime(event.end)}
                  </div>
                )}

                <div className="font-bold text-xs leading-tight whitespace-normal break-words">
                  {desc}
                </div>

                {location && (
                  <div className="text-[0.65rem] mt-0.5 flex items-center truncate">
                    <MapPinIcon className="w-2.5 h-2.5 mr-1 flex-shrink-0" />
                    <span className="truncate">{location}</span>
                  </div>
                )}
              </div>

              {(clientIds.length > 0 || employeeIds.length > 0) && (
                <div className="mt-1.5 flex items-center justify-between border-t border-white/20 pt-1">
                  <div className="flex items-center space-x-2">
                    {/* Cliënten teller met tooltip */}
                    {clientIds.length > 0 && (
                      <div
                        className="group relative flex items-center text-[0.6rem]"
                        title={`${clientIds.length} cliënt${clientIds.length !== 1 ? 'en' : ''}`}
                      >
                        <UserIcon className="w-3 h-3 mr-0.5" />
                        <span>{clientIds.length}</span>

                        {/* Tooltip voor cliëntnamen */}
                        {clientIds.length > 0 && (
                          <div className="hidden group-hover:block absolute bottom-full left-0 mb-1 px-2 py-1 text-xs rounded bg-black text-white whitespace-nowrap z-50">
                            {clientIds.length} cliënt{clientIds.length !== 1 ? 'en' : ''}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Medewerkers teller met tooltip */}
                    {employeeIds.length > 0 && (
                      <div
                        className="group relative flex items-center text-[0.6rem]"
                        title={`${employeeIds.length} medewerker${employeeIds.length !== 1 ? 's' : ''}`}
                      >
                        <BriefcaseIcon className="w-3 h-3 mr-0.5" />
                        <span>{employeeIds.length}</span>

                        {/* Tooltip voor medewerkernamen */}
                        {employeeIds.length > 0 && (
                          <div className="hidden group-hover:block absolute bottom-full left-0 mb-1 px-2 py-1 text-xs rounded bg-black text-white whitespace-nowrap z-50">
                            {employeeIds.length} medewerker{employeeIds.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Totaal deelnemers indicator */}
                  <div className="text-[0.6rem] opacity-80 flex items-center">
                    <UsersIcon className="w-3 h-3 mr-0.5" />
                    <span>{totalParticipants}</span>
                  </div>
                </div>
              )}
            </div>
          );
        }}

        eventDidMount={(info) => {
          const bg = info.isMirror ? "#4f46e5" : info.event.backgroundColor;
          if (!bg) return;

          const el = info.el as HTMLElement;
          const textColor = getContrast(bg);

          el.style.backgroundColor = bg;
          el.style.color = textColor;
          el.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
          el.style.border = 'none';

          // Voeg hover effect toe
          el.style.transition = 'all 0.2s ease';
          el.addEventListener('mouseenter', () => {
            el.style.filter = 'brightness(1.05)';
            el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.15)';
          });
          el.addEventListener('mouseleave', () => {
            el.style.filter = 'none';
            el.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
          });

          // Voeg tooltip styling toe
          const tooltipCSS = `
            .fc-event-tooltip {
              position: absolute;
              background: rgba(0,0,0,0.85);
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 0.75rem;
              z-index: 1000;
              pointer-events: none;
              transform: translateX(-50%);
              left: 50%;
              bottom: calc(100% + 5px);
              white-space: nowrap;
              opacity: 0;
              transition: opacity 0.2s;
            }
            
            .group:hover .fc-event-tooltip {
              opacity: 1;
            }
            
            .fc-event-tooltip:after {
              content: '';
              position: absolute;
              top: 100%;
              left: 50%;
              margin-left: -5px;
              border-width: 5px;
              border-style: solid;
              border-color: rgba(0,0,0,0.85) transparent transparent transparent;
            }
          `;

          if (!document.head.querySelector('#event-tooltip-style')) {
            const style = document.createElement('style');
            style.id = 'event-tooltip-style';
            style.textContent = tooltipCSS;
            document.head.appendChild(style);
          }
        }}

        viewDidMount={arg => {
          if (!arg.view.type.startsWith("timeGrid")) return;
          const frame = arg.el.querySelector<HTMLElement>(".fc-timegrid-axis-frame");
          if (frame) {
            frame.style.fontSize = "0.75rem";
            frame.style.fontWeight = "500";
            frame.style.padding = "2px 4px";
            frame.style.whiteSpace = "nowrap";
            frame.title = Intl.DateTimeFormat().resolvedOptions().timeZone;
          }
        }}

        eventClassNames="rounded-lg px-2 py-1 transition-colors"
        dayCellClassNames="bg-white hover:bg-slate-50 transition-colors"
        viewClassNames="rounded-lg overflow-hidden p-2"
        buttonText={{ today: "Vandaag", month: "Maand", timeGridWeek: "Week", workWeek: "Werkweek", day: "Dag" }}
      />

      {popupPos && (createRange || editEvent) && (
        <BookingPopup
          createRange={createRange}
          editEvent={editEvent}
          position={popupPos}
          containerRef={containerRef}
          onClose={closePopup}
          onUpsert={handleUpsert}
          onDelete={handleDelete}
          initialClientId={active?.type === "client" ? active.id : undefined}
          initialEmployeeId={
            active?.type === "employee" ? active.id : undefined
          }
        />
      )}

      <style jsx global>
        {`

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

          .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
            background-color: #4f46e5 !important;
            color: white !important;
            border-radius: 50% !important;
            width: 2rem !important;
            height: 2rem !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
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
            border-right:   1px solid #e5e7eb !important;
          }

          .fc .fc-timegrid-axis-cushion {
            font-size:    0.875rem  !important;   
            font-weight:  500      !important;    
            color:        #4b5563  !important;    
            width:        4rem     !important;    
            text-align:   right    !important;
            padding-right:0.5rem    !important;
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
        `}
      </style>
    </div>
  );
}