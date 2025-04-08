import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import BellIcon from "@/components/icons/BellIcon";
import { NOTIFICATIONS_VIEW } from "@/consts";
import Ping from "@/common/components/Ping";
import Notifications, { NotificationItem } from "./Notifications";
import { Any } from "@/common/types/types";

const fakeNotifications = {
    results: [
        {
            id: 1,
            metadata: {},
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            title: "New Task Assigned",
            event: "task",
            is_read: false,
            created: "2025-04-01T10:00:00",
        },
        {
            id: 2,
            metadata: {},
            content: "Payment of invoice #1234 has been processed.",
            title: "Payment Success",
            event: "payment",
            is_read: true,
            created: "2025-04-02T12:00:00",
        },
        {
            id: 3,
            metadata: {},
            content: "Client status updated. Please review the new details.",
            title: "Client Update",
            event: "client",
            is_read: false,
            created: "2025-04-03T15:30:00",
        },
    ],
};

const DropdownNotification = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const trigger = useRef<Any>(null);
    const dropdown = useRef<Any>(null);

    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (!dropdown.current) return;
            if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target))
                return;
            setDropdownOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
            if (!dropdownOpen || keyCode !== 27) return;
            setDropdownOpen(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });

    const { data, isLoading } = { data: fakeNotifications, isLoading: false };
    const hasUnread = useMemo(() => {
        if (!data) return false;
        return data?.results.some((n) => !n.is_read);
    }, [data]);

    return (
        <li className="relative">
            <Link
                ref={trigger}
                onClick={() => {
                    setDropdownOpen((isOpen) => !isOpen);
                }}
                href="#"
                className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-c_gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
            >
                <Ping className="absolute -top-0.5 right-0 z-1" pinging={hasUnread} />
                <BellIcon />
            </Link>

            {data && (
                <div
                    ref={dropdown}
                    className={`absolute -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80 ${dropdownOpen === true ? "block" : "hidden"
                        }`}
                >
                    <Notifications notifications={[]} />
                </div>
            )}
        </li>

    );
};

export default DropdownNotification;
