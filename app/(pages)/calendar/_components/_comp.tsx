"use client";

import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";

import BookingPopup, { CalendarEventDTO } from "./BookingPopup";
import { Id } from "@/common/types/types";
import { RecurrenceType } from "@/types/appointment.types";
import { useAppointment } from "@/hooks/client/use-appointment";

const POPUP_WIDTH = 380;
const POPUP_HEIGHT = 460;

const getContrast = (hex: string) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1_000 >= 128 ? "#000" : "#fff";
};

export type CalendarEvent = {
  id: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  backgroundColor?: string;
  textColor?: string;
  clients?: Id[];
  participant_employee_ids?: Id[];
  location?: string;
  recurrence_type: RecurrenceType;
  recurrence_interval?: number;
  recurrence_end_date?: Date;
};

interface Props {
  employeeId: number;
  initialEvents: CalendarEvent[];
}

export default function BookingCalendar({
  employeeId,
  initialEvents = [],
}: Props) {
  const fcRef = useRef<FullCalendar | null>(null);
  const containerRef = useRef<HTMLDivElement>(null!);
  const ignoreSelect = useRef(false);

  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents||[]);
  const [createRange, setCreateRange] = useState<DateSelectArg | null>(null);
  const [editEvent, setEditEvent] = useState<EventClickArg | null>(null);
  const [popupPos, setPopupPos] = useState<{ left: number; top: number } | null>(null);

  // const { ReadAllByEmployee } = useAppointment();

  // const normalize = (apiData: any[]): CalendarEvent[] =>
  //   apiData.map((a) => {
  //     const start = a.start_time;
  //     const end = a.end_time;

  //     return {
  //       id: String(a.id),
  //       start,
  //       end,
  //       start_time: start,
  //       end_time: end,

  //       backgroundColor: a.color ?? "#4f46e5",
  //       textColor: getContrast(a.color ?? "#4f46e5"),

  //       description: a.description,

  //       client_ids: a.client_ids,
  //       clients: a.client_ids,

  //       participant_employee_ids: a.participant_employee_ids,
  //       location: a.location,
  //       recurrence_type: a.recurrence_type,
  //       recurrence_interval: a.recurrence_interval,
  //       recurrence_end_date: a.recurrence_end_date,
  //     };
  //   });

  const loadEvents = async (start: Date, end: Date) => {
    try {
      // const data = await ReadAllByEmployee(employeeId, {
      //   start_date: start.toISOString(),
      //   end_date: end.toISOString(),
      // });
      // setEvents(normalize(data));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Could not fetch appointments", err);
    }
  };

  useEffect(() => {
    if (!fcRef.current) return;
    const view = fcRef.current.getApi().view;
    loadEvents(view.currentStart, view.currentEnd);
  }, [employeeId]);

  const openPopupAt = (x: number, y: number) => {
    setPopupPos({
      left: Math.min(Math.max(0, x), window.innerWidth - POPUP_WIDTH),
      top: Math.min(Math.max(0, y), window.innerHeight - POPUP_HEIGHT),
    });
  };

  const closePopup = () => {
    if (createRange) createRange.view.calendar.unselect();
    setCreateRange(null);
    setEditEvent(null);
    setPopupPos(null);
  };

  const handleDateSelect = (info: DateSelectArg) => {
    setEditEvent(null);
    setCreateRange(info);
    openPopupAt(info.jsEvent!.clientX, info.jsEvent!.clientY);
  };

  const handleEventClick = (click: EventClickArg) => {
    setCreateRange(null);
    setEditEvent(click);
    openPopupAt(click.jsEvent!.clientX, click.jsEvent!.clientY);
  };

  const handleUpsert = (dto: CalendarEventDTO, isEdit: boolean) => {
    const api = fcRef.current?.getApi();
    if (!api) return;

    if (isEdit) {
      const ev = api.getEventById(dto.id);
      if (ev) {
        ev.setStart(dto.start_time);
        ev.setEnd(dto.end_time);
        ev.setProp("backgroundColor", dto.backgroundColor);
        ev.setProp("textColor", dto.textColor);
        ev.setProp("title", dto.description ?? "");
        Object.entries(dto).forEach(([k, v]) => ev.setExtendedProp(k, v));
      }
      setEvents(prev => prev.map(e => (e.id === dto.id ? 
        { ...e, 
          ...dto,
          recurrence_type: e.recurrence_type || dto.recurrence_type || undefined,
        end_time:typeof dto.end_time === "string" ? new Date(dto.end_time):dto.end_time,
        start_time:typeof dto.start_time === "string" ? new Date(dto.start_time):dto.start_time,
        recurrence_end_date:typeof dto.recurrence_end_date === "string" ? new Date(dto.recurrence_end_date):dto.recurrence_end_date,
      } 
        : e)));
    } else {
      const {
        id,
        start_time,
        end_time,
        backgroundColor,
        textColor,
        description,
        ...restProps
      } = dto;


      api.addEvent({
        id,
        start: start_time,
        end: end_time,
        backgroundColor,
        textColor,
        title: description ?? "",
        ...restProps,
      });
      setEvents(prev => prev.concat(dto as unknown as CalendarEvent));
    }
    closePopup();
  };

  const handleDelete = (id: string) => {
    fcRef.current?.getApi().getEventById(id)?.remove();
    setEvents(prev => prev.filter(e => e.id !== id));
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
