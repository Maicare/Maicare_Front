"use client";

import {
  FunctionComponent,
  useEffect,
  useState,
} from "react";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { Id } from "@/common/types/types";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Clock, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";

import MultiEmployeeSelect from "./MultiEmployeeSelect";
import MultiClientSelect from "./MultiClientSelect";
import { LocationSelect } from "@/components/employee/LocationSelect";
import RecurrenceSelect from "./RecurrenceSelect";
import { appointmentSchema, CreateAppointmentType } from "@/schemas/calendar.schemas";
import { RecurrenceType } from "@/types/calendar.types";

export type CalendarEventDTO = Omit<
  CreateAppointmentType,
  "start_time" | "end_time"
> & {
  id: string;
  start_time: Date;
  end_time: Date;
  backgroundColor: string;
  textColor: string;
};

const POPUP_WIDTH = 380;
const POPUP_HEIGHT = 460;
const STORAGE_KEY = "bookings";

const getContrastColor = (hex: string): string => {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000" : "#fff";
};

/* ───────────────────── helpers for localStorage ───────────────────── */
const loadBookings = (): CalendarEventDTO[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
};

const saveBookings = (events: CalendarEventDTO[]) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
/* ───────────────────────────────────────────────────────────────────── */

export interface BookingPopupProps {
  createRange: DateSelectArg | null;
  editEvent: EventClickArg | null;
  position: { left: number; top: number };
  containerRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onUpsert: (payload: CalendarEventDTO, isEdit: boolean) => void;
  onDelete: (eventId: string) => void;
}

const BookingPopup: FunctionComponent<BookingPopupProps> = ({
  createRange,
  editEvent,
  position,
  containerRef,
  onClose,
  onUpsert,
  onDelete,
}) => {
  /* ─────── state ─────── */
  const [startDate, setStartDate] = useState<Date>(
    createRange ? new Date(createRange.start) : editEvent?.event.start ?? new Date(),
  );
  const [endDate, setEndDate] = useState<Date>(
    createRange ? new Date(createRange.end) : editEvent?.event.end ?? new Date(),
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    editEvent?.event.backgroundColor ?? "#4f46e5",
  );
  const [selectedClientIds, setSelectedClientIds] = useState<Id[]>(
    (editEvent?.event.extendedProps.client_ids as Id[]) ?? [],
  );
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<Id[]>(
    (editEvent?.event.extendedProps.participant_employee_ids as Id[]) ?? [],
  );
  const [selectedLocation, setSelectedLocation] = useState<string | null>(
    (editEvent?.event.extendedProps.location as string) ?? null,
  );
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>(
    (editEvent?.event.extendedProps.recurrence_type as RecurrenceType) ??
    RecurrenceType.NONE,
  );
  const [recurrenceInterval, setRecurrenceInterval] = useState<number>(
    (editEvent?.event.extendedProps.recurrence_interval as number) ?? 1,
  );
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date | null>(() => {
    const raw = editEvent?.event.extendedProps.recurrence_end_date as string | undefined;
    return raw ? new Date(raw) : null;
  });
  const [formError, setFormError] = useState<string | null>(null);

  /* ─────── dragging ─────── */
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
  const [pos, setPos] = useState(position);
  useEffect(() => setPos(position), [position]);

  useEffect(() => {
    if (!isDragging || !dragOffset) return;
    const move = (e: MouseEvent) => {
      let left = e.clientX - dragOffset.x;
      let top = e.clientY - dragOffset.y;
      left = Math.max(0, Math.min(window.innerWidth - POPUP_WIDTH, left));
      top = Math.max(0, Math.min(window.innerHeight - POPUP_HEIGHT, top));
      setPos({ left, top });
    };
    const up = () => {
      setIsDragging(false);
      setDragOffset(null);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [isDragging, dragOffset, containerRef]);

  /* ─────── live color preview ─────── */
  useEffect(() => {
    const fg = getContrastColor(selectedColor);

    if (editEvent) {
      const ev = editEvent.event;
      ev.setProp("backgroundColor", selectedColor);
      ev.setProp("textColor", fg);
      const el = editEvent.el as HTMLElement | null;
      if (el) {
        el.style.backgroundColor = selectedColor;
        el.style.borderColor = "transparent";
        el.style.color = fg;
      }
      return;
    }

    if (createRange) {
      document.querySelectorAll<HTMLElement>(".fc-event-mirror").forEach((el) => {
        el.style.backgroundColor = selectedColor;
        el.style.borderColor = "transparent";
        el.style.color = fg;
      });
    }
  }, [selectedColor, editEvent, createRange]);

  /* ─────── submit ─────── */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const description = (
      e.currentTarget.elements.namedItem("description") as HTMLTextAreaElement
    ).value.trim();

    const payload: CreateAppointmentType = {
      client_ids: selectedClientIds,
      participant_employee_ids: selectedEmployeeIds,
      description,
      location: selectedLocation ?? "",
      start_time: startDate,
      end_time: endDate,
      recurrence_type: recurrenceType,
      recurrence_interval:
        recurrenceType === RecurrenceType.NONE ? 0 : Math.max(1, recurrenceInterval),
      recurrence_end_date:
        recurrenceType === RecurrenceType.NONE || !recurrenceEndDate
          ? endDate
          : recurrenceEndDate,
    };

    const parsed = appointmentSchema.safeParse(payload);
    if (!parsed.success) {
      setFormError(parsed.error.errors[0]?.message ?? "Check the form.");
      return;
    }

    const fg = getContrastColor(selectedColor);
    const dto: CalendarEventDTO = {
      id: editEvent?.event.id ?? Date.now().toString(),
      ...parsed.data,
      start_time:
        typeof parsed.data.start_time === "string"
          ? new Date(parsed.data.start_time)
          : parsed.data.start_time,
      end_time:
        typeof parsed.data.end_time === "string"
          ? new Date(parsed.data.end_time)
          : parsed.data.end_time,
      recurrence_end_date:
        typeof parsed.data.recurrence_end_date === "string"
          ? new Date(parsed.data.recurrence_end_date)
          : parsed.data.recurrence_end_date,
      backgroundColor: selectedColor,
      textColor: fg,
    };

    /* ── localStorage persistence ── */
    const bookings = loadBookings();
    if (editEvent) {
      const idx = bookings.findIndex((b) => b.id === dto.id);
      if (idx >= 0) bookings[idx] = dto;
      else bookings.push(dto);
    } else {
      bookings.push(dto);
    }
    saveBookings(bookings);
    /* ───────────────────────────── */

    onUpsert(dto, !!editEvent);
  };

  /* ─────── delete ─────── */
  const handleDeleteClick = () => {
    if (!editEvent) return;

    const bookings = loadBookings().filter((b) => b.id !== editEvent.event.id);
    saveBookings(bookings);

    onDelete(editEvent.event.id);
  };

  /* ─────── render ─────── */
  return (
    <div
      className="fc-popup fixed z-50 w-80 bg-white border border-slate-200 shadow-xl rounded-lg flex flex-col"
      style={{ ...pos, width: POPUP_WIDTH, maxHeight: POPUP_HEIGHT }}
    >
      {/* draggable header */}
      <div
        className="flex items-center justify-end w-full h-8 bg-slate-100 border-b border-slate-200 cursor-move select-none px-2"
        onMouseDown={(e) => {
          if ((e.target as HTMLElement).closest(".close-btn")) return;
          e.preventDefault();
          const rect = containerRef?.current?.getBoundingClientRect();
          if (!rect) return;
          setDragOffset({
            x: e.clientX - pos.left,
            y: e.clientY - pos.top,
          });
          setIsDragging(true);
        }}
      >
        <button
          className="close-btn p-1"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <X className="h-4 w-4 text-slate-500 hover:text-slate-700" />
        </button>
      </div>

      {/* form  */}
      <div className="p-4 flex-1 overflow-y-auto form-scroll">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* description */}
          <div className="space-y-2">
            <textarea
              id="description"
              name="description"
              defaultValue={
                editEvent?.event.extendedProps.description as string | undefined
              }
              placeholder="Add description..."
              rows={2}
              className="w-full border-0 border-b-2 border-slate-200 focus:border-indigo-600 focus:ring-0 focus:outline-none px-0 py-2 rounded-none placeholder-slate-400 transition-colors resize-none"
            />
          </div>

          {/* time pickers */}
          <div className="space-y-3">
            {[{ date: startDate, set: setStartDate, icon: CalendarIcon },
            { date: endDate, set: setEndDate, icon: Clock }].map(
              ({ date, set, icon: Icon }, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Icon className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex-1 flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="text-sm px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          {format(date, "MMM d")}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white rounded-md shadow-lg">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(d) => d && set(d)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <ReactDatePicker
                      selected={date}
                      onChange={(d) => d && set(d)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      dateFormat="HH:mm"
                      timeFormat="HH:mm"
                      className="text-sm px-2 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg w-24 transition-colors"
                    />
                  </div>
                </div>
              ),
            )}
          </div>

          {/* complex pickers */}
          <div className="space-y-4">
            <MultiClientSelect
              value={selectedClientIds}
              onChange={setSelectedClientIds}
            />

            <MultiEmployeeSelect
              value={selectedEmployeeIds}
              onChange={setSelectedEmployeeIds}
            />

            <div className="space-y-2">
              <Label className="text-slate-600 font-medium">Location</Label>
              <LocationSelect
                value={selectedLocation ?? ""}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedLocation(e.target.value || null)
                }
                className="w-full"
              />
            </div>

            <RecurrenceSelect
              type={recurrenceType}
              interval={recurrenceInterval}
              endDate={recurrenceEndDate}
              onTypeChange={setRecurrenceType}
              onIntervalChange={setRecurrenceInterval}
              onEndDateChange={setRecurrenceEndDate}
            />
          </div>

          {/* color picker */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: selectedColor }}
              />
            </div>
            <div className="flex gap-2">
              {["#4f46e5", "#10b981", "#ef4444", "#eab308", "#8b5cf6"].map(
                (c) => (
                  <label
                    key={c}
                    className="w-8 h-8 rounded-full cursor-pointer border-2 border-transparent hover:border-slate-200 transition-all"
                    style={{ backgroundColor: c }}
                  >
                    <input
                      type="radio"
                      name="color"
                      className="sr-only"
                      value={c}
                      checked={selectedColor === c}
                      onChange={() => setSelectedColor(c)}
                    />
                  </label>
                ),
              )}
            </div>
          </div>

          {/* errors */}
          {formError && (
            <p className="text-sm text-red-600 font-medium">{formError}</p>
          )}

          {/* actions */}
          <div className="flex justify-end gap-2 pt-6">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            {editEvent && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteClick}
              >
                Delete
              </Button>
            )}
            <Button size="sm" type="submit" className="bg-indigo-600 text-white">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingPopup;
