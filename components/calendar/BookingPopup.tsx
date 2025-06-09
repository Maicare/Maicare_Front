"use client";

import {
  FunctionComponent,
  useEffect,
  useState,
} from "react";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import {
  Controller,
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Any, Id } from "@/common/types/types";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Clock, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import MultiEmployeeSelect from "./MultiEmployeeSelect";
import MultiClientSelect from "./MultiClientSelect";
import RecurrenceSelect from "./RecurrenceSelect";
import { useCalendar } from "@/hooks/calendar/use-calendar";
import {
  appointmentSchema,
  CreateAppointmentType,
} from "@/schemas/calendar.schemas";
import { CalendarAppointment, RecurrenceType } from "@/types/calendar.types";
import { Input } from "../ui/input";

export type UpsertPayload = CreateAppointmentType & {
  id: string;
  textColor: string;
};

const POPUP_WIDTH = 380;
const POPUP_HEIGHT = 460;

export const allowedColors = [
  "#4f46e5",
  "#10b981",
  "#ef4444",
  "#eab308",
  "#8b5cf6",
] as const;

const contrastMap: Record<(typeof allowedColors)[number], "#000" | "#fff"> = {
  "#4f46e5": "#fff",
  "#10b981": "#fff",
  "#ef4444": "#fff",
  "#eab308": "#000",
  "#8b5cf6": "#fff",
};

/* cheap lookup with a safe fallback */
const getContrastColor = (hex: string) =>
  (contrastMap as Record<string, "#000" | "#fff">)[hex] ?? "#000";

export interface BookingPopupProps {
  createRange: DateSelectArg | null;
  editEvent: EventClickArg | null;
  position: { left: number; top: number };
  containerRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onUpsert: (p: UpsertPayload, isEdit: boolean) => void;
  onDelete: (id: string) => void;
  initialClientId?: number;
  initialEmployeeId?: number;
}

const BookingPopup: FunctionComponent<BookingPopupProps> = ({
  createRange,
  editEvent,
  position,
  onClose,
  onUpsert,
  onDelete,
  initialClientId,
  initialEmployeeId
}) => {
  const { createAppointment, updateAppointment } = useCalendar("");

  const initialStart =
    createRange?.start ?? editEvent?.event.start ?? new Date();
  const initialEnd =
    createRange?.end ?? editEvent?.event.end ?? new Date();

  const initialRecEnd =
    (editEvent?.event.extendedProps.recurrence_end_date as
      | string
      | undefined) ?? initialEnd;

  const form = useForm<CreateAppointmentType>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      client_ids: editEvent
        ? (editEvent.event.extendedProps.client_ids as Id[]) ?? []
        : initialClientId != null
          ? [initialClientId]
          : [],
      participant_employee_ids: editEvent
        ? (editEvent.event.extendedProps.participant_employee_ids as Id[]) ?? []
        : initialEmployeeId != null
          ? [initialEmployeeId]
          : [],
      description:
        (editEvent?.event.extendedProps.description as string) ?? "",
      location:
        (editEvent?.event.extendedProps.location as string) ?? "",
      start_time: new Date(initialStart),
      end_time: new Date(initialEnd),
      recurrence_type:
        (editEvent?.event.extendedProps.recurrence_type as RecurrenceType) ??
        RecurrenceType.NONE,
      recurrence_interval:
        (editEvent?.event.extendedProps.recurrence_interval as number) ??
        1,
      recurrence_end_date: new Date(initialRecEnd),
      color: editEvent?.event.backgroundColor ?? "#4f46e5",
    },
  });

  const { control,  handleSubmit, formState: { errors } } = form;

  const chosenColor = useWatch({
    control,
    name: "color",
  });

  useEffect(() => {
    const fg = getContrastColor(chosenColor ?? "#4f46e5");

    queueMicrotask(() => {
      if (editEvent) {
        editEvent.event.setProp("backgroundColor", chosenColor);
        editEvent.event.setProp("textColor", fg);
        (editEvent.el as HTMLElement).style.cssText = `
        background:${chosenColor};
        color:${fg};
        border:0;
      `;
      } else if (createRange) {
        document
          .querySelectorAll<HTMLElement>(".fc-event-mirror")
          .forEach((el) => {
            el.style.background = chosenColor ?? "#4f46e5";
            el.style.border = "none";
            el.style.color = fg;
          });
      }
    });
  }, [chosenColor, editEvent, createRange]);

  const [pos, setPos] = useState(position);
  const [isDragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(
    null,
  );

  useEffect(() => setPos(position), [position]);
  useEffect(() => {
    if (!isDragging || !dragOffset) return;
    const move = (e: MouseEvent) =>
      setPos({
        left: Math.min(
          Math.max(0, e.clientX - dragOffset.x),
          window.innerWidth - POPUP_WIDTH,
        ),
        top: Math.min(
          Math.max(0, e.clientY - dragOffset.y),
          window.innerHeight - POPUP_HEIGHT,
        ),
      });
    const up = () => {
      setDragging(false);
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
  }, [isDragging, dragOffset]);

  console.log('extProps on edit', editEvent?.event.extendedProps);


  const onValid = async (data: CreateAppointmentType) => {
    /* ---------- make sure all three date fields are true Date objects ---------- */
    const normalizedForApi: Partial<CalendarAppointment> = {
      client_ids: data.client_ids,
      participant_employee_ids: data.participant_employee_ids,
      description: data.description,
      location: data.location,
      start_time:
        typeof data.start_time === "string"
          ? new Date(data.start_time)
          : data.start_time,
      end_time:
        typeof data.end_time === "string"
          ? new Date(data.end_time)
          : data.end_time,
      recurrence_type: data.recurrence_type,
      recurrence_interval: data.recurrence_interval,
      recurrence_end_date:
        typeof data.recurrence_end_date === "string"
          ? new Date(data.recurrence_end_date)
          : data.recurrence_end_date,
      color: data.color,
    };

    const fg = getContrastColor(data.color ?? "#4f46e5");

    const saved = editEvent
      ? await updateAppointment(editEvent.event.id, normalizedForApi)
      : await createAppointment({
        ...data,
        ...normalizedForApi,
      });

    onUpsert(
      {
        id: editEvent?.event.id ?? String((saved as Any)?.id ?? Date.now()),
        ...data,
        textColor: fg,
      },
      !!editEvent,
    );
  };

  return (
    <div
      className="fc-popup fixed z-50 w-80 bg-white border border-slate-200 shadow-xl rounded-lg flex flex-col"
      style={{ ...pos, width: POPUP_WIDTH, maxHeight: POPUP_HEIGHT }}
    >
      <div
        className="flex items-center justify-end h-8 bg-slate-100 border-b border-slate-200 cursor-move select-none px-2"
        onMouseDown={(e) => {
          if ((e.target as HTMLElement).closest(".close-btn")) return;
          setDragging(true);
          setDragOffset({ x: e.clientX - pos.left, y: e.clientY - pos.top });
        }}
      >
        <button className="close-btn p-1" type="button" onClick={onClose}>
          <X className="h-4 w-4 text-slate-500 hover:text-slate-700" />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto form-scroll">
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={handleSubmit(onValid)}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Description */}
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Add description…"
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start time */}
            <Controller
              name="start_time"
              control={control}
              render={({ field }) => (
                <DateTimeRow
                  labelIcon={CalendarIcon}
                  date={field.value as Date}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.start_time && (
              <p className="text-sm text-red-600">
                {errors.start_time.message}
              </p>
            )}

            {/* End time */}
            <Controller
              name="end_time"
              control={control}
              render={({ field }) => (
                <DateTimeRow
                  labelIcon={Clock}
                  date={field.value as Date}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.end_time && (
              <p className="text-sm text-red-600">{errors.end_time.message}</p>
            )}

            {/* Clients */}
            <FormField
              control={control}
              name="client_ids"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MultiClientSelect
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Employees */}
            <FormField
              control={control}
              name="participant_employee_ids"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MultiEmployeeSelect
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between text-slate-600 font-medium mb-1">Location</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter location"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Recurrence */}
            <FormField
              control={control}
              name="recurrence_type"
              render={() => (
                <FormItem>
                  <FormControl>
                    <Controller
                      name="recurrence_type"
                      control={control}
                      render={({ field: tf }) => (
                        <Controller
                          name="recurrence_interval"
                          control={control}
                          render={({ field: intf }) => (
                            <Controller
                              name="recurrence_end_date"
                              control={control}
                              render={({ field: endf }) => (
                                <RecurrenceSelect
                                  type={tf.value as RecurrenceType}
                                  interval={intf.value}
                                  endDate={endf.value as Date}
                                  onTypeChange={tf.onChange}
                                  onIntervalChange={intf.onChange}
                                  onEndDateChange={endf.onChange}
                                />
                              )}
                            />
                          )}
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Color Picker */}
            <FormField
              control={control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <ColorPicker
                      value={field.value ?? "#4f46e5"}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-6">
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              {editEvent && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(editEvent.event.id)}
                >
                  Delete
                </Button>
              )}
              <Button size="sm" type="submit" className="bg-indigo-600 text-white">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default BookingPopup;

/* Helpers */

interface DateTimeRowProps {
  labelIcon: typeof CalendarIcon;
  date: Date;
  onChange: (d: Date) => void;
}
const DateTimeRow: FunctionComponent<DateTimeRowProps> = ({
  labelIcon: Icon,
  date,
  onChange,
}) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
      <Icon className="w-4 h-4 text-indigo-600" />
    </div>
    <div className="flex-1 flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="text-sm px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg"
          >
            {format(date, "MMM d")}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white rounded-md shadow-lg">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => d && onChange(d)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <ReactDatePicker
        selected={date}
        onChange={(d) => d && onChange(d)}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        dateFormat="HH:mm"
        className="text-sm px-2 py-1.5 bg-slate-100 rounded-lg w-24"
      />
    </div>
  </div>
);

interface ColorPickerProps {
  value: string;
  onChange: (v: string) => void;
}
const ColorPicker: FunctionComponent<ColorPickerProps> = ({
  value,
  onChange,
}) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: value }} />
    </div>
    <div className="flex gap-2">
      {["#4f46e5", "#10b981", "#ef4444", "#eab308", "#8b5cf6"].map((c) => (
        <label
          key={c}
          className="w-8 h-8 rounded-full cursor-pointer border-2 border-transparent hover:border-slate-200"
          style={{ backgroundColor: c }}
        >
          <input
            type="radio"
            name="color"
            className="sr-only"
            value={c}
            checked={value === c}
            onChange={() => onChange(c)}
          />
        </label>
      ))}
    </div>
  </div>
);
