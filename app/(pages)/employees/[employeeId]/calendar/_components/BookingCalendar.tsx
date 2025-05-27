"use client";

import { useEffect, useRef, useState } from "react";
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
  employeeId: number;
  initialEvents?: EventInput[];
}

export default function BookingCalendar({
  employeeId,
  initialEvents = [],
}: Props) {
  const { fetchAppointmentsWindow, readOneAppointment, deleteAppointment } = useCalendar(String(employeeId));

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
    const bg = "#4f46e5";
    return {
      id: String((a as any).id),
      title: a.description ?? "",
      start: new Date(a.start_time),
      end: new Date(a.end_time),
      backgroundColor: bg,
      textColor: getContrast(bg),
      extendedProps: a,
    };
  };

  /* replace the stub */
  const loadEvents = async (start: Date, end: Date) => {
    try {
      const data = await fetchAppointmentsWindow(start, end);
      const mapped = data.map(toEventInput);
      setEvents(mapped);
    } catch (e) {
      console.error("Could not fetch appointments", e);
    }
  };

  useEffect(() => {
    if (!fcRef.current) return;
    const view = fcRef.current.getApi().view;
    loadEvents(view.currentStart, view.currentEnd);
  }, [employeeId]);

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

  /* ---------- FC interaction ---------- */
  const handleDateSelect = (info: DateSelectArg) => {
    setEditEvent(null);
    setCreateRange(info);
    openPopupAt(info.jsEvent!.clientX, info.jsEvent!.clientY);
  };

  const handleEventClick = async (click: EventClickArg) => {
    setCreateRange(null);

    const full = await readOneAppointment(click.event.id);
    if (full) {
      /* convert nested arrays into the flat IDs the popup expects */
      click.event.setExtendedProp(
        "client_ids",
        full.clients_details?.map(c => c.client_id) ?? [],
      );
      click.event.setExtendedProp(
        "participant_employee_ids",
        full.participants_details?.map(p => p.employee_id) ?? [],
      );

      /* keep a few other bits in sync with the server response */
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

    const bg = p.card_color ?? "#4f46e5";
    const fg = p.textColor;

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
      /* update local state array */
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
    // first delete on the server
    await deleteAppointment(id);

    // then remove from FullCalendar + local state
    fcRef.current?.getApi().getEventById(id)?.remove();
    setEvents((prev) => prev.filter((e) => e.id !== id));
    closePopup();
  };

  return (
    <div ref={containerRef} className="relative">
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

        views={{
          timeGridWeek: { buttonText: "Week" },
          workWeek: { type: "timeGridWeek", hiddenDays: [0, 6], buttonText: "Work Week" },
        }}
        headerToolbar={{
          start: "prev,next today",
          center: "title",
          end: "dayGridMonth,timeGridWeek,workWeek,timeGridDay",
        }}
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
          const weekday = new Intl.DateTimeFormat("en", { weekday: "short" }).format(arg.date);
          if (arg.view.type === "dayGridMonth") return <span className="text-sm">{weekday}</span>;

          const dayNum = new Intl.DateTimeFormat("en", { day: "numeric" }).format(arg.date);
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

        eventContent={arg => {
          const desc = (arg.event.extendedProps.description as string | undefined) ?? "";
          return (
            <div className="flex flex-col">
              <div className="font-bold whitespace-pre-wrap break-words">
                {desc || "(No description)"}
              </div>
            </div>
          );
        }}

        eventDidMount={info => {
          const bg = info.isMirror ? "#4f46e5" : info.event.backgroundColor;
          if (!bg) return;
          const el = info.el as HTMLElement;
          el.style.backgroundColor = bg;
          el.style.borderColor = "transparent";
          el.style.color = getContrast(bg);
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

        eventClassNames="border rounded-lg px-2 py-1 transition-colors"
        dayCellClassNames="bg-white hover:bg-slate-50 transition-colors"
        viewClassNames="rounded-lg overflow-hidden p-2"
        buttonText={{ today: "Today", month: "Month", timeGridWeek: "Week", workWeek: "Work Week", day: "Day" }}
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
