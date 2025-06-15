"use client";

import {
  FunctionComponent,
  useEffect,
  useState,
} from "react";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { X, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { LocationSelect } from "@/components/employee/LocationSelect";
import { useSchedule } from "@/hooks/schedule/use-schedule";
import { scheduleSchema, CreateScheduleType } from "@/schemas/schedule.schemas";
import SingleEmployeeSelect from "./SingleEmployeeSelect";
import { ensureHex } from "@/utils/color-utils";
import { Any } from "@/common/types/types";

export type SchedulePayload = {
  id: string;
  employee_id: number;
  location_id: number;
  start_datetime: Date;
  end_datetime: Date;
  color: string;
};

export interface SchedulePopupProps {
  createRange: DateSelectArg | null;
  editEvent: EventClickArg | null;
  eventStart?: Date;
  eventEnd?: Date;
  position: { left: number; top: number };
  containerRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onUpsert: (p: SchedulePayload, isEdit: boolean) => void;
  onDelete: (id: string) => void;
  initialEmployeeId?: number;
  initialLocationId?: number;
}

const POPUP_WIDTH = 380;
const POPUP_HEIGHT = 450;

const SchedulePopup: FunctionComponent<SchedulePopupProps> = ({
  createRange,
  editEvent,
  eventStart,
  eventEnd,
  position,
  onClose,
  onUpsert,
  onDelete,
  initialEmployeeId,
  initialLocationId,
}) => {
  const { createSchedule, updateSchedule } = useSchedule();

  const computedStart: Date =
    editEvent?.event.start ?? eventStart ?? createRange?.start ?? new Date();
  const computedEnd: Date =
    editEvent?.event.end ?? eventEnd ?? createRange?.end ?? new Date();

  const form = useForm<CreateScheduleType>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      employee_id:
        editEvent?.event.extendedProps.employee_id ?? initialEmployeeId ?? 0,
      location_id:
        editEvent?.event.extendedProps.location_id ?? initialLocationId ?? 0,
      start_datetime: new Date(computedStart),
      end_datetime: new Date(computedEnd),
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    const baseStart = editEvent?.event.start ?? eventStart ?? createRange?.start;
    const baseEnd = editEvent?.event.end ?? eventEnd ?? createRange?.end;

    reset({
      employee_id:
        editEvent?.event.extendedProps.employee_id ?? initialEmployeeId ?? 0,
      location_id:
        editEvent?.event.extendedProps.location_id ?? initialLocationId ?? 0,
      start_datetime: new Date(baseStart ?? new Date()),
      end_datetime: new Date(baseEnd ?? new Date()),
    });
  }, [
    createRange,
    editEvent,
    eventStart,
    eventEnd,
    initialEmployeeId,
    initialLocationId,
    reset,
  ]);

  const [pos, setPos] = useState(position);
  const [isDragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(
    null
  );

  useEffect(() => setPos(position), [position]);
  useEffect(() => {
    if (!isDragging || !dragOffset) return;
    const move = (e: MouseEvent) =>
      setPos({
        left: Math.min(
          Math.max(0, e.clientX - dragOffset.x),
          window.innerWidth - POPUP_WIDTH
        ),
        top: Math.min(
          Math.max(0, e.clientY - dragOffset.y),
          window.innerHeight - POPUP_HEIGHT
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

  const onValid = async (data: CreateScheduleType) => {
    const startDt =
      typeof data.start_datetime === "string"
        ? new Date(data.start_datetime)
        : data.start_datetime;
    const endDt =
      typeof data.end_datetime === "string"
        ? new Date(data.end_datetime)
        : data.end_datetime;

    const assignedColor = ensureHex(
      editEvent?.event.extendedProps.color as string | undefined,
      data.employee_id
    );

    const apiPayload = {
      employee_id: data.employee_id,
      location_id: data.location_id,
      start_datetime: startDt,
      end_datetime: endDt,
      color: assignedColor,
    } as Any;

    const saved = editEvent
      ? await updateSchedule(editEvent.event.id, apiPayload)
      : await createSchedule(apiPayload);

    onUpsert(
      {
        id: editEvent?.event.id ?? String((saved as Any)?.id ?? Date.now()),
        employee_id: apiPayload.employee_id,
        location_id: apiPayload.location_id,
        start_datetime: apiPayload.start_datetime,
        end_datetime: apiPayload.end_datetime,
        color: assignedColor,
      },
      !!editEvent
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
            <FormField
              control={control}
              name="employee_id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SingleEmployeeSelect
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="location_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between text-slate-600 font-medium mb-1">
                    Location
                  </FormLabel>
                  <FormControl>
                    <LocationSelect
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
              name="start_datetime"
              control={control}
              render={({ field }) => (
                <DateTimeRow
                  labelIcon={CalendarIcon}
                  date={field.value as Date}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.start_datetime && (
              <p className="text-sm text-red-600">
                {errors.start_datetime.message}
              </p>
            )}

            <Controller
              name="end_datetime"
              control={control}
              render={({ field }) => (
                <DateTimeRow
                  labelIcon={Clock}
                  date={field.value as Date}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.end_datetime && (
              <p className="text-sm text-red-600">
                {errors.end_datetime.message}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-4">
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
              <Button
                size="sm"
                type="submit"
                className="bg-indigo-600 text-white"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SchedulePopup;

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
        timeFormat="HH:mm"
        className="text-sm px-2 py-1.5 bg-slate-100 rounded-lg w-24"
      />
    </div>
  </div>
);
