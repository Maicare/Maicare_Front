"use client";

import React, { FunctionComponent } from "react";
import DetailCell from "../../common/DetailCell";
import { dateFormat } from "@/utils/timeFormatting";
import { useInvolvedEmployee } from "@/hooks/client-network/use-involved-employee";
import { Loader } from "lucide-react";

type Props = {
    clientId: number | undefined;
};

const InvolvedEmployeesSummary: FunctionComponent<Props> = ({ clientId }) => {

    const { involvedEmployees, isLoading } = useInvolvedEmployee({ clientId: clientId?.toString() })

    if (isLoading) return <Loader />;
    if (!involvedEmployees) return <div>Geen gegevens opgehaald.</div>;
    if (involvedEmployees.results?.length === 0) return <div>Geen noodcontacten gevonden</div>;
    return (
        <ul className="flex flex-col gap-2">
            {involvedEmployees?.results.map((employee) => {
                return (
                    <li
                        key={employee.id}
                        className="grid grid-cols-2 hover:bg-gray-3 dark:hover:bg-slate-700 p-4 cursor-pointer rounded-xl"
                    >
                        <DetailCell
                            ignoreIfEmpty={true}
                            label={employee.employee_name}
                            value={employee.role}
                        />
                        <DetailCell label={"Startdatum"} value={dateFormat(employee.start_date)} />
                    </li>
                );
            })}
        </ul>
    );
};

export default InvolvedEmployeesSummary;
