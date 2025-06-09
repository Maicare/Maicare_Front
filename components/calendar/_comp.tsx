"use client";

import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg,  EventClickArg } from "@fullcalendar/core";
import "react-datepicker/dist/react-datepicker.css";
import BookingPopup, { CalendarEventDTO } from "./_comp2";
import { Any } from "@/common/types/types";

const getContrastColor = (hex: string): string => {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000" : "#fff";
};

export type CalendarEvent = {
  id: string;
  title: string;
  description?: string;
  start: string | Date;
  end: string | Date;
  allDay?: boolean;
  backgroundColor?: string;
  textColor?: string;
};


interface BookingCalendarProps {
  initialEvents?: CalendarEvent[];
}

const POPUP_WIDTH = 320;
const POPUP_HEIGHT = 460;

const BookingCalendar = ({ initialEvents = [] }: BookingCalendarProps) => {
  const ignoreSelect = useRef(false);
  const calendarRef = useRef<FullCalendar | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [createRange, setCreateRange] = useState<DateSelectArg | null>(null);
  const [editEvent, setEditEvent] = useState<EventClickArg | null>(null);
  const [popupPos, setPopupPos] = useState<{ left: number; top: number } | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
  const [_startDate, setStartDate] = useState<Date>(
    createRange?.start ? new Date(createRange.start) : new Date()
  );
  const [_endDate, setEndDate] = useState<Date>(
    createRange?.end ? new Date(createRange.end) : new Date()
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    editEvent?.event.backgroundColor ?? "#4f46e5"
  );

  const initializedRef = useRef(false);

  // ➌ helper that closes the popup only when something really changed
  const handleDatesSet = () => {
    if (initializedRef.current && popupPos) {
      closePopup();          // popup is showing → hide it
    }
    initializedRef.current = true;
  };

  const openPopupAt = (clientX: number, clientY: number) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const target = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
    const slot = target?.closest(".fc-daygrid-day, .fc-timegrid-slot") as HTMLElement | null;
    const anchorRect = (slot ?? target)?.getBoundingClientRect() ?? {
      left: clientX,
      right: clientX,
      top: clientY,
      bottom: clientY,
    };

    const leftRel = anchorRect.left - containerRect.left;
    const rightRel = anchorRect.right - containerRect.left;
    const topRel = anchorRect.top - containerRect.top;
    const bottomRel = anchorRect.bottom - containerRect.top;

    const left = rightRel + POPUP_WIDTH <= containerRect.width
      ? rightRel
      : leftRel >= POPUP_WIDTH
        ? leftRel - POPUP_WIDTH
        : Math.max(containerRect.width - POPUP_WIDTH, 0);

    const top = bottomRel + POPUP_HEIGHT <= containerRect.height
      ? bottomRel
      : topRel >= POPUP_HEIGHT
        ? topRel - POPUP_HEIGHT
        : Math.max(containerRect.height - POPUP_HEIGHT, 0);

    setPopupPos({ left, top });
  };

  useEffect(() => {
    if (!isDragging || !dragOffset) return;
    const onMouseMove = (e: MouseEvent) => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;
      let left = e.clientX - containerRect.left - dragOffset.x;
      let top = e.clientY - containerRect.top - dragOffset.y;
      left = Math.max(0, Math.min(containerRect.width - POPUP_WIDTH, left));
      top = Math.max(0, Math.min(containerRect.height - POPUP_HEIGHT, top));
      setPopupPos({ left, top });
    };
    const onMouseUp = () => {
      setIsDragging(false);
      setDragOffset(null);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleDateSelect = (info: DateSelectArg) => {
    if (info.view.type === "dayGridMonth") {
      const target = info.jsEvent?.target as HTMLElement | null;
      const cell = target?.closest('.fc-daygrid-day');

      if (cell?.classList.contains('fc-day-other')) {
        info.view.calendar.unselect();
        calendarRef.current?.getApi().changeView("timeGridDay", info.start);
        return;
      }

      const clickedNumber = target?.closest(".fc-daygrid-day-number");
      if (clickedNumber) {
        info.view.calendar.unselect();
        calendarRef.current?.getApi().changeView("timeGridDay", info.start);
        return;
      }
    }

    setEditEvent(null);
    setCreateRange(info);
    openPopupAt(info.jsEvent!.clientX, info.jsEvent!.clientY);
  };

  useEffect(() => {
    if (createRange) {
      setStartDate(new Date(createRange.start));
      setEndDate(new Date(createRange.end));
      setSelectedColor('#4f46e5');
    } else if (editEvent) {
      setStartDate(editEvent.event.start!);
      setEndDate(editEvent.event.end!);
      setSelectedColor(editEvent.event.backgroundColor);
    }
  }, [createRange, editEvent]);

  useEffect(() => {
    if (editEvent) {
      const ev = editEvent.event
      const el = editEvent.el as HTMLElement | null
      const fg = getContrastColor(selectedColor)

      ev.setProp('backgroundColor', selectedColor)
      ev.setProp('textColor', fg)

      if (el) {
        el.style.backgroundColor = selectedColor
        el.style.borderColor = 'transparent'
        el.style.color = fg
      }

      return
    }

    if (createRange) {
      document.querySelectorAll<HTMLElement>('.fc-event-mirror')
        .forEach((el) => {
          el.style.backgroundColor = selectedColor
          el.style.borderColor = 'transparent'
          el.style.color = getContrastColor(selectedColor)
        })
    }
  }, [selectedColor, editEvent, createRange]);

  const STORAGE_KEY = "bookings";

  type Stored = CalendarEventDTO;

  const loadBookings = (): Stored[] => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
      return [];
    }
  };

  const dtoToEvent = (dto: Stored): CalendarEvent & { extendedProps: Any } => ({
    id: dto.id,
    title: dto.description ?? "(No title)",
    description: dto.description,
    start: new Date(dto.start_time),
    end: new Date(dto.end_time),
    allDay: false,
    backgroundColor: dto.backgroundColor,
    textColor: dto.textColor,
    extendedProps: dto,
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    if (typeof window === "undefined") return initialEvents;
    return loadBookings().map(dtoToEvent);
  });

  const handleEventClick = (clickInfo: EventClickArg) => {
    setCreateRange(null);
    setEditEvent(clickInfo);
    openPopupAt(clickInfo.jsEvent!.clientX, clickInfo.jsEvent!.clientY);
  };

  const closePopup = () => {
    if (createRange) createRange.view.calendar.unselect();
    setCreateRange(null);
    setEditEvent(null);
    setPopupPos(null);
  };

  const handleUpsert = (payload: CalendarEventDTO, isEdit: boolean) => {
    const api = calendarRef.current?.getApi();
    if (!api) return;

    if (isEdit) {
      // ───── update an existing event ────────────────────────────────
      const evApi = api.getEventById(payload.id);
      if (!evApi) return;

      const isTimed =
        payload.start_time.getHours() !== 0 ||
        payload.start_time.getMinutes() !== 0 ||
        payload.end_time.getHours() !== 0 ||
        payload.end_time.getMinutes() !== 0;

      // switch from all-day ➜ timed when needed
      if (isTimed && evApi.allDay) {
        evApi.setAllDay(false, { maintainDuration: true });
      }

      evApi.setStart(payload.start_time);
      evApi.setEnd(payload.end_time);
      evApi.setProp("title", payload.description ?? "(No title)");
      evApi.setExtendedProp("description", payload.description);
      evApi.setProp("backgroundColor", payload.backgroundColor);
      evApi.setProp("textColor", payload.textColor);

      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === payload.id
            ? {
              ...ev,
              title: payload.description ?? "(No title)",
              description: payload.description,
              start: payload.start_time,
              end: payload.end_time,
              backgroundColor: payload.backgroundColor,
              textColor: payload.textColor,
            }
            : ev
        )
      );
    } else {
      // ───── create a brand-new event ────────────────────────────────
      const newEvent = {
        id: payload.id,
        title: payload.description ?? "(No title)",
        description: payload.description,
        start: payload.start_time,
        end: payload.end_time,
        allDay: false,
        backgroundColor: payload.backgroundColor,
        textColor: payload.textColor,
        extendedProps: payload,
      } as CalendarEvent & { extendedProps: Any };

      api.addEvent(newEvent);
      setEvents((prev) => [...prev, newEvent]);
    }

    closePopup();
  };

  const handleDelete = (eventId: string) => {
    const evApi = calendarRef.current?.getApi().getEventById(eventId);
    if (evApi) evApi.remove();

    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    closePopup();
  };

  return (
    <div ref={containerRef} className="relative">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        views={{
          timeGridWeek: {
            buttonText: "Week",
          },
          workWeek: {
            type: "timeGridWeek",
            hiddenDays: [0, 6],
            buttonText: "Work Week",
          },
        }}
        headerToolbar={{
          start: "prev,next today",
          center: "title",
          end: "dayGridMonth,timeGridWeek,workWeek,timeGridDay",
        }}
        selectable
        allDaySlot={false}

        unselectAuto={false}
        unselectCancel=".fc-popup"
        selectMirror
        select={handleDateSelect}
        eventClick={handleEventClick}
        events={events}
        nowIndicator
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        height="auto"
        aspectRatio={1.35}
        dayMaxEvents={4}
        dayHeaderClassNames={(args) =>
          args.isToday
            ? ["bg-indigo-600", "text-white", "font-semibold"]
            : ["bg-slate-50", "text-slate-700", "font-semibold"]
        }
        dayHeaderContent={(args) => {
          const weekday = new Intl.DateTimeFormat("en", {
            weekday: "short",
          }).format(args.date);
          if (args.view.type === "dayGridMonth") {
            return <span className="text-sm">{weekday}</span>;
          }
          const dayNum = new Intl.DateTimeFormat("en", {
            day: "numeric",
          }).format(args.date);
          return (
            <div className="flex flex-col items-center">
              <span className="text-sm">{weekday}</span>
              <button
                type="button"
                className="text-xl font-semibold mt-3 cursor-pointer transition-colors rounded-full px-3 py-2 hover:bg-indigo-600 hover:text-white"
                onClick={() =>
                  calendarRef.current?.getApi().changeView("timeGridDay", args.date)
                }
              >
                {dayNum}
              </button>
            </div>
          );
        }}
        dayCellDidMount={(info) => {
          if (info.view.type !== "dayGridMonth") return;

          const numEl = info.el.querySelector<HTMLAnchorElement>(
            ".fc-daygrid-day-number"
          );

          if (numEl) {
            numEl.classList.add(
              "cursor-pointer", "hover:bg-indigo-600", "hover:text-white",
              "rounded-full", "transition-colors"
            );

            numEl.addEventListener("click", () => {
              ignoreSelect.current = true;
              calendarRef.current?.getApi()
                .changeView("timeGridDay", info.date);
            });
          }
        }}
        eventContent={(arg) => {
          const desc =
            arg.isMirror && !arg.event.extendedProps.description
              ? "(No Description)"
              : (arg.event.extendedProps.description as string | undefined);
          const employees = arg.event.extendedProps.participant_employee_ids?.length || 0;
          const clients = arg.event.extendedProps.client_ids?.length || 0;

          return (
            <div className="fc-event-content-container p-1.5">
              {desc && (
                <div className="fc-event-description text-sm leading-snug line-clamp-3">
                  {desc}
                </div>
              )}
              {(employees > 0 || clients > 0) && (
                <div className="fc-event-meta mt-1.5 flex items-center gap-2 text-[0.65rem]">
                  {employees > 0 && (
                    <span className="fc-event-employees flex items-center bg-black/10 rounded-full px-1.5 py-0.5">
                      <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      {employees}
                    </span>
                  )}
                  {clients > 0 && (
                    <span className="fc-event-clients flex items-center bg-black/10 rounded-full px-1.5 py-0.5">
                      <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      {clients}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        }}
        eventDidMount={(info) => {
          const bg = info.event.backgroundColor || '#4f46e5';
          const el = info.el as HTMLElement;

          // Apply background and text colors
          el.style.backgroundColor = bg;
          el.style.borderColor = 'transparent';
          el.style.color = getContrastColor(bg);

          // Add subtle shadow and smooth transitions
          el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
          el.style.transition = 'all 0.2s ease';
          el.style.borderRadius = '6px';
          el.style.padding = '4px';

          // Hover effects
          el.addEventListener('mouseenter', () => {
            el.style.transform = 'translateY(-1px)';
            el.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            el.style.zIndex = '100';
          });
          el.addEventListener('mouseleave', () => {
            el.style.transform = '';
            el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            el.style.zIndex = '';
          });

          // For all-day events, make them full width
          if (info.event.allDay) {
            el.style.width = 'calc(100% - 4px)';
            el.style.margin = '2px';
          }
        }}
        viewDidMount={(arg) => {
          if (!arg.view.type.startsWith('timeGrid')) return;

          const frame = arg.el.querySelector<HTMLElement>(
            '.fc-timegrid-axis-frame'
          );
          if (frame) {
            frame.style.fontSize = '0.75rem';
            frame.style.fontWeight = '500';
            frame.style.padding = '2px 4px';
            frame.style.whiteSpace = 'nowrap';
            frame.title = Intl.DateTimeFormat().resolvedOptions().timeZone;
          }
        }}
        eventClassNames="border rounded-lg px-2 py-1 transition-colors"
        dayCellClassNames="bg-white hover:bg-slate-50 transition-colors"
        viewClassNames=" rounded-lg overflow-hidden p-2"
        buttonText={{
          today: "Today",
          month: "Month",
          timeGridWeek: "Week",
          workWeek: "Work Week",
          day: "Day",
        }}
        datesSet={handleDatesSet}
      />

      {/* {popupPos && (createRange || editEvent) && popupPos && (
        <div
          key={
            createRange
              ? `${createRange.start.valueOf()}-${createRange.end.valueOf()}`
              : editEvent!.event.id
          }
          className="fc-popup absolute z-50 w-80 bg-white border border-slate-200 shadow-xl rounded-lg flex flex-col"
          style={{ left: popupPos.left, top: popupPos.top, width: POPUP_WIDTH, maxHeight: POPUP_HEIGHT }}

        >
          <div
            className="flex items-center justify-end w-full h-8 bg-slate-100 border-b border-slate-200 cursor-move select-none px-2"
            onMouseDown={(e) => {
              if ((e.target as HTMLElement).closest(".close-btn")) return;
              e.preventDefault();
              if (!popupPos) return;
              const containerRect = containerRef.current?.getBoundingClientRect();
              if (!containerRect) return;
              const offsetX = e.clientX - containerRect.left - popupPos.left;
              const offsetY = e.clientY - containerRect.top - popupPos.top;
              setDragOffset({ x: offsetX, y: offsetY });
              setIsDragging(true);
            }}
          >
            <button
              type="button"
              className="close-btn p-1"
              onClick={(e) => {
                e.stopPropagation();
                closePopup();
              }}
            >
              <X className="w-4 h-4 text-slate-500 hover:text-slate-700" />
            </button>
          </div>
          <div className="p-4 flex-1 overflow-y-auto form-scroll">
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <input
                  id="title"
                  name="title"
                  placeholder="Add title"
                  defaultValue={editEvent?.event.title}
                  required
                  autoFocus
                  className="w-full text-xl font-semibold border-0 border-b-2 border-slate-200 focus:border-indigo-600 focus:ring-0 focus:outline-none px-0 py-2 rounded-none placeholder-slate-400 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <textarea
                  id="description"
                  name="description"
                  placeholder="Add description..."
                  defaultValue={
                    editEvent
                      ? (editEvent.event.extendedProps.description as string) ?? ""
                      : ""
                  }
                  rows={2}
                  className="w-full border-0 border-b-2 border-slate-200 focus:border-indigo-600 focus:ring-0 focus:outline-none px-0 py-2 rounded-none placeholder-slate-400 transition-colors resize-none"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 group">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <CalendarIcon className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex-1 flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="text-sm px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          {format(startDate, "MMM d")}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white rounded-md shadow-lg">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => date && setStartDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <ReactDatePicker
                      selected={startDate}
                      onChange={(date) => date && setStartDate(date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="HH:mm"
                      timeFormat="HH:mm"
                      className="text-sm px-2 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg w-24 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 group">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex-1 flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="text-sm px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          {format(endDate, "MMM d")}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white rounded-md shadow-lg">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={(date) => date && setEndDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <ReactDatePicker
                      selected={endDate}
                      onChange={(date) => date && setEndDate(date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="HH:mm"
                      timeFormat="HH:mm"
                      className="text-sm px-2 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg w-24 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: selectedColor }}
                  />
                </div>
                <div className="flex gap-2">
                  {['#4f46e5', '#10b981', '#ef4444', '#eab308', '#8b5cf6'].map((color) => (
                    <label
                      key={color}
                      className="w-8 h-8 rounded-full cursor-pointer border-2 border-transparent hover:border-slate-200 transition-all"
                      style={{ backgroundColor: color }}
                    >
                      <input
                        type="radio"
                        name="color"
                        value={color}
                        checked={selectedColor === color}
                        onChange={() => setSelectedColor(color)}
                        className="sr-only"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-6">
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={closePopup}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Save
                </Button>
                {editEvent && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div >
      )} */}
      {popupPos && (createRange || editEvent) && (
        <BookingPopup
          key={
            createRange
              ? `${createRange.start.getTime()}-${createRange.end.getTime()}`
              : editEvent!.event.id                // edit flow ⇒ event id
          }
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

         .fc-event {
            border-radius: 6px !important;
            padding: 4px !important;
            margin: 1px 2px !important;
            border: none !important;
          }

          .fc-event:hover {
            z-index: 100 !important;
          }

          .fc-event-content-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            gap: 2px;
          }

          .fc-event-description {
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            font-size: 0.8125rem;
            opacity: 0.95;
          }

          .fc-event-meta {
            margin-top: auto;
            display: flex;
            gap: 4px;
          }

          .fc-event-employees,
          .fc-event-clients {
            display: inline-flex;
            align-items: center;
            background-color: rgba(0,0,0,0.1);
            border-radius: 999px;
            padding: 0.125rem 0.5rem;
            font-weight: 500;
          }

          .fc-timegrid-event {
            border-radius: 6px !important;
          }

          .fc-daygrid-event {
            border-radius: 6px !important;
          }

          .fc-daygrid-block-event .fc-event-time {
            font-weight: 500;
          }

          .fc-daygrid-dot-event {
            border-radius: 6px !important;
          }

          .fc-event-mirror {
            opacity: 0.9 !important;
            z-index: 1000 !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          }

          .fc-event-main {
            padding: 0;
          }

          .fc-v-event {
            border-width: 0 !important;
          }

          .fc-event-main-frame {
            display: flex;
            flex-direction: column;
            height: 100%;
          }
        `}
      </style>
    </div >
  );
};

export default BookingCalendar;
