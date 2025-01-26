"use client";

import React, { Fragment, FunctionComponent, useMemo } from "react";
import { Client as ClientType } from "@/types/client.types";
import MonthsBetween from "@/common/components/MonthsBetween";
import DetailCell from "../../common/DetailCell";
import { getRate, rateString } from "@/utils/rate-utils";

type Props = {
    client: ClientType | null;
};

const mockData = [
    {
        id: 1,
        care_type: "Physical Therapy",
        start_date: "2023-01-01",
        end_date: "2023-06-30",
        rate: 50,
        hours: 10,
        client_id: 123,
        sender_id: 456,
        price: 500,
        price_frequency: "monthly",
        reminder_period: 7, // Added missing property
        tax: 21, // Added missing property
        care_name: "Physical Therapy Program", // Added missing property
        status: "active", // Added missing property
        // Add the other 3 missing properties as needed
        // Example:
        contract_type: "standard",
        payment_method: "bank_transfer",
        notes: "Initial contract for physical therapy.",
    },
    {
        id: 2,
        care_type: "Occupational Therapy",
        start_date: "2022-05-15",
        end_date: "2023-05-14",
        rate: 60,
        hours: 15,
        client_id: 789,
        sender_id: 101,
        price: 900,
        price_frequency: "monthly",
        reminder_period: 7, // Added missing property
        tax: 21, // Added missing property
        care_name: "Occupational Therapy Program", // Added missing property
        status: "active", // Added missing property
        // Add the other 3 missing properties as needed
        contract_type: "standard",
        payment_method: "bank_transfer",
        notes: "Initial contract for occupational therapy.",
    },
]

const ClientContractsSummary: FunctionComponent<Props> = ({ client }) => {
    // const { data, isLoading, isError } = useClientContractsList(clientId, {
    //     page_size: 3,
    // });
    if (mockData.length === 0) return <div>Geen contracten gevonden voor huidige cliënt!</div>;
    return (
        <section className="grid grid-cols-3 gap-2">
            {mockData.map((item) => (
                <div className="contents cursor-pointer" key={item.id}>
                    <DetailCell label={"Soort Hulpverlening"} value={item.care_type} />
                    <DetailCell
                        label={"Zorgperiode"}
                        value={<MonthsBetween startDate={item.start_date} endDate={item.end_date} />}
                    />
                    <DetailCell label={rateString(item)} value={getRate(item)} />
                </div>
            ))}
        </section>
    );
};

export default ClientContractsSummary;
