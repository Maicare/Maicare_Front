"use client";

import React, { FunctionComponent, useState, useEffect, MouseEvent, useRef } from "react";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";
import { useModal } from "@/components/providers/ModalProvider";
import AppointmentModal from "@/components/common/Modals/AppointmentModal";
import { useAppointment } from "@/hooks/appointment/use-appointment";
import { useAuth } from "@/common/hooks/use-auth";
import { set } from "nprogress";

// Helper: add days to a date
const addDays = (date: Date, days: number) =>
    new Date(date.getTime() + days * 86400000);

// Format month name (short)
const getMonthShort = (date: Date) =>
    date.toLocaleString("default", { month: "short" });

// Format time given a float hour value (e.g. 13.5 => "13:30")
const formatTime = (time: number) => {
    const hour = Math.floor(time);
    const minutes = Math.round((time - hour) * 60);
    return `${hour.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
};

const Calendar: React.FC = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const { open: openAppointmentModal } = useModal(AppointmentModal);

    const { user } = useAuth();
    const { appointments, addAppointment } = useAppointment({
        start_date: today.toISOString(),
        end_date: addDays(today, 7).toISOString()
    });

    console.log("APPPPP", appointments, user)

    // weekOffset in weeks; 0 means starting from today
    const [weekOffset, setWeekOffset] = useState<number>(0);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [daysToShow, setDaysToShow] = useState<number>(7);

    // Drag state for creating new events
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartY, setDragStartY] = useState<number | null>(null);
    const [dragEndY, setDragEndY] = useState<number | null>(null);
    const [popupInfo, setPopupInfo] = useState<{
        day: Date;
        top: number;
        startHour: number;
        endHour: number;
    } | null>(null);

    // Resize state for extending an existing popup
    const [resizeType, setResizeType] = useState<"top" | "bottom" | null>(null);
    const [resizeStartY, setResizeStartY] = useState<number | null>(null);
    const [initialPopupTop, setInitialPopupTop] = useState<number>(0);
    const [initialPopupHeight, setInitialPopupHeight] = useState<number>(0);

    // Moving state for dragging the entire popup
    const [isMoving, setIsMoving] = useState(false);
    const [moveOffset, setMoveOffset] = useState<number | null>(null);

    // Modal state to prevent multiple openings
    const [hasOpenedModal, setHasOpenedModal] = useState<boolean>(false);

    // Tooltip state for hovered appointments
    type HoveredApp = { app: any; rect: DOMRect };
    const [hoveredAppointment, setHoveredAppointment] = useState<HoveredApp | null>(null);

    // Fixed gap between day columns
    const gap = 12;

    // Calculate number of days based on available window width
    useEffect(() => {
        const updateDaysToShow = () => {
            const containerPadding = 32; // assuming p-4 on both sides (~16px each)
            const dayMinWidth = 260;
            const availableWidth = window.innerWidth - containerPadding;
            const days = Math.floor((availableWidth + gap) / (dayMinWidth + gap));
            setDaysToShow(days > 7 ? days : 7);
        };

        updateDaysToShow();
        window.addEventListener("resize", updateDaysToShow);
        return () => window.removeEventListener("resize", updateDaysToShow);
    }, []);

    // Compute base date for the current view
    const baseDate = addDays(today, weekOffset * 7);

    // Create the days for the view
    const daysArray = Array.from({ length: daysToShow }, (_, i) =>
        addDays(baseDate, i)
    );

    const year = baseDate.getFullYear();
    const hours = Array.from({ length: 24 }, (_, i) => i);

    // Calculate width for each day header and schedule column
    const dayWidth = `calc((100% - ${(daysToShow - 1) * gap}px) / ${daysToShow})`;

    // Handlers for initiating the drag on a day column (creating the popup)
    const handleMouseDown = (e: MouseEvent<HTMLDivElement>, day: Date) => {
        const boxRect = e.currentTarget.getBoundingClientRect();
        const startY = e.clientY - boxRect.top;
        setIsDragging(true);
        setDragStartY(startY);
        setDragEndY(startY);
        setPopupInfo({
            day,
            top: startY,
            startHour: startY / 64,
            endHour: startY / 64,
        });
        // Reset modal flag on new selection.
        setHasOpenedModal(false);
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (isDragging && !resizeType && !isMoving && popupInfo && dragStartY !== null) {
            const boxRect = e.currentTarget.getBoundingClientRect();
            const rawY = e.clientY - boxRect.top;

            // Only update the popup if dragging downward.
            if (rawY < dragStartY) {
                return;
            }

            // When dragging downward, desired boundaries are:
            const desiredTop = dragStartY;
            const desiredBottom = rawY;

            // Calculate the available gap on the day.
            const dayStr = popupInfo.day.toDateString();
            const sortedApps = (appointments || [])
                .filter(app => new Date(app.start_time).toDateString() === dayStr)
                .map(app => {
                    const startDt = new Date(app.start_time);
                    const endDt = new Date(app.end_time);
                    const startPx = (startDt.getHours() + startDt.getMinutes() / 60) * 64;
                    const endPx = (endDt.getHours() + endDt.getMinutes() / 60) * 64;
                    return { start: startPx, end: endPx };
                })
                .sort((a, b) => a.start - b.start);

            const dayStart = 0;
            const dayEnd = 24 * 64;

            // Determine the gap that contains dragStartY.
            let gapStart = dayStart;
            let gapEnd = dayEnd;
            for (const app of sortedApps) {
                if (dragStartY >= gapStart && dragStartY <= app.start) {
                    gapEnd = app.start;
                    break;
                }
                gapStart = app.end;
            }

            // Clamp desired boundaries into the available gap.
            let clampedTop = Math.max(desiredTop, gapStart);
            let clampedBottom = Math.min(desiredBottom, gapEnd);

            // Ensure a minimum height (e.g., 20px) so the popup is always visible.
            const minHeight = 20;
            if (clampedBottom - clampedTop < minHeight) {
                clampedBottom = clampedTop + minHeight;
                if (clampedBottom > gapEnd) {
                    clampedBottom = gapEnd;
                    clampedTop = gapEnd - minHeight;
                }
            }

            setDragEndY(clampedBottom);
            setPopupInfo({
                ...popupInfo,
                top: clampedTop,
                startHour: clampedTop / 64,
                endHour: clampedBottom / 64,
            });
        }
    };

    const handleMouseUp = () => {
        if (isDragging) {
            setIsDragging(false);
        }
        if (resizeType) {
            setResizeType(null);
        }
        if (popupInfo && dragStartY !== null && dragEndY !== null && !hasOpenedModal) {
            // Only open modal if the drag yielded a sufficient height.
            const minHeightThreshold = (15 / 60) * 64; // for example, 20 pixels
            if (dragEndY - dragStartY < minHeightThreshold) {
                // Do not open modal if the user didn't drag enough
                return;
            }

            // Create start date
            const { day, startHour, endHour } = popupInfo;
            const startDateObj = new Date(day);
            const startHourInt = Math.floor(startHour);
            const startMinutes = Math.round((startHour - startHourInt) * 60);
            startDateObj.setHours(startHourInt, startMinutes, 0, 0);

            // Create end date
            const endDateObj = new Date(day);
            const endHourInt = Math.floor(endHour);
            const endMinutes = Math.round((endHour - endHourInt) * 60);
            endDateObj.setHours(endHourInt, endMinutes, 0, 0);

            // Check for overlap with existing appointments on the same day.
            const appointmentsForDay = (appointments || []).filter(
                (app) => new Date(app.start_time).toDateString() === day.toDateString()
            );
            const overlapping = appointmentsForDay.filter((app) => {
                const appStart = new Date(app.start_time);
                const appEnd = new Date(app.end_time);
                return startDateObj < appEnd && endDateObj > appStart;
            });
            if (overlapping.length > 0) {
                alert("Cannot create an appointment that overlaps an existing event.");
                return;
            }

            // Open the modal only once per new selection.
            openAppointmentModal({
                startDate: startDateObj.toString(),
                endDate: endDateObj.toString(),
                addAppointment,
                resetPopup: () => setPopupInfo(null),
            });
            setHasOpenedModal(true);
        }
    };

    // Handlers for resizing the popup
    const handleResizeMouseDown = (e: MouseEvent, type: "top" | "bottom") => {
        e.stopPropagation();
        setResizeType(type);
        setResizeStartY(e.clientY);
        if (popupInfo) {
            setInitialPopupTop(popupInfo.top);
            setInitialPopupHeight(Math.abs(dragEndY! - dragStartY!));
        }
    };

    useEffect(() => {
        const handleResizeMouseMove = (e: globalThis.MouseEvent) => {
            if (!popupInfo || resizeStartY === null) return;

            const dayStr = popupInfo.day.toDateString();
            const appointmentsForDay = (appointments || []).filter(app =>
                new Date(app.start_time).toDateString() === dayStr
            );

            // bottom‑resize (fixed)
            if (resizeType === "bottom" && popupInfo) {
                const delta = e.clientY - resizeStartY!;
                // tentative new height
                let newHeight = initialPopupHeight + delta;
                if (newHeight > 20) {
                    // current top of our popup
                    const topPos = popupInfo.top;
                    // find the next appointment’s top‑pixel below our popup
                    const blockedTops = appointmentsForDay
                        .map(app => {
                            const s = new Date(app.start_time);
                            return (s.getHours() + s.getMinutes() / 60) * 64;
                        })
                        .filter(t => t > topPos);
                    const nextBlock = blockedTops.length ? Math.min(...blockedTops) : Infinity;
                    // clamp height so bottom = topPos + newHeight ≤ nextBlock
                    const maxHeight = nextBlock === Infinity ? newHeight : nextBlock - topPos;
                    newHeight = Math.min(newHeight, maxHeight);

                    setPopupInfo({
                        ...popupInfo,
                        endHour: (topPos + newHeight) / 64,
                    });
                    setDragEndY(topPos + newHeight);
                }
            }

            // top‐resize (new)
            if (resizeType === "top") {
                const delta = e.clientY - resizeStartY;
                let newTop = initialPopupTop + delta;
                let newHeight = initialPopupHeight - delta;
                if (newHeight > 20) {
                    // compute bottom‐pixels of existing appointments that end above the original top
                    const blockedBottoms = appointmentsForDay
                        .map(app => {
                            const en = new Date(app.end_time);
                            return (en.getHours() + en.getMinutes() / 60) * 64;
                        })
                        .filter(b => b < initialPopupTop);
                    const prevBlock = blockedBottoms.length ? Math.max(...blockedBottoms) : 0;
                    newTop = Math.max(newTop, prevBlock);
                    newHeight = initialPopupHeight + (initialPopupTop - newTop);

                    setPopupInfo({
                        ...popupInfo,
                        top: newTop,
                        startHour: newTop / 64,
                    });
                    setDragStartY(newTop);
                    setDragEndY(newTop + newHeight);
                }
            }
        };

        const handleResizeMouseUp = () => {
            if (resizeType) {
                setResizeType(null);
            }
        };

        window.addEventListener("mousemove", handleResizeMouseMove);
        window.addEventListener("mouseup", handleResizeMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleResizeMouseMove);
            window.removeEventListener("mouseup", handleResizeMouseUp);
        };
    }, [resizeType, resizeStartY, initialPopupTop, initialPopupHeight, popupInfo]);

    // Handlers for moving the popup around
    const handlePopupMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        // Start moving only if not resizing.
        if (popupInfo && !resizeType) {
            e.stopPropagation();
            setIsMoving(true);
            setMoveOffset(e.clientY - popupInfo.top);
        }
    };

    useEffect(() => {
        const handleMoveMouseMove = (e: globalThis.MouseEvent) => {
            if (!isMoving || moveOffset === null || !popupInfo || dragStartY === null || dragEndY === null) return;
            const newTop = e.clientY - moveOffset;
            const height = dragEndY - dragStartY;
            setPopupInfo({
                ...popupInfo,
                top: newTop,
                startHour: newTop / 64,
                endHour: (newTop + height) / 64,
            });
            setDragStartY(newTop);
            setDragEndY(newTop + height);
        };
        const handleMoveMouseUp = () => {
            if (isMoving) {
                setIsMoving(false);
                setMoveOffset(null);
            }
        };
        if (isMoving) {
            window.addEventListener("mousemove", handleMoveMouseMove);
            window.addEventListener("mouseup", handleMoveMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMoveMouseMove);
            window.removeEventListener("mouseup", handleMoveMouseUp);
        };
    }, [isMoving, moveOffset, popupInfo, dragStartY, dragEndY]);

    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={containerRef} className="p-4 relative">
            {/* Top Toolbar */}
            <div
                className="flex items-center justify-between mb-4 bg-white shadow px-4 py-2 rounded ml-16"
                style={{ width: "calc(100% - 4rem)" }} // 4rem equals the width of the hours sidebar (w-16)
            >
                <button
                    onClick={() => setWeekOffset(weekOffset - 1)}
                    className="p-2 rounded hover:bg-gray-100"
                >
                    &larr;
                </button>
                <div className="text-lg font-medium text-gray-700">{year}</div>
                <button
                    onClick={() => setWeekOffset(weekOffset + 1)}
                    className="p-2 rounded hover:bg-gray-100"
                >
                    &rarr;
                </button>
            </div>

            {/* Calendar Layout */}
            <div>
                {/* Day Headers Row */}
                <div className="ml-16 mb-2 flex" style={{ columnGap: `${gap}px` }}>
                    {daysArray.map((day, key) => (
                        <div
                            key={key}
                            onClick={() => setSelectedDate(day)}
                            style={{ width: dayWidth }}
                            className={`p-3 text-center rounded cursor-pointer transition
                                ${selectedDate && selectedDate.toDateString() === day.toDateString()
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-50 text-gray-700 hover:bg-blue-50"
                                }`}
                        >
                            <div className="text-xl font-semibold">{day.getDate()}</div>
                            <div className="text-sm">{getMonthShort(day)}</div>
                        </div>
                    ))}
                </div>

                {/* Schedule Area */}
                <div className="flex">
                    {/* Hours Sidebar */}
                    <div className="w-16">
                        {hours.map((hour, key) => (
                            <div
                                key={key}
                                className="h-16 border-b border-gray-200 text-right pr-1 text-xs text-gray-500"
                            >
                                {hour}:00
                            </div>
                        ))}
                    </div>
                    {/* Days Columns with grid lines */}
                    <div className="flex flex-1" style={{ columnGap: `${gap}px` }}>
                        {daysArray.map((day, key) => (
                            <div
                                key={key}
                                style={{ width: dayWidth, height: "1536px" }}
                                className="relative bg-white border border-gray-100 rounded"
                                onMouseDown={(e) => handleMouseDown(e, day)}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >
                                {hours.map((hour, key) => (
                                    <div
                                        key={key}
                                        className="absolute left-0 w-full border-t border-gray-200"
                                        style={{ top: hour * 64 }}
                                    />
                                ))}

                                {/* Render appointments for this day */}
                                {appointments &&
                                    appointments
                                        .filter(
                                            (app) =>
                                                new Date(app.start_time).toDateString() === day.toDateString()
                                        )
                                        .map((app, key) => {
                                            const start = new Date(app.start_time);
                                            const end = new Date(app.end_time);
                                            // Calculate top offset and height. 64px stands for one hour.
                                            const top = (start.getHours() + start.getMinutes() / 60) * 64;
                                            const height =
                                                ((end.getTime() - start.getTime()) / (60 * 60 * 1000)) * 64;
                                            return (
                                                <div
                                                    key={key}
                                                    className="absolute left-0 w-full bg-green-500 text-white text-xs rounded p-1 overflow-hidden"
                                                    style={{ top, height }}
                                                    onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        setHoveredAppointment({ app, rect });
                                                    }}
                                                    onMouseLeave={() => setHoveredAppointment(null)}
                                                >
                                                    <div className="truncate">
                                                        {app.description}
                                                        <br />
                                                        {formatTime(start.getHours() + start.getMinutes() / 60)} –{" "}
                                                        {formatTime(end.getHours() + end.getMinutes() / 60)}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                {/* Render selection popup if dragging and the day matches */}
                                {popupInfo && popupInfo.day.toDateString() === day.toDateString() && (
                                    <div
                                        className="absolute left-0 w-full bg-blue-500 text-white text-xs rounded shadow flex flex-col"
                                        style={{
                                            top: Math.min(dragStartY!, dragEndY!),
                                            height: Math.abs(dragEndY! - dragStartY!),
                                        }}
                                    >
                                        {/* Top resize handle */}
                                        <div
                                            className="h-2 cursor-ns-resize"
                                            onMouseDown={(e) => handleResizeMouseDown(e, "top")}
                                        />
                                        {/* Popup body with move functionality */}
                                        <div
                                            className="flex-1 flex items-center justify-center cursor-move"
                                            onMouseDown={handlePopupMouseDown}
                                        >
                                            {formatTime(popupInfo.startHour)} –{" "}
                                            {formatTime(popupInfo.endHour)}
                                        </div>
                                        {/* Bottom resize handle */}
                                        <div
                                            className="h-2 cursor-ns-resize"
                                            onMouseDown={(e) => handleResizeMouseDown(e, "bottom")}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Render a single tooltip if an appointment is hovered */}
            {hoveredAppointment && containerRef.current && (
                (() => {
                    // Get container bounds
                    const containerRect = containerRef.current.getBoundingClientRect();
                    return (
                        <div
                            className="absolute bg-black bg-opacity-50 text-white text-xxs rounded px-2 py-1 shadow-lg z-50"
                            style={{
                                // Position tooltip relative to the container
                                top: hoveredAppointment.rect.top - containerRect.top,
                                left:
                                    hoveredAppointment.rect.right -
                                    containerRect.left +
                                    5,
                                maxWidth: "200px",
                                whiteSpace: "normal",
                            }}
                        >
                            <div>
                                Location: {hoveredAppointment.app.location}
                            </div>
                            <div>Status: {hoveredAppointment.app.status}</div>
                            <div>
                                Created:{" "}
                                {new Date(
                                    hoveredAppointment.app.created_at
                                ).toLocaleString()}
                            </div>
                            <div>
                                Creator:{" "}
                                {hoveredAppointment.app.creator_employee_id}
                            </div>
                        </div>
                    );
                })()
            )}
        </div>
    );
};

const Page: FunctionComponent = () => {
    return (
        <>
            <Calendar />
        </>
    );
};

export default withAuth(
    withPermissions(Page, {
        redirectUrl: Routes.Common.NotFound,
        requiredPermissions: PermissionsObjects.ViewEmployee,
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);