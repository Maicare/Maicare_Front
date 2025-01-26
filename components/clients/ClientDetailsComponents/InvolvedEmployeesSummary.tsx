"use client";

import React, { FunctionComponent } from "react";
import { useRouter } from "next/navigation";
import DetailCell from "../../common/DetailCell";
import Loader from "../../common/loader";
import { dateFormat } from "@/utils/timeFormatting";
import { EMPLOYEE_ASSIGNMENT_RECORD } from "@/consts";

type Props = {
    clientId: number | undefined;
};

const fakeData = [
    {
        id: 1,
        employee_name: "Alice Anderson",
        start_date: "2023-01-15",
        role: "program_counselor",
    },
    {
        id: 2,
        employee_name: "Bob Brown",
        start_date: "2023-02-10",
        role: "care_nurse",
    },
    {
        id: 3,
        employee_name: "Charlie Clark",
        start_date: "2023-03-05",
        role: "mentor",
    },
];

const InvolvedEmployeesSummary: FunctionComponent<Props> = ({ clientId }) => {
    // const { data, isLoading } = useEmergencyContacts(clientId);
    const router = useRouter();
    // if (isLoading) return <Loader />;
    // if (!data) return <div>Geen gegevens opgehaald.</div>;
    // if (data.results?.length === 0) return <div>Geen noodcontacten gevonden</div>;
    return (
        <ul className="flex flex-col gap-2">
            {fakeData.map((employee) => {
                return (
                    <li
                        key={employee.id}
                        className="grid grid-cols-2 hover:bg-gray-3 dark:hover:bg-slate-700 p-4 cursor-pointer rounded-xl"
                    >
                        <DetailCell
                            ignoreIfEmpty={true}
                            label={employee.employee_name}
                            value={EMPLOYEE_ASSIGNMENT_RECORD[employee.role as keyof typeof EMPLOYEE_ASSIGNMENT_RECORD]}
                        />
                        <DetailCell label={"Startdatum"} value={dateFormat(employee.start_date)} />
                    </li>
                );
            })}
        </ul>
    );
};

export default InvolvedEmployeesSummary;
