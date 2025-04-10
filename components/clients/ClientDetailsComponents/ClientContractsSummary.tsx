"use client";

import React, { FunctionComponent, useEffect } from "react";
import MonthsBetween from "@/common/components/MonthsBetween";
import DetailCell from "../../common/DetailCell";
import { getRate, rateString } from "@/utils/rate-utils";
import { useContract } from "@/hooks/contract/use-contract";
import Loader from "@/components/common/loader";
import { ContractItem } from "@/types/contracts.types";
import { Any } from "@/common/types/types";

type PropsType = {
    clientId: number;
};


const ClientContractsSummary: FunctionComponent<PropsType> = ({ clientId }) => {

    const [contracts, setContracts] = React.useState<Any>([]);
    const [loading, setLoading] = React.useState(true);

    const { readClientContracts } = useContract({})

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                // Simulate an API call to fetch contracts
                const response = await readClientContracts(clientId.toString());

                setContracts(response.results);
            } catch (error) {
                console.error("Error fetching contracts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContracts();
    }, []);


    if (loading) return <Loader />;
    if (contracts.length === 0) return <div>Geen contracten gevonden voor huidige cliënt!</div>;
    return (
        <section className="grid grid-cols-3 gap-2">
            {contracts.map((item: ContractItem) => (
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
